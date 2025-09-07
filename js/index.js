window.addEventListener('DOMContentLoaded', () => {
  const eventsContainer = document.getElementById('events-container');
  const pastEventsContainer = document.getElementById('past-events-container');
  const form = document.getElementById('add-event-form');
  const modal = document.getElementById('event-modal');
  const closeBtn = document.querySelector('.close-btn');

  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalDate = document.getElementById('modal-date');
  const modalLocation = document.getElementById('modal-location');
  const modalCategory = document.getElementById('modal-category');

  let sampleEvents = [
    { name: 'Summer Music Festival', date: '2025-06-15', location: 'Nairobi', image: 'images/party1.png', category: 'Music', type: 'sample' },
    { name: 'Tech Conference 2025', date: '2025-09-10', location: 'Mombasa', image: 'images/party3.jpeg', category: 'Tech', type: 'sample' }
  ];

  const getStoredEvents = () => JSON.parse(localStorage.getItem('events')) || [];
  const saveEvent = (event) => {
    const events = getStoredEvents();
    events.push(event);
    localStorage.setItem('events', JSON.stringify(events));
  };

  const removeEvent = (index, type) => {
    if (type === 'sample') {
      sampleEvents.splice(index, 1);
    } else {
      const events = getStoredEvents();
      events.splice(index - sampleEvents.length, 1);
      localStorage.setItem('events', JSON.stringify(events));
    }
    renderEvents();
  };

  const renderEvents = () => {
    if (!eventsContainer || !pastEventsContainer) return;
    const stored = getStoredEvents();
    const allEvents = [...sampleEvents, ...stored];

    eventsContainer.innerHTML = '';
    pastEventsContainer.innerHTML = '';

    const today = new Date().toISOString().split('T')[0];

    allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    allEvents.forEach((event, index) => {
      const card = document.createElement('div');
      card.className = 'event-card fade-in';
      card.innerHTML = `
        <img src="${event.image}" alt="${event.name}" class="event-image">
        <h3>${event.name}</h3>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <span class="category-badge">${event.category}</span><br>
        <button class="remove-event" data-index="${index}" data-type="${event.type}">Remove</button>
      `;

      // Add modal open
      card.querySelector('img').addEventListener('click', () => openModal(event));

      if (event.date >= today) {
        eventsContainer.appendChild(card);
      } else {
        pastEventsContainer.appendChild(card);
      }
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
      const category = document.getElementById("event-category").value.trim();

      if (!name || !date || !location || !image || !category) {
        showToast("Please fill in all fields ❗");
        return;
      }

      const newEvent = { name, date, location, image, category, type: "stored" };
      saveEvent(newEvent);
      renderEvents();
      form.reset();
      showToast("Event Added ✅");
    });
  }

  // Modal functions
  function openModal(event) {
    modal.style.display = 'flex';
    modalImage.src = event.image;
    modalTitle.textContent = event.name;
    modalDate.textContent = `Date: ${event.date}`;
    modalLocation.textContent = `Location: ${event.location}`;
    modalCategory.textContent = `Category: ${event.category}`;
  }

  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

  // Toast
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
