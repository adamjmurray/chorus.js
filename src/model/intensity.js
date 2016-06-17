const INTENSITY_VALUE = {
  '+++': 1,
  '++': 0.9,
  '+': 0.8,
  '': 0.7,
  '-': 0.6,
  '--': 0.5,
  '---': 0.4,
};

class Intensity {
  constructor(nameOrValue) {
    if (typeof nameOrValue === 'number') {
      this.value = nameOrValue;
    }
    else {
      const string = nameOrValue.toString();
      this.value = INTENSITY_VALUE[string];
      if (this.value == null) throw new Error(`Invalid Intensity String: ${string}`)
    }
  }
}

module.exports = Intensity;
