// Assignment 7: JSON & XML concepts demonstrated in this file.

// A3: VARIABLES
const boardTitle = "Campus Event Board";
let seatsLeft = 50;
const isRegistrationOpen = true;
console.log(boardTitle, seatsLeft, isRegistrationOpen);
console.log("Campus Event Board JavaScript loaded.");

// A5: ARRAY OF OBJECTS - fallback data if JSON cannot be loaded.
let events = [
  { id: 1, title: "Campus Hackathon", date: "2026-10-10", time: "9:00 AM - 9:00 PM", venue: "Innovation Lab", category: "Technical", seats: 50, free: true, online: true },
  { id: 2, title: "Tech Fest", date: "2026-10-15", time: "10:00 AM - 5:00 PM", venue: "College Auditorium", category: "Technical", seats: 100, free: true, online: true },
  { id: 3, title: "Coding Competition", date: "2026-10-20", time: "11:00 AM - 4:00 PM", venue: "Computer Lab", category: "Technical", seats: 30, free: false, online: false },
  { id: 4, title: "Sports Day", date: "2026-10-25", time: "8:00 AM - 4:00 PM", venue: "College Ground", category: "Sports", seats: 80, free: true, online: false },
  { id: 5, title: "Cultural Fest", date: "2026-10-30", time: "5:00 PM - 9:00 PM", venue: "Auditorium", category: "Cultural", seats: 120, free: false, online: false }
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
const availableEvents = events.filter((e) => e.seats > 0);
const eventNames = events.map((e) => e.title);
console.log("Total events:", events.length);
console.log(eventNames);

// DOM ELEMENTS
const eventContainer = document.querySelector("#event-grid");
const searchInput = document.querySelector("#event-search");
const eventCount = document.querySelector("#event-count");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const fetchStatus = document.querySelector("#fetch-status");
const xmlTitleOutput = document.querySelector("#xml-title-output");

// B3: RENDER EVENT CARDS FROM JSON DATA.
function renderEvents(list) {
  if (!eventContainer) return;
  eventContainer.innerHTML = "";

  if (eventCount) {
    eventCount.textContent = `${list.length} event(s) found.`;
  }

  for (const ev of list) {
    const status = getSeatStatus(ev);
    const dateText = ev.date || "TBA";
    const timeText = ev.time || "TBA";
    const venueText = ev.venue || "TBA";
    const titleText = ev.title || "Untitled";
    const categoryText = ev.category || "General";

    const card = document.createElement("article");
    card.className = "event-card";
    card.innerHTML = `
      <h3>${titleText}</h3>
      <p>Date: ${dateText}</p>
      <p>Time: ${timeText}</p>
      <p>Venue: ${venueText}</p>
      <p><span style="background:#ffe9d6;padding:2px 8px;border-radius:4px;font-size:12px;">${categoryText}</span></p>
      <p>Seats: ${status} (${ev.seats} available)</p>
      <p>Free: ${ev.free ? "Yes" : "No"}</p>
      <button class="rsvp-button" data-event-id="${ev.id}">RSVP</button>
    `;
    eventContainer.appendChild(card);
  }
}

// B5: EVENT DELEGATION
if (eventContainer) {
  eventContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("rsvp-button")) {
      const id = event.target.getAttribute("data-event-id");
      const found = events.find((e) => e.id == id);
      if (found) {
        alert("You RSVP'd for: " + found.title);
      }
    }
  });
}

// B4: SEARCH - filters by event title, category, or venue.
if (searchInput) {
  searchInput.addEventListener("input", function(event) {
    const text = event.target.value.toLowerCase().trim();
    if (text === "") {
      renderEvents(events);
      return;
    }
    const filtered = events.filter((e) => {
      const title = (e.title || "").toLowerCase();
      const category = (e.category || "").toLowerCase();
      const venue = (e.venue || "").toLowerCase();
      return title.includes(text) || category.includes(text) || venue.includes(text);
    });
    renderEvents(filtered);
  });
}

// B6: NAV TOGGLE
if (navToggle && navLinks) {
  navToggle.addEventListener("click", function() {
    navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", navLinks.classList.contains("is-open"));
  });
}

// B1, B2, B3, B5: FETCH JSON, read single values, stringify and check text size.
async function loadEvents() {
  try {
    if (fetchStatus) fetchStatus.textContent = "Loading events...";
    const res = await fetch("events.json");
    if (!res.ok) throw new Error("Unable to load events.json.");
    const data = await res.json();
    events = data;
    renderEvents(events);

    // B2: dot access and index access to read one value.
    console.log("First event title:", events[0].title);
    console.log("Last event seats:", events[events.length - 1].seats);

    // B3: object -> JSON text -> object (round-trip).
    const jsonText = JSON.stringify(events, null, 4);
    console.log("JSON.stringify output:", jsonText);
    console.log("Round-trip object:", JSON.parse(jsonText));

    // B5: text length gives a practical size comparison in characters.
    const jsonTextSize = new Blob([jsonText]).size;
    console.log("events.json size (bytes):", jsonTextSize);

    if (fetchStatus) fetchStatus.textContent = "Events loaded successfully!";
  } catch (err) {
    console.error(err);
    renderEvents(events);
    if (fetchStatus) fetchStatus.textContent = "Local events loaded (events.json could not be loaded).";
  }
}

// B4: FETCH XML, parse with DOMParser and show the first title on the page.
async function loadXMLTitle() {
  try {
    const res = await fetch("events.xml");
    if (!res.ok) throw new Error("Unable to load events.xml.");
    const xmlText = await res.text();
    const xmlDoc = new DOMParser().parseFromString(xmlText, "application/xml");
    if (xmlDoc.querySelector("parsererror")) throw new Error("The XML file is not well-formed.");
    const titles = xmlDoc.getElementsByTagName("title");
    const firstTitle = titles[0].textContent;
    if (xmlTitleOutput) xmlTitleOutput.textContent = "First event title from XML: " + firstTitle;
    console.log("XML first title:", firstTitle);
    console.log("events.xml size (bytes):", new Blob([xmlText]).size);
  } catch (err) {
    console.error(err);
    if (xmlTitleOutput) xmlTitleOutput.textContent = "XML title could not be loaded.";
  }
}

loadEvents();
loadXMLTitle();

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
      if (formMessage) formMessage.textContent = "Registration submitted!";
    } else {
      registrationForm.reportValidity();
    }
  });
}


// C1: BREAK JSON ON PURPOSE, show the parser error, then fix the JSON.
const brokenJSON = '{"title":"Campus Hackathon",}';

try {
  JSON.parse(brokenJSON);
} catch (error) {
  console.error("C1 - Validator Error:", error.message);
}

// C1: One-character fix — remove the trailing comma.
const fixedJSON = '{"title":"Campus Hackathon"}';
const fixedEvent = JSON.parse(fixedJSON);
console.log("C1 - Fixed JSON:", fixedEvent);
