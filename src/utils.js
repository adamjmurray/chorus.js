// modulo function that always returns a positive number
function mod(dividend, divisor) {
  let value = dividend % divisor;
  if (value < 0) value += divisor;
  return value;
}

function clamp(value, min, max) {
  if (value == null) value = min;
  if (value < min) value = min;
  if (value > max) value = max;
  return value;
}

function clampInt(value, min, max) {
  return Math.round(clamp(value, min, max));
}

function noteJSON(noteEvent) {
  const note = noteEvent.note;
  return {
    time: noteEvent.time,
    type: 'note',
    pitch: clampInt(note.pitch+0, 0, 127), // + 0 coerces to an int
    velocity: clampInt(note.intensity*127, 0, 127),
    duration: clamp(note.duration, 0),
    release: 100,
    channel: clamp(note.channel, 1, 16),
  }
}

/*
 * Run a list of asynchronous operations sequentially (waiting until one finishes before starting the next).
 * @param asyncOperations {Array} An Array functions that initiate an async operation when called and return a Promise
 * @returns {Promise} A Promise that resolves after all async operations have completed
 */
function sequentialAsync(asyncOperations) {
  const asyncOp = asyncOperations.shift();
  return asyncOp ? asyncOp().then(() => sequentialAsync(asyncOperations)) : Promise.resolve();
}

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(() => resolve(), milliseconds));
}

function take(iterator, n) {
  const values = [];
  for (let i=0; i<n; i++) values.push(iterator.next().value);
  return values;
}

module.exports = { mod, clamp, clampInt, noteJSON, sequentialAsync, sleep, take };
