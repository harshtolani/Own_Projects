function _createSalts(n, base) {
  const salts = [];
  for (let i = 0; i < n; i++) {
    salts.push(Math.floor(Math.random() * Math.pow(10, 6)).toString(base));
  }
  return salts;
}

function _createHash(id, salts, base) {
  const hash = id.toString(base);
  const pieces = [...salts, hash];
  let hashString = '';
  do {
    const index = Math.floor(Math.random() * pieces.length);
    hashString += pieces[index];
    pieces.splice(index, 1);
  } while (pieces.length);
  return hashString;
}

/**
 * Takes a number and a radix base, outputs a salted hash
 * @param  {Array} ids   list of ids to hash
 * @param {Number} n number of salts to add to the hash
 * @param  {Number} base radix base, 16 through 36 allowed
 * @return {Object}      a hash object containing the hashes as well as info needed to reverse them
 */
export function hash(ids = [Math.floor(Math.random() * 100)], n = 2, base = 36) {
  if (!ids.splice) {
    throw new TypeError('The ids argument should be an array of numbers');
  }
  if (typeof n !== 'number' || n < 0) {
    throw new TypeError('The number of salts should be a positive integer');
  }
  if (typeof base !== 'number' || base < 16 || base > 36) {
    throw new TypeError('The base should be a number between 16 and 36');
  }

  // Create the salts. This will be the same for all hashes
  const salts = _createSalts(n, base);

  // Combine the salts and the actual
  const hashes = ids.map(id => {
    if (typeof id !== 'number') {
      throw new TypeError('The ids you\'re hashing should only be numbers');
    }
    return _createHash(id, salts, base);
  });

  return {
    ids,
    hashes,
    salts,
    base
  };
}

/**
 * Simplified API to just return a single token using defaults
 * @return {String} a hash
 */
export function hashish(id = Math.floor(Math.random() * 100), n = 2, base = 36) {
  return _createHash(
    id,
    _createSalts(n, base),
    base
  );
}

/**
 * Creates a specified number of random tokens
 * @param  {Number} num  number of tokens to create
 * @param  {Number} n    number of salts to add to each hash
 * @param  {Number} base radix base, 16 through 36 allowed
 * @return {Object}      a hash object containing the hashes as well as info needed to reverse them
 */
export function bunch(num = 1, n = 2, base = 36) {
  if (typeof num !== 'number') {
    throw new TypeError('The num should be a number');
  }
  if (typeof n !== 'number' || n < 0) {
    throw new TypeError('The number of salts should be a positive integer');
  }
  if (typeof base !== 'number' || base < 16 || base > 36) {
    throw new TypeError('The base should be a number between 16 and 36');
  }

  // Create the ids
  const ids = [];
  for (let i = 0; i < num; i++) {
    ids.push(Math.floor(Math.random() * Math.pow(10, num.toString(10).length + 2)));
  }

  // Create the salts. This will be the same for all hashes
  const salts = _createSalts(n, base);

  // Combine the salts and the actual
  const hashes = ids.map(id => {
    return _createHash(id, salts, base);
  });

  return {
    ids,
    hashes,
    salts,
    base
  };
}

/**
 * Takes a string and necessary components to reverse back to the original number
 * @param  {Array} hashes   list of hashes to reverse
 * @param  {Array} salts  list of salts applied to the list (provided from `hash`)
 * @param  {base} base     radix base, 16 through 36 allowed
 * @return {Array}          list of reversed hashes
 */
export function reverse(hashes, salts, base = 36) {
  if (!hashes.splice) {
    throw new TypeError('The hashes argument should be an array of hashes provided by the hash method');
  }
  if (!salts.splice) {
    throw new TypeError('The salts argument should be an array of salt strings provided by the hash method');
  }
  if (typeof base !== 'number' || base < 16 || base > 36) {
    throw new TypeError('The base should be a number between 16 and 36');
  }
  const re = new RegExp(salts.join('|'), 'g');

  const reversed = hashes.map(hash => {
    if (typeof hash !== 'string') {
      throw new TypeError('The hashes you\'re reversing should only be strings');
    }
    const stripped = hash.replace(re, '');
    return parseInt(stripped, base);
  });

  return reversed;
}
