let nav = 0;
let clicked = null;

let events = sessionStorage.getItem('events') ? JSON.parse(sessionStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const eventBar = document.getElementById('eventBar');
const deleteEventModal = document.getElementById('deleteEventModal');

const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');

const startTimeInput = document.getElementById('startTime');
const endTimeInput = document.getElementById('endTime');

const errorText = document.getElementById('errorTextInput');
const timeErrorText = document.getElementById('timeError');
const eventHeader = document.getElementById('eventHeader');

const eventType = document.getElementById('list');
const eventDescriptionInput = document.getElementById('description');

const eventBackground = document.getElementById('event');

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function openEventBar (date) {
  clicked = date;

  const eventForDay = events.find(e => e.date === clicked);
  
  eventHeader.value = date;
  if(eventForDay) {
    document.getElementById('eventText').innerText = `Title: ${eventForDay.title}`
    document.getElementById('startTimeRead').innerText = `Start Time: ${eventForDay.startTime}`;
    document.getElementById('endTimeRead').innerText = `End Time: ${eventForDay.endTime}`;

    if(eventForDay.eventType === 'meeting'){
      document.getElementById('eventTypeRead').innerText = "Type: Meeting";
    } else if (eventForDay.eventType === 'call')
    {
      document.getElementById('eventTypeRead').innerText = "Type: Call";
    } else if (eventForDay.eventType === 'outOfOffice')
    {
      document.getElementById('eventTypeRead').innerText = "Type: Out of Office";
    }
    document.getElementById('descriptionRead').innerText = `Description: ${eventForDay.description}`;
    deleteEventModal.style.display = 'block';
    backDrop.style.display = 'block';

  } else {
    eventBar.style.display = 'block';
    document.getElementById('eventHeader').innerText = "New event for " + clicked;
  }
}

function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }
  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month+1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString('en-gb', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
  
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString('en-gb', {month: 'long'})} ${year}`;

  calendar.innerHTML = '';

  for(let i = 1; i <= paddingDays + daysInMonth; i++){
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const eventForDay = events.find(e => e.date === dayString);

      //current day
      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.classList.add(eventForDay.eventType);
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }
      daySquare.addEventListener('click', () => openEventBar(dayString));

    } else {
      daySquare.classList.add('padding');
    }
    calendar.appendChild(daySquare);
  }
}

function closeEventBar() {
  eventTitleInput.classList.remove('error');
  eventBar.style.display = 'none';
  deleteEventModal.style.display = 'none';
  eventTitleInput.value = '';
  clicked = null;
  backDrop.style.display = 'none';

  startTimeInput.value = '';
  endTimeInput.value = '';

  startTimeInput.classList.remove('error');
  endTimeInput.classList.remove('error');

  errorText.style.display = 'none';

  load();
}

function saveEvent() {

  eventTitleInput.classList.remove('error');
  startTimeInput.classList.remove('error');
  endTimeInput.classList.remove('error');
  eventType.classList.remove('error');

  if (eventTitleInput.value && startTimeInput.value && endTimeInput.value && eventType.value) {

    if(startTimeInput.value > endTimeInput.value){
      startTimeInput.classList.add('error');
      endTimeInput.classList.add('error');
      timeErrorText.style.display = 'block';
    } else {
      events.push({
        date: clicked,
        title: eventTitleInput.value,
        startTime: startTimeInput.value,
        endTime: endTimeInput.value,
        eventType: eventType.value,
        description: eventDescriptionInput.value,
      });
      sessionStorage.setItem('events', JSON.stringify(events));
      closeEventBar();
    }
  } else if (!eventTitleInput.value) {
    eventTitleInput.classList.add('error');
    errorText.style.display = 'block';
  } else if (!startTimeInput.value){
    startTimeInput.classList.add('error');
    errorText.style.display = 'block';
  } else if (!endTimeInput.value){
    endTimeInput.classList.add('error');
    errorText.style.display = 'block';
  }
}

function deleteEvent() {
  backDrop.style.display = 'block';
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeEventBar();
}

function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });
  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', saveEvent);
  document.getElementById('cancelButton').addEventListener('click', closeEventBar);

  document.getElementById('deleteButton').addEventListener('click', deleteEvent);
  document.getElementById('closeButton').addEventListener('click', closeEventBar);

}
initButtons();
load();