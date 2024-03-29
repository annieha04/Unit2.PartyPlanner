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
                    name: addEventForm.title.value,
                    date: new Date(addEventForm.date.value),
                    time: addEventForm.time.value,
                    location: addEventForm.location.value,
                    description: addEventForm.description.value,                  
                }),
            });
            // console.log(response.body)
            const json = await response.json();
            if (json.error) {
                throw new Error(json.message);
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
            const events = await response.json();
            state.events = events.data;
            // render();
        } catch (error) {
            console.error(error);
        }
    }

    function renderEvents() {
        const eventList = document.querySelector("#events");

        if (!state.events.length) {
            eventList.innerHTML = "<p>No events.</p>";
            return;
        }
        
        const eventCards = state.events.map((event) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <h2>${event.name}</h2>
                <p>Date: ${event.date}</p>
                <p>Time: ${event.time}</p>
                <p>Location: ${event.location}</p>
                <p>Description: ${event.description}</p>
                <button class="delete-button" data-event-id="${event.id}">Delete</button>
            `;
            return li;
            eventCards.replaceChildren(...event);
        });

        eventList.replaceChildren(...eventCards);

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const eventId = event.target.dataset.eventId;
                deleteEvent(eventId);
            });
        });
    }

    async function deleteEvent(eventId) {
        try {
            const response = await fetch(`${API_URL}/${eventId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete event');
            }

            await getEvents();
            renderEvents();
        } catch (error) {
            console.error(error);
        }
    }

    render();
});