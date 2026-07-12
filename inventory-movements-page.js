(function() {
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[char]);
  const stockAdjustmentApi = StockAdjustmentApi.create(client);
  let data = [];
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date());
  $('start').value = today;
  $('end').value = today;

  function quantityClass(value) {
    const amount = Number(value);
    if (amount > 0) return 'qty-positive';
    if (amount < 0) return 'qty-negative';
    return 'qty-zero';
  }

  function draw() {
    if (!data.length) {
      $('rows').innerHTML = '<tr class="empty-row"><td colspan="11">暂无库存流水</td></tr>';
    } else {
      $('rows').innerHTML = data.map(row => `<tr>
        <td class="cell-nowrap">${esc(row.employee_code)}</td>
        <td class="cell-nowrap">${esc(row.product_barcode)}</td>
        <td>${esc(StockAdjustmentCore.formatSpecFlavor(row))}</td>
        <td>${esc(row.reason_display)}</td>
        <td class="cell-number ${quantityClass(row.quantity_delta)}">${Number(row.quantity_delta) > 0 ? '+' : ''}${Number(row.quantity_delta)}</td>
        <td class="cell-nowrap">${esc(new Date(row.occurred_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }))}</td>
        <td class="cell-nowrap">${esc(InventoryMovementExport.TYPE_LABELS[row.movement_type] || row.movement_type)}</td>
        <td class="cell-nowrap">${esc(row.source_no)}</td>
        <td class="cell-number stock-number">${Number(row.quantity_before)}</td>
        <td class="cell-number stock-number">${Number(row.quantity_after)}</td>
        <td class="cell-nowrap">${esc(row.operator_code)}</td>
      </tr>`).join('');
    }
    $('status').className = 'status';
    $('status').textContent = `共 ${data.length} 条`;
    $('tableCount').textContent = `${data.length} 条`;
  }

  async function query() {
    $('status').className = 'status';
    $('status').textContent = '正在查询库存流水...';
    try {
      data = await stockAdjustmentApi.movements(
        $('start').value,
        $('end').value,
        $('employee').value,
        $('type').value,
      );
      if (!Array.isArray(data)) data = [];
      draw();
    } catch (error) {
      console.error(error);
      $('status').className = 'status error';
      $('status').textContent = `查询失败：${error.message || '未知错误'}`;
    }
  }

  async function init() {
    const { data: employees, error } = await client
      .from('employees')
      .select('employee_code,name')
      .eq('is_active', true)
      .order('employee_code');
    if (error) throw error;
    $('employee').innerHTML += (employees || []).map(employee => (
      `<option value="${esc(employee.employee_code)}">${esc(employee.employee_code)} ${esc(employee.name)}</option>`
    )).join('');
    $('query').onclick = query;
    $('refresh').onclick = query;
    $('export').onclick = () => {
      const book = InventoryMovementExport.createWorkbook(XLSX, data);
      XLSX.writeFile(book, InventoryMovementExport.inventoryExportFileName($('start').value, $('end').value));
    };
    await query();
  }

  init().catch(error => {
    $('status').className = 'status error';
    $('status').textContent = `加载失败：${error.message || '未知错误'}`;
  });
})();
