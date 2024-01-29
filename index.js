const API_URL = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2311-FSA-ET-WEB-PT-SF/events"

const state = {
    events: [],
};

document.addEventListener("DOMContentLoaded", () => {
    const eventList = document.querySelector("#events");
    const addEventForm = document.querySelector("#addEvent");
    addEventForm.addEventListener("submit", async function (event) {
        event.preventDefault();
    
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

            await getEvents();
            renderEvents();
        } catch (error) {
            console.error(error);
        }
    });

    async function render() {
        await getEvents();
        renderEvents();
    }

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
        const eventList = document.querySelector("#events");

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

    render();
});
