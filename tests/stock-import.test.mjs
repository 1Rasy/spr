import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync('stock_summary.html', 'utf8');

assert.match(html, /openImportFile\(\)/, '库存页应有导入库存按钮');
assert.match(html, /id="stockImportFile"/, '应有隐藏 Excel 文件输入框');
assert.match(html, /accept="\.xlsx,\.xls"/, '文件输入框应限制 Excel 文件');
assert.match(html, /A列员工编号，B列条码，C列库存散数/, '页面应说明导入模板格式');
assert.match(html, /parseImportQty/, '应解析 C 列库存散数');
assert.match(html, /Number\.isInteger\(qtyValue\)/, '库存散数应按整数校验');
assert.match(html, /qty<0/, '导入逻辑应允许并统计负数库存');
assert.match(html, /from\('van_stocks'\)\.upsert\(part,\{onConflict:'employee_code,product_barcode'\}\)/, '应按员工编号+条码 upsert 覆盖库存');
assert.match(html, /fetchExistingValues\('employees','employee_code'/, '导入前应校验员工编号存在');
assert.match(html, /fetchExistingValues\('products','barcode'/, '导入前应校验商品条码存在');

console.log('stock import static checks ok');
