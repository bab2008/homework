// Form
var captureButton = document.getElementById("capture_button");
var dashboardButton = document.getElementById("dashboard_button");
var capturePage = document.getElementById("capture_page");
var dashboardPage = document.getElementById("dashboard_page");
var trialForm = document.getElementById("trial_form");

// ids
var fields = [
  "trial_id", "trial_code", "trial_name", "objective", "target_crop",
  "start_date", "end_date", "status", "created_at",
  "site_id", "site_trial_id", "site_name", "latitude", "longitude", "soil_type",
  "previous_crop", "experimental_design", "total_replications",
  "treatment_id", "treatment_trial_id", "treatment_number", "treatment_name",
  "formulation_details", "application_rate", "rate_unit",
  "plot_id", "plot_site_id", "plot_number", "replication_number", "plot_treatment_id", "row_index", "column_index",
  "trait_id", "trait_trial_id", "trait_name", "methodology", "unit_of_measure", "data_type",
  "data_id", "data_plot_id", "data_trait_id", "assessment_date", "numeric_value", "text_value",
  "collected_by", "notes"
];

// Show the capture page, hide the dashboard
function showCapture() {
  capturePage.style.display = "block";
  dashboardPage.style.display = "none";
}

// dashboard
function showDashboard() {
  capturePage.style.display = "none";
  dashboardPage.style.display = "block";
  buildDashboard();
}

// Saved trials
function getTrials() {
  var saved = localStorage.getItem("trials");
  if (saved == null) {
    return [];
  }
  return JSON.parse(saved);
}

// Tables
function makeTable(title, headings, names, trials) {
  var html = "<h2>" + title + "</h2>";
  html = html + "<table border='1' cellpadding='5'>";

  html = html + "<tr>";
  for (var h = 0; h < headings.length; h++) {
    html = html + "<th>" + headings[h] + "</th>";
  }
  html = html + "</tr>";

  for (var i = 0; i < trials.length; i++) {
    html = html + "<tr>";
    for (var n = 0; n < names.length; n++) {
      html = html + "<td>" + trials[i][names[n]] + "</td>";
    }
    html = html + "</tr>";
  }

  html = html + "</table>";
  return html;
}

// dashboard 1
function buildDashboard() {
  var trials = getTrials();
  var planned = 0;
  var active = 0;
  var completed = 0;

  var html = "<h1>Trial dashboard</h1>";

  // statuses
  for (var i = 0; i < trials.length; i++) {
    if (trials[i].status == "Planned") {
      planned = planned + 1;
    }
    if (trials[i].status == "Active") {
      active = active + 1;
    }
    if (trials[i].status == "Completed") {
      completed = completed + 1;
    }
  }

  html = html + "<p>Total trials: " + trials.length + "</p>";
  html = html + "<p>Planned: " + planned + "</p>";
  html = html + "<p>Active: " + active + "</p>";
  html = html + "<p>Completed: " + completed + "</p>";

  if (trials.length == 0) {
    html = html + "<p>No trials saved yet.</p>";
    dashboardPage.innerHTML = html;
    return;
  }

  // Table 1: Trials
  html = html + makeTable("Trials",
    ["Trial ID", "Code", "Name", "Crop", "Start", "End", "Status"],
    ["trial_id", "trial_code", "trial_name", "target_crop", "start_date", "end_date", "status"],
    trials);

  // Table 2: Trial sites
  html = html + makeTable("Trial sites",
    ["Site ID", "Site name", "Latitude", "Longitude", "Soil type", "Previous crop", "Design", "Replications"],
    ["site_id", "site_name", "latitude", "longitude", "soil_type", "previous_crop", "experimental_design", "total_replications"],
    trials);

  // Table 3: Treatments
  html = html + makeTable("Treatments",
    ["Treatment ID", "Number", "Name", "Formulation", "Rate", "Unit"],
    ["treatment_id", "treatment_number", "treatment_name", "formulation_details", "application_rate", "rate_unit"],
    trials);

  // Table 4: Plots
  html = html + makeTable("Plots",
    ["Plot ID", "Plot number", "Replication", "Row", "Column"],
    ["plot_id", "plot_number", "replication_number", "row_index", "column_index"],
    trials);

  // Table 5: Assessment traits
  html = html + makeTable("Assessment traits",
    ["Trait ID", "Trait name", "Methodology", "Unit", "Data type"],
    ["trait_id", "trait_name", "methodology", "unit_of_measure", "data_type"],
    trials);

  // Table 6: Assessment data
  html = html + makeTable("Assessment data",
    ["Data ID", "Plot ID", "Trait ID", "Date", "Numeric value", "Text value", "Collected by", "Notes"],
    ["data_id", "data_plot_id", "data_trait_id", "assessment_date", "numeric_value", "text_value", "collected_by", "notes"],
    trials);

  dashboardPage.innerHTML = html;
}

// When the Save button is clicked
function saveTrial(event) {
  event.preventDefault(); // stop the page from refreshing

  var trial = {};
  for (var i = 0; i < fields.length; i++) {
    trial[fields[i]] = document.getElementById(fields[i]).value;
  }

  var trials = getTrials();
  trials.push(trial);
  localStorage.setItem("trials", JSON.stringify(trials));

  alert("Trial data saved!");
  trialForm.reset();
}

// Connect the buttons to the functions
captureButton.addEventListener("click", showCapture);
dashboardButton.addEventListener("click", showDashboard);
trialForm.addEventListener("submit", saveTrial);

// Start on the capture page
showCapture();
