// declare a IIFE (Immediately Invoked Function Expression)

(function () {
  "use strict";

  // Store greenhouse records in local storage
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

  // Validate greenhouse sensor inputs
  function validateInput(data) {
    const errors = [];

    if (!data.bay.trim()) {
      errors.push("Greenhouse Bay is required.");
    }

    if (isNaN(data.ph) || data.ph < 0 || data.ph > 14) {
      errors.push("pH must be between 0 and 14.");
    }

    if (isNaN(data.temp) || data.temp < 0) {
      errors.push("Temperature must be 0°F or higher.");
    }

    if (isNaN(data.ec) || data.ec < 0) {
      errors.push("Electrical Conductivity must be 0 or higher.");
    }

    if (isNaN(data.humidity) || data.humidity < 0 || data.humidity > 100) {
      errors.push("Humidity must be between 0 and 100.");
    }

    return errors;
  }

  // Handle sensor form submission
  sensorForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = {
      bay: inputBay.value.trim(),
      ph: parseFloat(inputPh.value),
      temp: parseFloat(inputTemperature.value),
      ec: parseFloat(inputEc.value),
      humidity: parseFloat(inputHumidity.value),
    };

    const errors = validateInput(data);

    if (errors.length > 0) {
      displayError(errors.join(" "));
      return;
    }

    hideError();

    const status = evaluateRisk(data.ph, data.temp, data.ec, data.humidity);

    const record = {
      id: crypto.randomUUID(),
      ...data,
      status: status.label,
      level: status.level,
    };

    records.unshift(record);
    saveRecords();
    render();

    sensorForm.reset();
    inputBay.focus();
  });

  // Display an error message
  function displayError(message) {
    sensorBanner.textContent = message;
    sensorBanner.classList.remove("hidden");
  }

  // Hide the error message
  function hideError() {
    sensorBanner.textContent = "";
    sensorBanner.classList.add("hidden");
  }

  // Display saved greenhouse sensor readings
  function render() {
    queueCount.textContent = records.length;

    if (records.length === 0) {
      emptyState.classList.remove("hidden");
    } else {
      emptyState.classList.add("hidden");
    }

    recordList.innerHTML = "";

    const fragment = document.createDocumentFragment();

    records.forEach(function (record) {
      const li = document.createElement("li");

      li.className = "sensor-card status-" + record.level;

      li.innerHTML = `
            <h3 class="bay-name-text">${escapeHtml(record.bay)}</h3>

            <div class="sensor-stats">
                <div class="stat-item">pH: <span>${record.ph}</span></div>
                <div class="stat-item">Temperature: <span>${record.temp}°F</span></div>
                <div class="stat-item">EC: <span>${record.ec} mS/cm</span></div>
                <div class="stat-item">Humidity: <span>${record.humidity}%</span></div>
            </div>

            <span class="risk-badge ${record.level}">
                ${record.status}
            </span>

            <button type="button" class="btn btn-outline-danger btn-sm btn-delete"
                data-id="${record.id}">Delete</button>
        `;

      fragment.appendChild(li);
    });

    recordList.appendChild(fragment);
  }
  // Displays greenhouse bay names
  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Delete an individual sensor reading
  recordList.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-delete")) {
      const id = event.target.dataset.id;

      records = records.filter(function (record) {
        return record.id !== id;
      });

      saveRecords();
      render();
    }
  });

  // Clear all saved sensor readings
  btnClearAll.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete all sensor readings?")) {
      records = [];
      saveRecords();
      render();
    }
  });

  // Checks thesensor inputs as the user types
  [inputPh, inputTemperature, inputEc, inputHumidity].forEach(function (input) {
    input.addEventListener("input", function () {
      if (input.validity.valid) {
        input.classList.remove("input-invalid");
      } else {
        input.classList.add("input-invalid");
      }
    });
  });
})();
