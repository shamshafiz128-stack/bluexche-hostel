(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  const searchForm = document.getElementById("hotelSearch");
  const hotelList = document.getElementById("hotelList");

  if (searchForm && hotelList) {
    const destination = document.getElementById("destination");
    const checkIn = document.getElementById("checkIn");
    const checkOut = document.getElementById("checkOut");
    const searchGuests = document.getElementById("searchGuests");
    const searchSummary = document.getElementById("searchSummary");
    const resultCount = document.getElementById("resultCount");
    const sortResults = document.getElementById("sortResults");
    const emptyResults = document.getElementById("emptyResults");
    const mapView = document.getElementById("mapView");
    const filters = document.getElementById("filters");
    const filterToggle = document.getElementById("filterToggle");
    const clearFilters = document.getElementById("clearFilters");
    const hotelCards = [...hotelList.querySelectorAll(".hotel-result")];

    const addDays = (date, days) => {
      const copy = new Date(date);
      copy.setDate(copy.getDate() + days);
      return copy.toISOString().slice(0, 10);
    };

    const today = new Date();
    checkIn.min = addDays(today, 0);
    checkOut.min = addDays(today, 1);
    checkIn.value = addDays(today, 1);
    checkOut.value = addDays(today, 2);

    checkIn.addEventListener("change", () => {
      checkOut.min = addDays(new Date(`${checkIn.value}T12:00:00`), 1);
      if (!checkOut.value || checkOut.value <= checkIn.value) {
        checkOut.value = checkOut.min;
      }
    });

    const roomFacilities = {
      business: ["wifi", "meals", "delivery", "ac"],
      economy: ["wifi", "meals", "delivery"],
      simple: ["wifi", "meals", "delivery"],
    };

    const applyFilters = () => {
      const selectedRooms = [
        ...filters.querySelectorAll('input[name="roomFilter"]:checked'),
      ].map((input) => input.value);
      const maxPrice = Number(
        filters.querySelector('input[name="priceFilter"]:checked').value
      );
      const selectedFacilities = [
        ...filters.querySelectorAll(
          'fieldset:last-of-type input[type="checkbox"]:checked'
        ),
      ].map((input) => input.value);

      let visible = 0;
      hotelCards.forEach((card) => {
        const room = card.dataset.room;
        const roomMatch =
          selectedRooms.length === 0 || selectedRooms.includes(room);
        const priceMatch =
          maxPrice === 0 || Number(card.dataset.price) <= maxPrice;
        const facilityMatch = selectedFacilities.every((facility) =>
          roomFacilities[room].includes(facility)
        );
        const show = roomMatch && priceMatch && facilityMatch;
        card.hidden = !show;
        if (show) visible += 1;
      });

      resultCount.textContent = String(visible);
      emptyResults.hidden = visible !== 0;
    };

    filters.querySelectorAll("input").forEach((input) => {
      input.addEventListener("change", applyFilters);
    });

    clearFilters.addEventListener("click", () => {
      filters
        .querySelectorAll('input[type="checkbox"]')
        .forEach((input) => (input.checked = false));
      filters.querySelector('input[name="priceFilter"][value="all"]').checked =
        true;
      applyFilters();
    });

    filterToggle.addEventListener("click", () => {
      filters.classList.toggle("is-open");
      filterToggle.textContent = filters.classList.contains("is-open")
        ? "Hide filters"
        : "Filters";
    });

    sortResults.addEventListener("change", () => {
      const mode = sortResults.value;
      const sorted = [...hotelCards].sort((a, b) => {
        if (mode === "low") return Number(a.dataset.price) - Number(b.dataset.price);
        if (mode === "high") return Number(b.dataset.price) - Number(a.dataset.price);
        if (mode === "rating")
          return Number(b.dataset.rating) - Number(a.dataset.rating);
        return hotelCards.indexOf(a) - hotelCards.indexOf(b);
      });
      sorted.forEach((card) => hotelList.append(card));
    });

    document.querySelectorAll(".view-btn").forEach((button) => {
      button.addEventListener("click", () => {
        document
          .querySelectorAll(".view-btn")
          .forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        const showMap = button.dataset.view === "map";
        hotelList.hidden = showMap;
        emptyResults.hidden = showMap || Number(resultCount.textContent) !== 0;
        mapView.hidden = !showMap;
      });
    });

    const updateSearchSummary = () => {
      const guestCount = Number(searchGuests.value);
      searchSummary.textContent = `${destination.value || "Karachi"} · 1 room · ${guestCount} guest${guestCount > 1 ? "s" : ""}`;
    };

    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      updateSearchSummary();
      document.getElementById("results").scrollIntoView({ behavior: "smooth" });
    });
    searchGuests.addEventListener("change", updateSearchSummary);

    const searchRoomData = {
      business: {
        title: "Bluexche Karachi Central",
        text: "Business AC room with attached bathroom, work desk, daily housekeeping, free Wi-Fi and room delivery.",
        price: 4500,
        image:
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=85",
      },
      economy: {
        title: "Bluexche City View",
        text: "Comfortable economy room with Wi-Fi, secure locker, meal options and room delivery on request.",
        price: 2800,
        image:
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85",
      },
      simple: {
        title: "Bluexche Budget Stay",
        text: "Clean simple room with shared lounge, drinking water, free Wi-Fi and optional daily meals.",
        price: 1800,
        image:
          "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=85",
      },
    };

    const searchDialog = document.getElementById("searchRoomDialog");
    const searchDialogImage = document.getElementById("searchDialogImage");
    const searchDialogTitle = document.getElementById("searchDialogTitle");
    const searchDialogText = document.getElementById("searchDialogText");
    const searchDialogDates = document.getElementById("searchDialogDates");
    const searchDialogGuests = document.getElementById("searchDialogGuests");
    const searchDialogPrice = document.getElementById("searchDialogPrice");
    const searchBookingStatus = document.getElementById("searchBookingStatus");
    let selectedSearchRoom = "";

    const openSearchRoom = (roomKey) => {
      const room = searchRoomData[roomKey];
      if (!room) return;
      selectedSearchRoom = roomKey;
      searchDialogImage.src = room.image;
      searchDialogImage.alt = room.title;
      searchDialogTitle.textContent = room.title;
      searchDialogText.textContent = room.text;
      searchDialogDates.textContent = `${checkIn.value} → ${checkOut.value}`;
      searchDialogGuests.textContent = `${searchGuests.value} guest${searchGuests.value === "1" ? "" : "s"}`;
      searchDialogPrice.textContent = `Rs ${room.price.toLocaleString("en-PK")}`;
      searchBookingStatus.textContent = "";
      searchDialog.showModal();
    };

    document
      .querySelectorAll(".select-room-btn, .details-link")
      .forEach((button) => {
        button.addEventListener("click", () => openSearchRoom(button.dataset.room));
      });

    searchDialog
      .querySelector(".search-dialog-close")
      .addEventListener("click", () => searchDialog.close());
    searchDialog.addEventListener("click", (event) => {
      if (event.target === searchDialog) searchDialog.close();
    });

    document
      .getElementById("reserveSearchRoom")
      .addEventListener("click", () => {
        const room = searchRoomData[selectedSearchRoom];
        searchBookingStatus.textContent = `${room.title} reserved for ${checkIn.value}. We’ll contact you to confirm payment.`;
      });
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  const rates = {
    business: { rent: 4500, food: 1200, label: "Business AC" },
    economy: { rent: 2800, food: 900, label: "Economy" },
    simple: { rent: 1800, food: 650, label: "Simple" },
  };

  const roomDetails = {
    business: {
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1400&q=80",
      alt: "Business AC room with bed and workspace",
      meal: "Optional full meal plan: Rs 1,200 per day.",
      services: [
        "Private AC room",
        "Attached washroom",
        "High-speed Wi-Fi",
        "Work desk",
        "Daily housekeeping",
        "Three-meal option",
      ],
    },
    economy: {
      image:
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1400&q=80",
      alt: "Economy hostel room",
      meal: "Optional meal plan: Rs 900 per day.",
      services: [
        "Fan / cooler",
        "Washroom access",
        "Wi-Fi",
        "Locker space",
        "Housekeeping on request",
        "Two-meal option",
      ],
    },
    simple: {
      image:
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1400&q=80",
      alt: "Simple budget hostel room",
      meal: "Optional dinner plan: Rs 650 per day.",
      services: [
        "Clean bedding",
        "Shared washroom",
        "Common lounge",
        "Drinking water",
        "Secure storage",
        "Dinner option",
      ],
    },
  };

  const money = (n) => `Rs ${n.toLocaleString("en-PK")}`;

  const dialog = document.getElementById("roomDialog");
  const dialogImage = document.getElementById("dialogImage");
  const dialogTitle = document.getElementById("dialogTitle");
  const dialogRent = document.getElementById("dialogRent");
  const dialogMeal = document.getElementById("dialogMeal");
  const dialogServices = document.getElementById("dialogServices");
  const continueBooking = document.getElementById("continueBooking");
  let selectedRoom = "";

  document.querySelectorAll(".room-book-btn").forEach((button) => {
    button.addEventListener("click", () => {
      selectedRoom = button.dataset.room;
      const room = rates[selectedRoom];
      const details = roomDetails[selectedRoom];
      if (!dialog || !room || !details) return;

      dialogTitle.textContent = `${room.label} Room`;
      dialogRent.textContent = `${money(room.rent)} / day`;
      dialogMeal.textContent = details.meal;
      dialogImage.src = details.image;
      dialogImage.alt = details.alt;
      dialogServices.replaceChildren(
        ...details.services.map((service) => {
          const item = document.createElement("li");
          item.textContent = service;
          return item;
        })
      );
      dialog.showModal();
    });
  });

  if (dialog) {
    dialog.querySelector(".dialog-close").addEventListener("click", () => {
      dialog.close();
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  const form = document.querySelector(".booking-form");
  if (!form) return;

  const status = form.querySelector(".form-status");
  const rentDay = document.getElementById("rentDay");
  const foodDay = document.getElementById("foodDay");
  const totalCost = document.getElementById("totalCost");
  const discountLine = document.getElementById("discountLine");
  const occLine = document.getElementById("occLine");

  const fields = {
    guestName: form.querySelector("#guestName"),
    email: form.querySelector("#email"),
    phone: form.querySelector("#phone"),
    bookingDate: form.querySelector("#bookingDate"),
    days: form.querySelector("#days"),
    rooms: form.querySelector("#rooms"),
    guests: form.querySelector("#guests"),
    roomType: form.querySelector("#roomType"),
    includeMeals: form.querySelector("#includeMeals"),
    roomDelivery: form.querySelector("#roomDelivery"),
  };

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  fields.bookingDate.min = `${yyyy}-${mm}-${dd}`;

  const messages = {
    guestName: "Please enter your full name",
    email: "Please enter a valid email",
    phone: "Enter a valid phone (03XXXXXXXXX)",
    bookingDate: "Please choose a booking date",
    days: "Enter days between 1 and 60",
    guests: "Guests must be 1 or 2",
    roomType: "Please select a room type",
  };

  const setError = (key, text) => {
    const input = fields[key];
    const error = form.querySelector(`[data-error-for="${key}"]`);
    if (error) error.textContent = text || "";
    if (input && input.classList) {
      input.classList.toggle("invalid", Boolean(text));
    }
  };

  const updateQuote = () => {
    const key = fields.roomType.value;
    const days = Number(fields.days.value) || 0;
    const guests = Number(fields.guests.value) || 1;
    const room = rates[key];

    if (occLine) {
      occLine.textContent = `1 room · ${guests} guest${guests > 1 ? "s" : ""}`;
    }

    if (!room || days < 1) {
      rentDay.textContent = "—";
      foodDay.textContent = "—";
      discountLine.textContent = "Add 7+ days to save 20%";
      totalCost.textContent = "—";
      return;
    }

    const foodPerDay = fields.includeMeals.checked ? room.food : 0;
    const delivery = fields.roomDelivery.checked ? 150 : 0;
    const regularDiscount = days >= 7 ? room.rent * days * 0.2 : 0;
    const total = room.rent * days - regularDiscount + foodPerDay * days + delivery;

    rentDay.textContent = money(room.rent);
    foodDay.textContent = fields.includeMeals.checked
      ? money(room.food)
      : "Not included";
    discountLine.textContent =
      regularDiscount > 0
        ? `−${money(regularDiscount)} (20% off room rent)`
        : "Add 7+ days to save 20%";
    totalCost.textContent = money(total);
  };

  const validate = () => {
    let ok = true;
    const phone = fields.phone.value.replace(/\s+/g, "");
    const email = fields.email.value.trim();
    const days = Number(fields.days.value);
    const guests = Number(fields.guests.value);

    if (!fields.guestName.value.trim()) {
      setError("guestName", messages.guestName);
      ok = false;
    } else {
      setError("guestName", "");
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("email", messages.email);
      ok = false;
    } else {
      setError("email", "");
    }

    if (!/^03\d{9}$/.test(phone)) {
      setError("phone", messages.phone);
      ok = false;
    } else {
      setError("phone", "");
    }

    if (!fields.bookingDate.value) {
      setError("bookingDate", messages.bookingDate);
      ok = false;
    } else {
      setError("bookingDate", "");
    }

    if (!Number.isFinite(days) || days < 1 || days > 60) {
      setError("days", messages.days);
      ok = false;
    } else {
      setError("days", "");
    }

    if (guests !== 1 && guests !== 2) {
      setError("guests", messages.guests);
      ok = false;
    } else {
      setError("guests", "");
    }

    if (!fields.roomType.value) {
      setError("roomType", messages.roomType);
      ok = false;
    } else {
      setError("roomType", "");
    }

    return ok;
  };

  ["guestName", "email", "phone", "bookingDate", "days", "guests", "roomType"].forEach(
    (key) => {
      fields[key].addEventListener("input", () => {
        if (status) status.textContent = "";
        validate();
        updateQuote();
      });
      fields[key].addEventListener("change", updateQuote);
    }
  );

  fields.includeMeals.addEventListener("change", updateQuote);
  fields.roomDelivery.addEventListener("change", updateQuote);

  if (continueBooking) {
    continueBooking.addEventListener("click", () => {
      fields.roomType.value = selectedRoom;
      dialog.close();
      updateQuote();
      document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
    });
  }

  updateQuote();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validate()) {
      if (status) status.textContent = "";
      return;
    }

    const room = rates[fields.roomType.value];
    const days = Number(fields.days.value);
    const guests = Number(fields.guests.value);
    const date = fields.bookingDate.value;

    if (status) {
      status.textContent = `Booking saved: ${room.label}, ${date}, ${days} day${days > 1 ? "s" : ""}, 1 room · ${guests} guest${guests > 1 ? "s" : ""}. We’ll confirm soon.`;
    }

    form.reset();
    fields.days.value = "1";
    fields.rooms.value = "1";
    fields.guests.value = "2";
    updateQuote();
    Object.keys(messages).forEach((key) => setError(key, ""));
  });
})();
