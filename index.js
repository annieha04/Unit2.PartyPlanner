const API_URL = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2311-FSA-ET-WEB-PT-SF/events"

const state = {
    events: [],
};

const eventList = document.querySelector("#events");

document.addEventListener("DOMContentLoaded", () => {
    const addEventForm = document.querySelector("#addEvent");
    addEventForm.addEventListener("submit", addEvent);
});

async function render() {
    await getEvents();
    renderEvents();
}
render();

async function getEvents() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.events = json.data;
    } catch (error) {
        console.error(error);
    }
}

function renderEvents() {
    if (!state.events.length) {
        eventList.innerHTML = "<li>No events.</li>";
        return;
    }

const eventCards = state.events.map((event) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <h2>${event.name}</h2>
    <img src="${event.imageUrl}" alt="${event.name}" />
    <p>${event.description}</p>
    `;
    return li;
});

    eventList.replaceChildren(...eventCards);
}

try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addEventForm.name.value,
        imageUrl: addEventForm.imageUrl.value,
        description: addEventForm.description.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    render(); // Re-render the events after a successful POST
  } catch (error) {
    console.error(error);
  }
  