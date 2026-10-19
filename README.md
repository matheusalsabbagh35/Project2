Greenhouse Sensor Logger

Section 4.1
Starting State: When the page loads, the user will see a form to enter greenhouse sensor readings,
including PH levels, temperature, electrical conductivity, and humidity. The page will also
display any previously saved sensor logs from localStorage.
Action1: The user will enter sensor readings into the form for PH levels, temperature, electrical
conductivity, and humidity. JavaScript will check the values as the user types and display an
error if any values are outside the allowed ranges.
Action2: When the user clicks the record reading button, JavaScript will validate the inputs and
calculate the environmental status. If the inputs are valid, the readings will be saved to
localStorage.
Action3: After submission, the new sensor reading will appear in the log history with its values
and status of optimal, warning, or critical hazard. The user can review the results to see the
greenhouse conditions.
Action4: The user can delete individual sensor logs or clear the entire log history using a button.
JavaScript will update the displayed logs and localStorage to reflect the changes.
Terminal State: After the user finishes, the page will display the remaining sensor logs and their
environmental statuses. Any deleted logs will be removed, and the remaining readings will stay
saved.

Section 4.2
Norman Principle / Concept System Context Questions to Answer Using
Concrete Implementation
Mechanism (DOM / HTML /
JS)
Gulf of Execution Typing numeric sensor
metrics (pH,
ElectricalConductivity[EC],
Temp, Humidity)
Each input field will have a
label showing what sensor
readings to enter, along with
its unit of measurements such
as F for temperature and %
for humidity. HTML
placeholders will show
example values to help the
users understand what to
type.
Gulf of Evaluation Ingesting sensor values after
clicking "Record Reading"
After the user clicks record
readings, JavaScript will
check the sensor values and
display a status of optimal,
warning, or critical hazard.
The status will appear next to
the recorded reading so that
the user can see the
conditions.
System Constraint E.g. Water pH Boundaries
(0.0 <= pH <= 14.0)
HTML input fields will use
attributes such as
type=”number”, min, max,
and required to limit invalid
entries. For example, the PH
field will have a minimum of
zero and a maximum of 14,
and JavaScript will prevent
invalid values from being
saved.
Visual Feedback State Real-Time Input Error / Outof-Bounds
JavaScript will check the
sensor values as the user
types. If a value is outside the
allowed range, the input field
will receive a CSS error class
that changes its borders to red
alerting the user before
submission.
Error Recovery Accidental or test data
submissions
Each saved sensor log will
have a delete button to
remove an individual reading.
A clear all buttons will allow
users to remove the entire log
history, and JavaScript will
update the displayed logs.

Section 4.3
• <body> [static]
o <header> [static]
o <h1> GreenHouse Sensor Logger [static]
• <main> [static] (CSS: display: flex; flex-direction: column)
o <section id=”sensor-entry”> [static] (CSS: display: flex; flex-direction: column)
▪ <h2> Record Sensor Reading [STATIC]
▪ <form id="sensor-form"> [STATIC] (Event: submit)
• <label for="bay"> Greenhouse Bay [STATIC]
• <input id="bay" type="text" required> [STATIC]
• <label for="ph"> pH Level [STATIC]
• <input id="ph" type="number" min="0" max="14" step="0.1"
required> [STATIC] (Event: input)
• <label for="temp"> Temperature (°F) [STATIC]
• <input id="temp" type="number" min="-"
step="0.1" required> [STATIC] (Event: input)
• <label for="ec"> Electrical Conductivity (mS/cm) [STATIC]
• <input id="ec" type="number" min="0" step="0.1" required>
[STATIC] (Event: input)
• <label for="humidity"> Humidity (%) [STATIC]
• <input id="humidity" type="number" min="0" max="100"
step="0.1" required> [STATIC] (Event: input)
• <button type="submit"> Record Reading [STATIC]
▪ <section id="sensor-logs"> [STATIC]
• <h2> Sensor Log History [STATIC]
• <button id="clear-all" type="button"> Clear All [STATIC] (Event:
click)
▪ <section id="log-list"> [STATIC] (CSS: display: grid)
o <article class="sensor-log"> [DYNAMIC]
o <h3> Greenhouse Bay [DYNAMIC]
• <p> Sensor Readings [DYNAMIC]
• <p> Environmental Status: Optimal / Warning / Critical
Hazard [DYNAMIC]
• <button type="button"> Delete [DYNAMIC] (Event: click)
• <footer> [static]
o <p> Greenhouse Sensor Logger [static]

Section 4.4
const sensorLogSchema = {
id: “String”, // Unique ID for each log
bay: “String”, // Greenhouse bay
ph: “Number”, // Ph level
temp: “Number”, // Temperature
ec: “Number”, // Electrical conductivity
humidity: “Number”, // Humidity percentage
status: “String” // Environmental status
};
