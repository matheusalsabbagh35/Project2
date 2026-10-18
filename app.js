// declare a IIFE (Immediately Invoked Function Expression)

(function () {
  "use strict";

  //Store greenhouse records in local storage
  const STORAGE_KEY = "greenhouse_sensor_records_v1";

  // Get HTML elements
  const sensorForm = document.getElementById("sensor-form");
  const sensorBanner = document.getElementById("form-error-banner");
  const recordList = document.getElementById("records-list");
  const queueCount = document.getElementById("queue-count");
  const emptyState = document.getElementById("empty-state");
  const btnClearAll = document.getElementById("clear-all");

  // Get the sensor input fields
  const inputBay = document.getElementById("bay");
  const inputPh = document.getElementById("ph");
  const inputTemperature = document.getElementById("temp");
  const inputHumidity = document.getElementById("humidity");
  const inputEc = document.getElementById("ec");

  // Initialize records from localStorage
  let records = loadRecords();

  // initial UI render
  render();

  // Read records from localStorage
  function loadRecords() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load records", error);
      return [];
    }
  }

  // Save records to localStorage
  function saveRecords() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error("Failed to save records", error);
    }
  }

  // Classify greenhouse sensor readings
  function evaluateRisk(ph, temp, ec, humidity) {
    if (
      (ph < 5.0 || ph > 7.5) &&
      (temp < 55 || temp > 95) &&
      (ec < 0.2 || ec > 4.5) &&
      (humidity < 30 || humidity > 90)
    ) {
      return { level: "critical", label: "Critical Hazard" };
    }

    if (
      ph >= 5.5 &&
      ph <= 6.5 &&
      temp >= 64.4 &&
      temp <= 71.6 &&
      ec >= 1.0 &&
      ec <= 2.0 &&
      humidity >= 50 &&
      humidity <= 70
    ) {
      return { level: "optimal", label: "Optimal" };
    }

    return { level: "warning", label: "Warning" };
  }
})();
