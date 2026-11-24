import { NoiseMeasurement } from "./NoiseMeasurement.js";

export const NOISE_LIMITS = Object.freeze({
  normalMax: 55,
  warningMax: 70,
});

export class NoiseSensor {
  constructor(id, district, location, noiseLevel) {
    this.id = id;
    this.district = district;
    this.location = location;
    this.noiseLevel = noiseLevel;
    this.measurements = [];
  }

  static isValidNoiseLevel(value) {
    return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 200;
  }

  static fromObject(data) {
    if (!data || typeof data !== "object") {
      throw new Error("Некоректні дані сенсора");
    }
    return new NoiseSensor(
      data.id,
      data.district,
      data.location,
      data.noiseLevel
    );
  }

  getStatus() {
    if (this.noiseLevel <= NOISE_LIMITS.normalMax) {
      return "normal";
    }
    if (this.noiseLevel <= NOISE_LIMITS.warningMax) {
      return "warning";
    }
    return "critical";
  }

  updateNoiseLevel(value) {
    if (!NoiseSensor.isValidNoiseLevel(value)) {
      throw new Error(`Некоректне значення рівня шуму: ${value}`);
    }
    this.noiseLevel = value;
  }

  addMeasurement(measurement) {
    if (!(measurement instanceof NoiseMeasurement)) {
      throw new Error("Очікується об'єкт NoiseMeasurement");
    }
    if (!measurement.isValid()) {
      throw new Error("Некоректне вимірювання шуму");
    }
    this.measurements.push(measurement);
    this.noiseLevel = measurement.value;
  }
}

export class MobileNoiseSensor extends NoiseSensor {
  constructor(id, district, location, noiseLevel, batteryLevel = 100) {
    super(id, district, location, noiseLevel);
    this.batteryLevel = batteryLevel;
  }

  needsCharging(threshold = 20) {
    return this.batteryLevel <= threshold;
  }
}