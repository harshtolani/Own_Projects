import test from 'ava';
import {hashish} from '../src';

test('created just a hash token', t => {
  const h = hashish();
  t.true(typeof h === 'string');
  t.regex(h, /[a-z0-9]{9,12}/);
});
