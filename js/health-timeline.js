/* =========================================================
   PAWPAL - HEALTH TIMELINE
   Medication + Vaccination + Vet Visit Tracker
   Frontend demo version
   ========================================================= */


/* ================= HEALTH DATA ================= */

const healthData = {

    bruno: {

        name: "Bruno",

        vaccinations: 4,

        activeMedications: 0,

        nextDue: {
            date: "15 Sep",
            title: "Rabies Booster"
        },

        lastVet: {
            date: "10 Jul",
            title: "General Check-up"
        },

        timeline: [

            {
                date: "15 Sep 2026",
                title: "Rabies Booster",
                description: "Annual rabies vaccination is scheduled for Bruno.",
                type: "Vaccination",
                status: "Upcoming",
                icon: "💉"
            },

            {
                date: "20 Aug 2026",
                title: "Deworming",
                description: "Routine deworming treatment completed.",
                type: "Medication",
                status: "Completed",
                icon: "💊"
            },

            {
                date: "10 Jul 2026",
                title: "General Health Check",
                description: "Routine veterinary examination completed.",
                type: "Vet Visit",
                status: "Completed",
                icon: "🩺"
            },

            {
                date: "05 Jun 2026",
                title: "DHPP Vaccine",
                description: "DHPP vaccination dose recorded.",
                type: "Vaccination",
                status: "Completed",
                icon: "💉"
            },

            {
                date: "12 Mar 2026",
                title: "Annual Wellness Check",
                description: "Routine wellness examination completed.",
                type: "Vet Visit",
                status: "Completed",
                icon: "🩺"
            }

        ],

        reminders: [

            {
                icon: "💉",
                title: "Rabies Booster",
                description: "Vaccination appointment is coming up.",
                date: "15 September 2026"
            },

            {
                icon: "💊",
                title: "Deworming",
                description: "Next routine treatment should be checked.",
                date: "20 November 2026"
            },

            {
                icon: "🩺",
                title: "Wellness Check",
                description: "Keep Bruno's routine check-up schedule updated.",
                date: "December 2026"
            }

        ]

    },


    luna: {

        name: "Luna",

        vaccinations: 3,

        activeMedications: 1,

        nextDue: {
            date: "12 Sep",
            title: "Annual Wellness Check"
        },

        lastVet: {
            date: "05 Aug",
            title: "Rabies Vaccine"
        },

        timeline: [

            {
                date: "12 Sep 2026",
                title: "Annual Wellness Check",
                description: "Luna's upcoming routine veterinary check-up.",
                type: "Vet Visit",
                status: "Upcoming",
                icon: "🩺"
            },

            {
                date: "28 Aug 2026",
                title: "Flea & Tick Treatment",
                description: "Monthly parasite prevention treatment is active.",
                type: "Medication",
                status: "Active",
                icon: "💊"
            },

            {
                date: "05 Aug 2026",
                title: "Rabies Vaccine",
                description: "Rabies vaccination successfully recorded.",
                type: "Vaccination",
                status: "Completed",
                icon: "💉"
            },

            {
                date: "18 Jul 2026",
                title: "DHPP Vaccine",
                description: "DHPP vaccination dose recorded.",
                type: "Vaccination",
                status: "Completed",
                icon: "💉"
            },

            {
                date: "02 May 2026",
                title: "General Health Check",
                description: "Routine veterinary examination completed.",
                type: "Vet Visit",
                status: "Completed",
                icon: "🩺"
            }

        ],

        reminders: [

            {
                icon: "🩺",
                title: "Annual Wellness Check",
                description: "Luna's routine health check is approaching.",
                date: "12 September 2026"
            },

            {
                icon: "💊",
                title: "Flea & Tick Treatment",
                description: "Continue the monthly parasite prevention.",
                date: "28 September 2026"
            },

            {
                icon: "💉",
                title: "Vaccination Review",
                description: "Review Luna's upcoming vaccination schedule.",
                date: "October 2026"
            }

        ]

    }

};


/* ================= DOM ELEMENTS ================= */

const petButtons = document.querySelectorAll(".health-pet-button");

const timelineList = document.getElementById("health-timeline-list");

const reminderList = document.getElementById("health-reminder-list");

const vaccineCount = document.getElementById("vaccine-count");

const medicationCount = document.getElementById("medication-count");

const medicationLabel = document.getElementById("medication-label");

const nextDueDate = document.getElementById("next-due-date");

const nextDueName = document.getElementById("next-due-name");

const lastVetDate = document.getElementById("last-vet-date");

const lastVetName = document.getElementById("last-vet-name");

const timelinePetTitle = document.getElementById("timeline-pet-title");

const addHealthRecordButton = document.getElementById("add-health-record");


/* ================= STORAGE ================= */

const STORAGE_KEY = "pawpal-health-pet";


/* ================= GET SAVED PET ================= */

function getSavedPet() {

    const savedPet = localStorage.getItem(STORAGE_KEY);

    if (savedPet && healthData[savedPet]) {
        return savedPet;
    }

    return "bruno";
}


