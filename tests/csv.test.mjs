import {test} from 'node:test';
import assert from 'node:assert/strict';
import {toCsv} from '../src/lib/csv.ts';

test('empty dataset produces no invented records', () => assert.equal(toCsv([]), ''));
test('quotes commas, double quotes and newlines', () => {
  assert.equal(toCsv([{name:'A, "B"\nC',empty:null}]), '\ufeff"name","empty"\r\n"A, ""B""\nC",""');
});
test('mitigates spreadsheet formula injection', () => {
  for(const prefix of ['=','+','-','@','\t','\r']) {
    assert.ok(toCsv([{value:prefix+'payload'}]).includes(`"'${prefix}payload"`));
  }
});
test('preserves Unicode and non-formula numbers', () => {
  const csv=toCsv([{name:'मराठी हिन्दी',amount:500}]);
  assert.ok(csv.startsWith('\ufeff'));
  assert.ok(csv.includes('"मराठी हिन्दी","500"'));
});
