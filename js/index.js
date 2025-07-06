window.addEventListener('DOMContentLoaded', () => {
    const eventsContainer = document.getElementById('events-container');
    const form = document.getElementById('add-event-form');
    const contactForm = document.getElementById('contact-form');

    let sampleEvents = [
        {
            name: 'Summer Music Festival',
            date: '2025-06-15',
            location: 'Nairobi',
            image: 'images/party1.png',
            type: 'sample',
        },
        {
            name: 'Tech Conference 2025',
            date: '2025-09-10',
            location: 'Mombasa',
            image: 'images/party3.jpeg',
            type: 'sample',
        }
    ];

    const getStoredEvents = () => JSON.parse(localStorage.getItem('events')) || [];

    const saveEvents = (events) => {
        const events = getStoredEvents();
        events.push(event);
        localStorage.setItem('events', JSON.stringify(events));
    };

    const removeEvent = (index, type) => {
        if (type === 'sample') {
            sampleEvents.splice(index, 1);
        } else {
            const events = getStoredEvents();
            events.splice(index - sampleEvents.length, 1); // Adjust index for stored events
            localStorage.setItem('events', JSON.stringify(events));
        }
        renderEvents();
    };
     
    const renderEvents = () => {
        if (!eventsContainer) return;
        const stored = getStoredEvents();
        const allEvents = [...sampleEvents, ...stored];
        eventsContainer.innerHTML = '';

        allEvents.forEach((event, index) => {
            const card = document.createElement('div');
            card.className = 'event-card fade-in';
            card.innerHTML = `
                <img src="${event.image}" alt="${event.name}" class="event-image">
                <h3>${event.name}</h3>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <button class="remove-event" data-index="${index}" data-type="${event.type}">Remove</button>
          `;
            eventsContainer.appendChild(card);
    });

     document.querySelectorAll(".remove-event").forEach(button => {
      button.addEventListener("click", () => {
        const index = parseInt(button.getAttribute("data-index"));
        const type = button.getAttribute("data-type");
        removeEvent(index, type);
        showToast("Event Removed ❌");
      });
    });
  };

  // Add new event
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("event-name").value.trim();
      const date = document.getElementById("event-date").value;
      const location = document.getElementById("event-location").value.trim();
      const image = document.getElementById("event-image").value.trim();

      if (!name || !date || !location || !image) {
        showToast("Please fill in all fields ❗");
        return;
      }

      const newEvent = { name, date, location, image, type: "stored" };
      saveEvent(newEvent);
      renderEvents();
      form.reset();
      showToast("Event Added ✅");
    });
  }

  // Contact form feedback
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        showToast("All fields required ❗");
        return;
      }

      showToast("Thank you for your message 💌");
      contactForm.reset();
    });
  }

  // Toast notification system
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => toast.classList.remove("show"), 3000);
    setTimeout(() => toast.remove(), 3500);
  }

  // Fade-in animation (CSS hook)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  });

  setTimeout(() => {
    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
  }, 200);

  renderEvents();
});

                