/* ================= SAVE PET ================= */

function savePet(petId) {

    localStorage.setItem(STORAGE_KEY, petId);

}


/* ================= STATUS CLASS ================= */

function getStatusClass(status) {

    return status.toLowerCase();

}


/* ================= TYPE CLASS ================= */

function getTypeClass(type) {

    if (type === "Vaccination") {
        return "vaccination";
    }

    if (type === "Medication") {
        return "medication";
    }

    return "vet";

}


/* ================= RENDER SUMMARY ================= */

function renderSummary(pet) {

    vaccineCount.textContent = pet.vaccinations;

    medicationCount.textContent = pet.activeMedications;

    if (pet.activeMedications === 1) {

        medicationLabel.textContent = "active";

    } else {

        medicationLabel.textContent = "active";

    }

    nextDueDate.textContent = pet.nextDue.date;

    nextDueName.textContent = pet.nextDue.title;

    lastVetDate.textContent = pet.lastVet.date;

    lastVetName.textContent = pet.lastVet.title;

    timelinePetTitle.textContent = `${pet.name}'s Health Timeline`;

}


/* ================= RENDER TIMELINE ================= */

function renderTimeline(pet) {

    if (!timelineList) {
        return;
    }

    timelineList.innerHTML = "";

    pet.timeline.forEach(event => {

        const eventElement = document.createElement("div");

        eventElement.className =
            `health-event ${getTypeClass(event.type)}`;

        eventElement.innerHTML = `

            <div class="health-event-icon">
                ${event.icon}
            </div>

            <div class="health-event-content">

                <div class="health-event-top">

                    <div>

                        <span class="health-event-date">
                            ${event.date}
                        </span>

                        <h4 class="health-event-title">
                            ${event.title}
                        </h4>

                    </div>

                    <span class="health-status ${getStatusClass(event.status)}">
                        ${event.status}
                    </span>

                </div>

                <p class="health-event-description">
                    ${event.description}
                </p>

                <span class="health-event-type">
                    ${event.type}
                </span>

            </div>

        `;

        timelineList.appendChild(eventElement);

    });

}


/* ================= RENDER REMINDERS ================= */

function renderReminders(pet) {

    if (!reminderList) {
        return;
    }

    reminderList.innerHTML = "";

    pet.reminders.forEach(reminder => {

        const reminderElement = document.createElement("div");

        reminderElement.className = "health-reminder-item";

        reminderElement.innerHTML = `

            <span class="health-reminder-icon">
                ${reminder.icon}
            </span>

            <div>

                <strong>
                    ${reminder.title}
                </strong>

                <small>
                    ${reminder.description}
                </small>

                <span class="health-reminder-date">
                    ${reminder.date}
                </span>

            </div>

        `;

        reminderList.appendChild(reminderElement);

    });

}


/* ================= SELECT PET ================= */

function selectPet(petId) {

    const pet = healthData[petId];

    if (!pet) {
        return;
    }

    savePet(petId);

    petButtons.forEach(button => {

        const buttonPet = button.dataset.pet;

        button.classList.toggle(
            "active",
            buttonPet === petId
        );

    });

    renderSummary(pet);

    renderTimeline(pet);

    renderReminders(pet);

}


/* ================= PET BUTTON EVENTS ================= */

petButtons.forEach(button => {

    button.addEventListener("click", () => {

        const petId = button.dataset.pet;

        selectPet(petId);

    });

});


/* ================= ADD RECORD BUTTON ================= */

if (addHealthRecordButton) {

    addHealthRecordButton.addEventListener("click", () => {

        showHealthToast(
            "Health record feature will be connected to your database next."
        );

    });

}


/* ================= TOAST ================= */

function showHealthToast(message) {

    const existingToast =
        document.querySelector(".health-toast");

    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement("div");

    toast.className = "health-toast";

    toast.textContent = message;

    document.body.appendChild(toast);


    setTimeout(() => {

        toast.classList.add("show");

    }, 10);


    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2800);

}


/* ================= TOAST STYLES ================= */

const toastStyle = document.createElement("style");

toastStyle.textContent = `

    .health-toast {

        position: fixed;

        right: 25px;

        bottom: 25px;

        z-index: 9999;

        max-width: 330px;

        padding: 14px 18px;

        background: #342923;

        color: white;

        border-radius: 14px;

        box-shadow: 0 12px 30px rgba(52, 41, 35, 0.20);

        font-family: "DM Sans", sans-serif;

        font-size: 12px;

        line-height: 1.5;

        opacity: 0;

        transform: translateY(15px);

        transition: 0.3s ease;

    }


    .health-toast.show {

        opacity: 1;

        transform: translateY(0);

    }


    @media (max-width: 600px) {

        .health-toast {

            left: 18px;

            right: 18px;

            bottom: 18px;

            max-width: none;

            text-align: center;

        }

    }

`;

document.head.appendChild(toastStyle);


/* ================= INITIAL LOAD ================= */

document.addEventListener("DOMContentLoaded", () => {

    const savedPet = getSavedPet();

    selectPet(savedPet);

});