import test from 'ava';
import {hash, reverse} from '../src';

test('throws TypeErrors if invalid arguments', t => {
  const h = hash([123]);

  t.throws(() => reverse(h), 'The hashes argument should be an array of hashes provided by the hash method');
  t.throws(() => reverse([123], h.salts), 'The hashes you\'re reversing should only be strings');
  t.throws(() => reverse(h.hashes, 'a'), 'The salts argument should be an array of salt strings provided by the hash method');
  t.throws(() => reverse(h.hashes, h.salts, 37), 'The base should be a number between 16 and 36');
  t.throws(() => reverse(h.hashes, h.salts, 15), 'The base should be a number between 16 and 36');
  t.truthy(reverse(h.hashes, h.salts, h.base));
});

test('reverses a hash back to its id', t => {
  const h = hash([123]);

  t.deepEqual(reverse(h.hashes, h.salts), h.ids);
});
test('reverses multiple hashes back to their id', t => {
  const h = hash([1, 12, 123]);

  t.deepEqual(reverse(h.hashes, h.salts), h.ids);
});
test('requires a matching base', t => {
  const h = hash([123, 1234, 12345]);

  t.not(reverse(h.hashes, h.salts, 16)[0], h.ids[0]);
  t.not(reverse(h.hashes, h.salts, 16)[1], h.ids[1]);
  t.not(reverse(h.hashes, h.salts, 16)[2], h.ids[2]);
});
