const INTENSITY_VALUE = {
  '+++': 1,
  '++': 0.9,
  '+': 0.8,
  '': 0.7,
  '-': 0.6,
  '--': 0.5,
  '---': 0.4,
};

module.exports = class Intensity {
  constructor(value) {
    this.value = value;
  }

  static fromName(string) {
    let value = INTENSITY_VALUE[string];
    if (value == null) throw new Error(`Invalid Intensity String: ${string}`)
    return new Intensity(value);
  }
};
