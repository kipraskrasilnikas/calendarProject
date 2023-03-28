import constants from './constants.js';

// Offset to adjust the displayed month. Set to 0 to display the current month.
let monthsOffset = 0;
let dateClicked = null;

let events = sessionStorage.getItem("events")
  ? JSON.parse(sessionStorage.getItem("events"))
  : [];

const calendar = document.getElementById("calendar");
const newEventBar = document.getElementById("eventBar");
const deleteEventModal = document.getElementById("deleteEventModal");

const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");

const startTimeInput = document.getElementById("startTime");
const endTimeInput = document.getElementById("endTime");

const errorText = document.getElementById("errorTextInput");
const timeErrorText = document.getElementById("timeError");
const eventHeader = document.getElementById("eventHeader");

const eventType = document.getElementById("list");
const eventDescriptionInput = document.getElementById("description");

const eventBackground = document.getElementById("event");

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/**
 * Opens the event bar and displays the details of a created event or a form for a new event on the selected date 
 * @param {Date} date - The date of the opened new event bar
 */
function openEventBar(date) {
  dateClicked = date;

  const eventForDay = events.find((e) => e.date === dateClicked);

  eventHeader.value = date;
  if (eventForDay) {
    document.getElementById(
      "eventText"
    ).innerText = `Title: ${eventForDay.title}`;
    document.getElementById(
      "startTimeRead"
    ).innerText = `Start Time: ${eventForDay.startTime}`;
    document.getElementById(
      "endTimeRead"
    ).innerText = `End Time: ${eventForDay.endTime}`;

    if (eventForDay.eventType === constants.EVENT_TYPES.MEETING) {
      document.getElementById(constants.ELEMENT_EVENT_TYPE_READ).innerText = "Type: Meeting";
    } else if (eventForDay.eventType === constants.EVENT_TYPES.CALL) {
      document.getElementById(constants.ELEMENT_EVENT_TYPE_READ).innerText = "Type: Call";
    } else if (eventForDay.eventType === constants.EVENT_TYPES.OUT_OF_OFFICE) {
      document.getElementById(constants.ELEMENT_EVENT_TYPE_READ).innerText =
        "Type: Out of Office";
    }
    document.getElementById(
      "descriptionRead"
    ).innerText = `Description: ${eventForDay.description}`;
    deleteEventModal.style.display = constants.BLOCK_STRING;
    backDrop.style.display = constants.BLOCK_STRING;
  } else {
    newEventBar.style.display = constants.BLOCK_STRING;
    document.getElementById("eventHeader").innerText =
      "New event for " + dateClicked;
  }
}

/**
 * Initializes the calendar view by creating the days of the month,
 * adding event listeners to the buttons, and rendering any existing events.
 */
function initializeCalendarView() {
  const dt = new Date();

  if (monthsOffset !== 0) {
    dt.setMonth(new Date().getMonth() + monthsOffset);
  }
  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString("en-gb", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const paddingDays = WEEKDAYS.indexOf(dateString.split(", ")[0]);

  document.getElementById("monthDisplay").innerText = `${dt.toLocaleDateString(
    "en-gb",
    { month: "long" }
  )} ${year}`;

  calendar.innerHTML = "";

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const eventForDay = events.find((e) => e.date === dayString);

      //current day
      if (i - paddingDays === day && monthsOffset === 0) {
        daySquare.id = "currentDay";
      }

      if (eventForDay) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.classList.add(eventForDay.eventType);
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }
      daySquare.addEventListener("click", () => openEventBar(dayString));
    } else {
      daySquare.classList.add("padding");
    }
    calendar.appendChild(daySquare);
  }
}

function closeEventBar() {
  eventTitleInput.classList.remove(constants.ERROR_STRING);
  newEventBar.style.display = constants.NONE_STRING;
  deleteEventModal.style.display = constants.NONE_STRING;
  eventTitleInput.value = "";
  dateClicked = null;
  backDrop.style.display = constants.NONE_STRING;

  startTimeInput.value = "";
  endTimeInput.value = "";

  startTimeInput.classList.remove(constants.ERROR_STRING);
  endTimeInput.classList.remove(constants.ERROR_STRING);

  errorText.style.display = constants.NONE_STRING;

  initializeCalendarView();
}

function saveEvent() {
  eventTitleInput.classList.remove(constants.ERROR_STRING);
  startTimeInput.classList.remove(constants.ERROR_STRING);
  endTimeInput.classList.remove(constants.ERROR_STRING);
  eventType.classList.remove(constants.ERROR_STRING);

  if (
    eventTitleInput.value &&
    startTimeInput.value &&
    endTimeInput.value &&
    eventType.value
  ) {
    if (startTimeInput.value > endTimeInput.value) {
      startTimeInput.classList.add(constants.ERROR_STRING);
      endTimeInput.classList.add(constants.ERROR_STRING);
      timeErrorText.style.display = constants.BLOCK_STRING;
    } else {
      events.push({
        date: dateClicked,
        title: eventTitleInput.value,
        startTime: startTimeInput.value,
        endTime: endTimeInput.value,
        eventType: eventType.value,
        description: eventDescriptionInput.value,
      });
      sessionStorage.setItem("events", JSON.stringify(events));
      closeEventBar();
    }
  } else if (!eventTitleInput.value) {
    eventTitleInput.classList.add(constants.ERROR_STRING);
    errorText.style.display = constants.BLOCK_STRING;
  } else if (!startTimeInput.value) {
    startTimeInput.classList.add(constants.ERROR_STRING);
    errorText.style.display = constants.BLOCK_STRING;
  } else if (!endTimeInput.value) {
    endTimeInput.classList.add(constants.ERROR_STRING);
    errorText.style.display = constants.BLOCK_STRING;
  }
}

function deleteEvent() {
  backDrop.style.display = constants.BLOCK_STRING;
  events = events.filter((e) => e.date !== dateClicked);
  localStorage.setItem("events", JSON.stringify(events));
  closeEventBar();
}

function initializeCalendarButtons() {
  document.getElementById("nextButton").addEventListener("click", () => {
    monthsOffset++;
    initializeCalendarView();
  });
  document.getElementById("backButton").addEventListener("click", () => {
    monthsOffset--;
    initializeCalendarView();
  });

  document.getElementById("saveButton").addEventListener("click", saveEvent);
  document
    .getElementById("cancelButton")
    .addEventListener("click", closeEventBar);

  document
    .getElementById("deleteButton")
    .addEventListener("click", deleteEvent);
  document
    .getElementById("closeButton")
    .addEventListener("click", closeEventBar);
}
initializeCalendarButtons();
initializeCalendarView();
