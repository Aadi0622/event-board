// A3: VARIABLES
const boardTitle = "Campus Event Board";
let seatsLeft = 50;
const isRegistrationOpen = true;
console.log(boardTitle, seatsLeft, isRegistrationOpen);
console.log("Campus Event Board JavaScript loaded.");

// A5: ARRAY OF OBJECTS - Default local data
let events = [
  { id: 1, title: "Campus Hackathon", date: "10 October 2026", time: "9:00 AM - 9:00 PM", venue: "Innovation Lab", category: "Technical", seats: 50, online: true },
  { id: 2, title: "Tech Fest", date: "15 October 2026", time: "10:00 AM- 5:00 PM", venue: "College Auditorium", category: "Technical", seats: 100, online: true },
  { id: 3, title: "Coding Competition", date: "20 October 2026", time: "11:00 AM- 4:00 PM", venue: "Computer Lab", category: "Technical", seats: 30, online: false },
  { id: 4, title: "Sports Day", date: "25 October 2026", time: "8:00 AM- 4:00 PM", venue: "College Ground", category: "Sports", seats: 80, online: false },
  { id: 5, title: "Cultural Fest", date: "30 October 2026", time: "5:00 PM- 9:00 PM", venue: "Auditorium", category: "Cultural", seats: 120, online: false }
];

// A4: CONTROL FLOW
function getSeatStatus(event) {
  if (event.seats === 0) return "Full";
  else if (event.seats < 5) return "Few left";
  else return "Open";
}

// A6: FUNCTION
function formatEvent(event) {
  return event.title + " - " + event.category;
}

// A7: ARROW + FILTER/MAP
const availableEvents = events.filter((e) => e.seats > 0); // arrow function + filter()
const eventNames = events.map((e) => e.title); // arrow function + map()
console.log("Total events:", events.length);
console.log(eventNames);

// DOM ELEMENTS
const eventContainer = document.querySelector("#event-grid");
const searchInput = document.querySelector("#event-search");
const eventCount = document.querySelector("#event-count");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const fetchStatus = document.querySelector("#fetch-status");

// B3: RENDER + RSVP BUTTON - Read and change content - FIXED for undefined
function renderEvents(list) {
  eventContainer.innerHTML = "";
  
  if (eventCount) {
    eventCount.textContent = `${list.length} event(s) found.`;
  }

  for (const ev of list) {
    const status = getSeatStatus(ev);
    // Fix for undefined issue - supports both lower and upper case keys
    const dateText = ev.date || ev.Date || "TBA";
    const timeText = ev.time || ev.Time || "TBA";
    const venueText = ev.venue || ev.Venue || ev.location || "TBA";
    const titleText = ev.title || ev.name || "Untitled";
    const categoryText = ev.category || "General";

    const card = document.createElement("article");
    card.className = "event-card";
    card.innerHTML = `
      <h3>${titleText}</h3>
      <p>Date: ${dateText}</p>
      <p>Time: ${timeText}</p>
      <p>Venue: ${venueText}</p>
      <p><span style="background:#ffe9d6;padding:2px 8px;border-radius:4px;font-size:12px;">${categoryText}</span></p>
      <p>Seats: ${status}</p>
      <button class="rsvp-button" data-event-id="${ev.id}">RSVP</button>
    `;
    eventContainer.appendChild(card);
  }
}

// B5: EVENT DELEGATION - USE THE EVENT OBJECT
if (eventContainer) {
  eventContainer.addEventListener("click", function(event) {
    console.log("Clicked:", event.target);
    if (event.target.classList.contains("rsvp-button")) {
      const id = event.target.getAttribute("data-event-id");
      const found = events.find((e) => e.id == id);
      if(found){
        alert("You RSVP'd for: " + found.title);
      }
    }
  });
}

// B4: SEARCH - input event - FIXED: Now filters by title + category + venue so Tech shows 3 results
if (searchInput) {
  searchInput.addEventListener("input", function(event) {
    const text = event.target.value.toLowerCase().trim();
    if (text === "") {
      renderEvents(events);
      return;
    }
    const filtered = events.filter((e) => {
      const title = (e.title || e.name || "").toLowerCase();
      const category = (e.category || "").toLowerCase();
      const venue = (e.venue || e.Venue || "").toLowerCase();
      return title.includes(text) || category.includes(text) || venue.includes(text);
    });
    renderEvents(filtered);
  });
}

// B6: NAV TOGGLE
if (navToggle && navLinks) {
  navToggle.addEventListener("click", function() {
    navLinks.classList.toggle("is-open");
  });
}

// B7: FETCH 3 states - Loading, Success, Error
async function loadEvents() {
  try {
    if (fetchStatus) fetchStatus.textContent = "Loading events...";
    const res = await fetch("events.json");
    if (!res.ok) throw new Error("Unable to load events.");
    const data = await res.json();
    events = data;
    renderEvents(events);
    if (fetchStatus) fetchStatus.textContent = "Events loaded successfully!";
  } catch (err) {
    console.error(err);
    renderEvents(events);
    if (fetchStatus) fetchStatus.textContent = "Local events loaded (events.json not found).";
  }
}
loadEvents();

// B8: FORM VALIDATION - setCustomValidity()
const candidateName = document.querySelector("#candidate-name");
const registrationForm = document.querySelector("#registration-form");
const formMessage = document.querySelector("#form-message");

if (candidateName) {
  candidateName.addEventListener("input", function() {
    if (candidateName.value.trim().length < 2) {
      candidateName.setCustomValidity("Name must contain at least 2 characters.");
    } else {
      candidateName.setCustomValidity("");
    }
  });
}

if (registrationForm) {
  registrationForm.addEventListener("submit", function(e) {
    e.preventDefault();
    if (registrationForm.checkValidity()) {
      if(formMessage) formMessage.textContent = "Registration submitted!";
    } else {
      registrationForm.reportValidity();
    }
  });
}