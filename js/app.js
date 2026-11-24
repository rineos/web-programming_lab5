import { NoiseSensor } from "./models/NoiseSensor.js";
import { NoiseMeasurement } from "./models/NoiseMeasurement.js";
import { MonitoringSystem } from "./services/MonitoringSystem.js";

const sensorsData = [
  {
    id: "NS-01",
    district: "Галицький",
    location: "просп. Свободи",
    noiseLevel: 58,
  },
  {
    id: "NS-02",
    district: "Франківський",
    location: "вул. Наукова",
    noiseLevel: 74,
  },
  {
    id: "NS-03",
    district: "Шевченківський",
    location: "просп. Чорновола",
    noiseLevel: 83,
  },
];

function renderSensorCard(sensor) {
  const status = sensor.getStatus();
  const card = document.createElement("article");
  card.className = `sensor-card sensor-card--${status} ${status}`;

  card.innerHTML = `
    <h3>${sensor.id}</h3>
    <p><strong>Район:</strong> ${sensor.district}</p>
    <p><strong>Адреса:</strong> ${sensor.location}</p>
    <p><strong>Рівень шуму:</strong> ${sensor.noiseLevel} dB</p>
    <p><strong>Статус:</strong> <span class="status-badge ${status}">${status}</span></p>
  `;

  return card;
}

function renderDashboard(system, container) {
  if (!container) {
    return;
  }

  container.innerHTML = "";

  const summary = document.createElement("div");
  summary.className = "monitoring-summary";
  summary.innerHTML = `
    <p><strong>Кількість датчиків:</strong> ${system.sensors.length}</p>
    <p><strong>Критичних датчиків:</strong> ${system.getCriticalSensors().length}</p>
    <p><strong>Середній рівень шуму:</strong> ${system.getAverageNoiseLevel()} dB</p>
  `;
  container.appendChild(summary);

  const list = document.createElement("div");
  list.className = "sensors-list";

  system.sensors.forEach((sensor) => {
    list.appendChild(renderSensorCard(sensor));
  });

  container.appendChild(list);
}

const system = new MonitoringSystem();

sensorsData
  .map((item) => NoiseSensor.fromObject(item))
  .forEach((sensor) => system.addSensor(sensor));

const container =
  document.querySelector("#sensors-container") ||
  document.querySelector(".sensors-list") ||
  document.querySelector("main") ||
  document.body;

renderDashboard(system, container);

window.acousticWatch = {
  system,
  NoiseSensor,
  NoiseMeasurement,
  renderDashboard: () => renderDashboard(system, container),
};