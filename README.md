# Campus Event Board — Lab Assignment 7

This project represents the campus events in both JSON and XML and reads the files from the web page.

## Files
- `events.json`: Events as a JSON array (ISO-8601 dates; includes string, number, and boolean values).
- `events.xml`: The same events as XML. Each `<event>` uses `id` as an attribute; other data fields are child elements.
- `index.html`, `style.css`, `script.js`: Website and assignment demonstrations.

## Assignment 7 demonstrations
- B1: Event cards are rendered from `events.json`.
- B2: JavaScript logs the first event title and last event's seats.
- B3: `JSON.stringify()` output and parsed round-trip object are logged.
- B4: `events.xml` is fetched and parsed with `DOMParser`; first title is displayed on the page.
- B5: Byte sizes of JSON and XML are logged in the browser console.
- C1-C3 answers are included in `NOTES.pdf`.

## Run
Open this folder in VS Code and run with Live Server (or another local HTTP server). Fetch requests generally do not work from a direct `file://` page.
