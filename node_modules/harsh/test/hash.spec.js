import test from 'ava';
import {hash} from '../src';

test('accepts no args if desired', t => {
  const h = hash();
  t.true(typeof h === 'object');
  t.truthy(h);
  t.deepEqual(h.ids.length, 1);
  t.deepEqual(h.hashes.length, 1);
  t.deepEqual(h.salts.length, 2);
  t.deepEqual(h.base, 36);
});

test('throws TypeErrors if invalid arguments', t => {
  t.throws(() => hash(123), 'The ids argument should be an array of numbers');
  t.throws(() => hash(['a']), 'The ids you\'re hashing should only be numbers');
  t.throws(() => hash([123], 'a'), 'The number of salts should be a positive integer');
  t.throws(() => hash([123], 2, 15), 'The base should be a number between 16 and 36');
  t.throws(() => hash([123], 2, 37), 'The base should be a number between 16 and 36');
  t.truthy(hash([123], 2, 36));
});

test('returns the same number of hashes as ids', t => {
  t.deepEqual(hash().hashes.length, 1);
  const ids = [1];
  t.deepEqual(hash(ids).hashes.length, 1);
  ids.push(12);
  t.deepEqual(hash(ids).hashes.length, 2);
  ids.push(123);
  t.deepEqual(hash(ids).hashes.length, 3);
});

test('returns the same number of salts as specified', t => {
  t.deepEqual(hash().salts.length, 2);
  t.deepEqual(hash([123]).salts.length, 2);
  t.deepEqual(hash([123], 1).salts.length, 1);
  t.deepEqual(hash([123], 2).salts.length, 2);
});

test('returns the same base as specified', t => {
  t.deepEqual(hash().base, 36);
  t.deepEqual(hash([123], 2).base, 36);
  t.deepEqual(hash([123], 1, 36).base, 36);
  t.deepEqual(hash([123], 2, 16).base, 16);
});

test('creates a stringified version of the ids', t => {
  const re = new RegExp(`${(123).toString(36)}`);
  const re2 = new RegExp(`${(1234).toString(36)}`);
  t.regex(hash([123]).hashes[0], re);
  t.regex(hash([123, 1234]).hashes[1], re2);
});

test('adds salts to the stringified id', t => {
  const re = new RegExp(`${(123).toString(36)}`);
  t.regex(hash([123]).hashes[0], re);
  t.true(hash([123]).hashes[0].length > (123).toString(36).length);
});
