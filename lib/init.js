exports.Lazy = function(source) {
  if (source instanceof Sequence) {
    return source;
  } else if (typeof source === "string") {
    return new StringWrapper(source);
  }
  return new ArrayWrapper(source);
};

exports.Lazy.async = function(source, interval) {
  return new AsyncSequence(new ArrayWrapper(source), interval);
};

exports.Lazy.generate = function(sequenceFn, length) {
  return new GeneratedSequence(sequenceFn, length);
};

exports.Lazy.range = function() {
  var start = arguments.length > 1 ? arguments[0] : 0,
      stop  = arguments.length > 1 ? arguments[1] : arguments[0],
      step  = arguments.length > 2 ? arguments[2] : 1;
  return this.generate(function(i) { return start + (step * i); })
    .take(Math.floor((stop - start) / step));
};

exports.Lazy.Sequence = Sequence;
exports.Lazy.IndexedSequence = IndexedSequence;
exports.Lazy.CachingSequence = CachingSequence;
exports.Lazy.GeneratedSequence = GeneratedSequence;

/*** Useful utility methods ***/

function createSet(values) {
  var set = new Set();
  Lazy(values || []).flatten().each(function(e) {
    set.add(e);
  });
  return set;
};

function compare(x, y, fn) {
  if (typeof fn === "function") {
    return compare(fn(x), fn(y));
  }

  if (x === y) {
    return 0;
  }

  return x > y ? 1 : -1;
}

function forEach(array, fn) {
  var i = -1;
  while (++i < array.length) {
    if (fn(array[i]) === false) {
      break;
    }
  }
}

function recursiveForEach(array, fn) {
  var i = -1;
  while (++i < array.length) {
    if (array[i] instanceof Array) {
      if (recursiveForEach(array[i], fn) === false) {
        return false;
      }
    } else {
      if (fn(array[i]) === false) {
        return false;
      }
    }
  }
}

function getFirst(sequence) {
  if (sequence.indexed) {
    return sequence.get(0);
  }

  var result;
  sequence.each(function(e) {
    result = e;
    return false;
  });
  return result;
}

function swap(array, i, j) {
  var temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

function indent(depth) {
  return new Array(depth).join("  ");
}
