import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const api = require('../stock-adjustment-api.js');

function fakeClient() {
  const calls = [];
  return { calls, rpc: async (name, args) => { calls.push({ name, args }); return { data: { name, args }, error: null }; } };
}

test('requires an explicitly injected Supabase client', () => {
  assert.throws(() => api.create(), /Supabase client 鏈垵濮嬪寲/);
  assert.throws(() => api.create({}), /Supabase client 鏈垵濮嬪寲/);
});

test('uses the injected client for every stock adjustment RPC', async () => {
  const client = fakeClient(), service = api.create(client);
  await service.save('r1', 'E1', 'damage', '', '', [{ product_barcode: 'P1', adjustment_qty: 2 }]);
  await service.submit('r1', 'E1'); await service.withdraw('r1', 'E1'); await service.mine('E1', true);
  await service.pending(); await service.approve('r1', 'A1'); await service.reject('r1', 'A1', '鍘熷洜');
  await service.movements('2026-07-01', '2026-07-02', 'E1', 'manual_adjustment');
  assert.deepEqual(client.calls.map(x => x.name), ['save_stock_adjustment_request','submit_stock_adjustment_request','withdraw_stock_adjustment_request','get_my_stock_adjustment_requests','get_pending_stock_adjustment_requests','approve_stock_adjustment_request','reject_stock_adjustment_request','get_inventory_movement_details']);
  assert.deepEqual(client.calls[0].args, { p_request_id: 'r1', p_employee_code: 'E1', p_reason_code: 'damage', p_reason_note: null, p_remark: null, p_items: [{ product_barcode: 'P1', adjustment_qty: 2 }] });
  assert.deepEqual(client.calls[7].args, { p_start_date: '2026-07-01', p_end_date: '2026-07-02', p_employee_code: 'E1', p_movement_type: 'manual_adjustment' });
});

test('each page creates the shared API with its own declared client', () => {
  for (const path of ['store-stock-adjustment.js', 'stock-adjustment-review.js', 'inventory-movements-page.js']) {
    const source = fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
    assert.match(source, /StockAdjustmentApi\.create\(client\)/);
    assert.doesNotMatch(source, /StockAdjustmentApi\.(save|submit|withdraw|mine|pending|approve|reject|movements)\(/);
  }
});

test('maps missing migration RPC failures to a clear Chinese deployment message', async () => {
  const service = api.create({ rpc: async () => ({ data: null, error: { code: 'PGRST202', message: 'Could not find the function public.pending' } }) });
  await assert.rejects(service.pending(), /灏氭湭瀹屾垚鏁版嵁搴撻儴缃?);
});

