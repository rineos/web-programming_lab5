export class NoiseMeasurement {
  constructor(value, measuredAt = new Date()) {
    this.value = value;
    this.measuredAt = measuredAt;
  }

  isValid() {
    return (
      typeof this.value === "number" &&
      Number.isFinite(this.value) &&
      this.value >= 0 &&
      this.value <= 200
    );
  }

  toString() {
    const time =
      this.measuredAt instanceof Date
        ? this.measuredAt.toLocaleTimeString("uk-UA", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : String(this.measuredAt);
    return `${time} -> ${this.value} dB`;
  }
}