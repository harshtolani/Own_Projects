import test from 'ava';
import {bunch} from '../src';

test('accepts no args if desired', t => {
  const b = bunch();
  t.true(typeof b === 'object');
  t.truthy(b);
  t.deepEqual(b.ids.length, 1);
  t.deepEqual(b.hashes.length, 1);
  t.deepEqual(b.salts.length, 2);
  t.deepEqual(b.base, 36);
});

test('throws TypeErrors if invalid arguments', t => {
  t.throws(() => bunch([123]), 'The num should be a number');
  t.throws(() => bunch(1, 'a'), 'The number of salts should be a positive integer');
  t.throws(() => bunch(1, 2, 15), 'The base should be a number between 16 and 36');
  t.throws(() => bunch(1, 2, 37), 'The base should be a number between 16 and 36');
  t.truthy(bunch(1, 2, 36));
});

test('returns the same number of hashes as ids', t => {
  t.deepEqual(bunch().hashes.length, 1);
  let ids = 1;
  t.deepEqual(bunch(ids).hashes.length, 1);
  ids = 2;
  t.deepEqual(bunch(ids).hashes.length, 2);
  ids = 3;
  t.deepEqual(bunch(ids).hashes.length, 3);
});

test('returns the same number of salts as specified', t => {
  t.deepEqual(bunch().salts.length, 2);
  t.deepEqual(bunch(1).salts.length, 2);
  t.deepEqual(bunch(1, 1).salts.length, 1);
  t.deepEqual(bunch(1, 2).salts.length, 2);
});

test('returns the same base as specified', t => {
  t.deepEqual(bunch().base, 36);
  t.deepEqual(bunch(1, 2).base, 36);
  t.deepEqual(bunch(1, 1, 36).base, 36);
  t.deepEqual(bunch(1, 2, 16).base, 16);
});

test('creates a stringified version of the ids', t => {
  t.true(typeof bunch(1).hashes[0] === 'string');
  t.true(typeof bunch(2).hashes[1] === 'string');
});

test('adds salts to the stringified id', t => {
  t.true(bunch(1).hashes[0].length > (99).toString(36).length);
});
