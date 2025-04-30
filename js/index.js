window.addEventListener("DOMContentLoaded", function () {
    const eventsContainer = document.getElementById("events-container");

    let sampleEvents = [
        {
            name: "Summer Music Fest",
            date: "2025-06-12",
            location: "Nairobi",
            Image: "images/party1.png"
        },
        {
            name: "Tech Innovators Meetup",
            date: "2025-05-30",
            location: "Mombasa",
            Image: "images/party3.jpeg"
        }
    ];

    function displayEvents(events) {
        if (!eventsContainer) return;

        eventsContainer.innerHTML = "";
        events.forEach((event, index) => {
            const div = document.createElement("div");
            div.className = "event-card";
            div.innerHTML = `
                <img src="${event.Image}" alt="${event.name}" class="event-image">
                <h3>${event.name}</h3>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <button class="remove-event" data-index="${index}" data-type="${event.type}">Remove</button>
            `;
            eventsContainer.appendChild(div);
        });

        const removeButtons = document.querySelectorAll(".remove-event");
        removeButtons.forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                const type = this.getAttribute("data-type");
                removeEvent(index, type);
            });
        });
    }

    function removeEvent(index, type) {
        if (type === "sample") {
            sampleEvents.splice(index, 1);
        } else if (type === "stored") {
            const events = JSON.parse(localStorage.getItem("events")) || [];
            events.splice(index, 1);
            localStorage.setItem("events", JSON.stringify(events));
        }
        const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
        displayEvents([...sampleEvents.map(event => ({ ...event, type: "sample" })), ...storedEvents.map(event => ({ ...event, type: "stored" }))]);
    }

    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    const allEvents = [
        ...sampleEvents.map(event => ({ ...event, type: "sample" })),
        ...storedEvents.map(event => ({ ...event, type: "stored" }))
    ];
    displayEvents(allEvents);

    const form = document.getElementById("add-event-form");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("event-name").value;
            const date = document.getElementById("event-date").value;
            const location = document.getElementById("event-location").value;
            const image = document.getElementById("event-image").value;

            if (name && date && location && image) {
                const newEvent = { name, date, location, Image: image, type: "stored" };
                const events = JSON.parse(localStorage.getItem("events")) || [];
                events.push(newEvent);
                localStorage.setItem("events", JSON.stringify(events));
                displayEvents([...sampleEvents.map(event => ({ ...event, type: "sample" })), ...events.map(event => ({ ...event, type: "stored" }))]);
                form.reset();
            } else {
                alert("Please fill in all fields.");
            }
        });
    }

    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const message = document.getElementById("message").value;

            if (!name || !email || !message) {
                alert("All fields are required!");
            } else {
                alert("Thank you for your message!");
                contactForm.reset();
            }
        });
    }
});