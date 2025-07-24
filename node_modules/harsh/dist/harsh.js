var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

function _createSalts(n, base) {
  var salts = [];
  for (var i = 0; i < n; i++) {
    salts.push(Math.floor(Math.random() * Math.pow(10, 6)).toString(base));
  }
  return salts;
}

function _createHash(id, salts, base) {
  var hash = id.toString(base);
  var pieces = [].concat(toConsumableArray(salts), [hash]);
  var hashString = '';
  do {
    var index = Math.floor(Math.random() * pieces.length);
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
function hash() {
  var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [Math.floor(Math.random() * 100)];
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var base = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 36;

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
  var salts = _createSalts(n, base);

  // Combine the salts and the actual
  var hashes = ids.map(function (id) {
    if (typeof id !== 'number') {
      throw new TypeError('The ids you\'re hashing should only be numbers');
    }
    return _createHash(id, salts, base);
  });

  return {
    ids: ids,
    hashes: hashes,
    salts: salts,
    base: base
  };
}

/**
 * Simplified API to just return a single token using defaults
 * @return {String} a hash
 */
function hashish() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.floor(Math.random() * 100);
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var base = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 36;

  return _createHash(id, _createSalts(n, base), base);
}

/**
 * Creates a specified number of random tokens
 * @param  {Number} num  number of tokens to create
 * @param  {Number} n    number of salts to add to each hash
 * @param  {Number} base radix base, 16 through 36 allowed
 * @return {Object}      a hash object containing the hashes as well as info needed to reverse them
 */
function bunch() {
  var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var base = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 36;

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
  var ids = [];
  for (var i = 0; i < num; i++) {
    ids.push(Math.floor(Math.random() * Math.pow(10, num.toString(10).length + 2)));
  }

  // Create the salts. This will be the same for all hashes
  var salts = _createSalts(n, base);

  // Combine the salts and the actual
  var hashes = ids.map(function (id) {
    return _createHash(id, salts, base);
  });

  return {
    ids: ids,
    hashes: hashes,
    salts: salts,
    base: base
  };
}

/**
 * Takes a string and necessary components to reverse back to the original number
 * @param  {Array} hashes   list of hashes to reverse
 * @param  {Array} salts  list of salts applied to the list (provided from `hash`)
 * @param  {base} base     radix base, 16 through 36 allowed
 * @return {Array}          list of reversed hashes
 */
function reverse(hashes, salts) {
  var base = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 36;

  if (!hashes.splice) {
    throw new TypeError('The hashes argument should be an array of hashes provided by the hash method');
  }
  if (!salts.splice) {
    throw new TypeError('The salts argument should be an array of salt strings provided by the hash method');
  }
  if (typeof base !== 'number' || base < 16 || base > 36) {
    throw new TypeError('The base should be a number between 16 and 36');
  }
  var re = new RegExp(salts.join('|'), 'g');

  var reversed = hashes.map(function (hash) {
    if (typeof hash !== 'string') {
      throw new TypeError('The hashes you\'re reversing should only be strings');
    }
    var stripped = hash.replace(re, '');
    return parseInt(stripped, base);
  });

  return reversed;
}

export { hash, hashish, bunch, reverse };
