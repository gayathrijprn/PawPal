/* =========================================================
   PAWPAL - DIGITAL PET PASSPORT
   Complete Pet History • Medical Records • Documents
   ========================================================= */


/* =========================================================
   PET PASSPORT DATA
   ========================================================= */

const passportData = {

    bruno: {

        name: "Bruno",

        breed: "Golden Retriever",

        species: "Dog",

        gender: "Male",

        age: "3 Years",

        dateOfBirth: "14 March 2023",

        colour: "Golden",

        microchip: "98200041234821",

        passportId: "PP-2026-BRUNO-00482",

        registrationDate: "12 January 2025",

        currentOwner: "Sarah Thomas",

        lastUpdated: "20 Aug 2026",

        emergencyNote: "No known allergies",

        vaccinationCount: "2",

        vetVisitCount: "4",

        medicationCount: "0",

        nextDue: "15 Sep",

        photo: "🐶",


        identity: [

            {
                label: "Full Name",
                value: "Bruno"
            },

            {
                label: "Species",
                value: "Dog"
            },

            {
                label: "Breed",
                value: "Golden Retriever"
            },

            {
                label: "Gender",
                value: "Male"
            },

            {
                label: "Date of Birth",
                value: "14 March 2023"
            },

            {
                label: "Age",
                value: "3 Years"
            },

            {
                label: "Colour / Markings",
                value: "Golden coat"
            },

            {
                label: "Microchip ID",
                value: "98200041234821"
            },

            {
                label: "Current Owner",
                value: "Sarah Thomas"
            }

        ],


        medicalHistory: [

            {
                date: "15 Sep 2026",
                title: "Rabies Booster",
                type: "Vaccination",
                status: "Upcoming",
                icon: "💉",
                detail: "Annual rabies booster due."
            },

            {
                date: "20 Aug 2026",
                title: "Deworming",
                type: "Medication",
                status: "Completed",
                icon: "💊",
                detail: "Routine deworming completed."
            },

            {
                date: "10 Jul 2026",
                title: "General Health Check",
                type: "Vet Visit",
                status: "Completed",
                icon: "🩺",
                detail: "Routine wellness examination."
            },

            {
                date: "05 Jun 2026",
                title: "DHPP Vaccine",
                type: "Vaccination",
                status: "Completed",
                icon: "💉",
                detail: "Core DHPP vaccination recorded."
            },

            {
                date: "14 Jan 2026",
                title: "Annual Wellness Examination",
                type: "Vet Visit",
                status: "Completed",
                icon: "🩺",
                detail: "General physical examination completed."
            }

        ],


        vaccinations: [

            {
                vaccine: "DHPP Vaccine",
                date: "05 Jun 2026",
                nextDue: "05 Jun 2027",
                status: "Valid"
            },

            {
                vaccine: "Rabies Vaccine",
                date: "15 Sep 2025",
                nextDue: "15 Sep 2026",
                status: "Upcoming"
            }

        ],


        medications: [],


        vetVisits: [

            {
                date: "10 Jul 2026",
                title: "General Health Check",
                clinic: "PawCare Veterinary Clinic",
                doctor: "Dr. Anjali Menon",
                description: "Routine wellness examination. No major health concerns recorded."
            },

            {
                date: "14 Jan 2026",
                title: "Annual Wellness Examination",
                clinic: "PawCare Veterinary Clinic",
                doctor: "Dr. Anjali Menon",
                description: "General physical examination and preventive health review."
            },

            {
                date: "20 Aug 2025",
                title: "Vaccination Consultation",
                clinic: "Happy Paws Animal Hospital",
                doctor: "Dr. Rahul Nair",
                description: "Vaccination schedule reviewed and preventive care discussed."
            },

            {
                date: "15 Mar 2025",
                title: "Initial Health Assessment",
                clinic: "Happy Paws Animal Hospital",
                doctor: "Dr. Rahul Nair",
                description: "Initial health assessment following adoption."
            }

        ],


        lifeHistory: [

            {
                year: "2024",
                icon: "🐾",
                title: "Rescued",
                description: "Bruno was rescued and brought into the PawPal rescue network."
            },

            {
                year: "2024",
                icon: "🏥",
                title: "Initial Medical Assessment",
                description: "Health condition was assessed and routine preventive care was started."
            },

            {
                year: "2025",
                icon: "🏠",
                title: "Joined PawPal Adoption Network",
                description: "Bruno became available for adoption through PawPal."
            },

            {
                year: "2025",
                icon: "❤️",
                title: "Adopted",
                description: "Bruno was adopted by Sarah Thomas and moved into his new home."
            },

            {
                year: "2026",
                icon: "🐶",
                title: "Current Family",
                description: "Bruno continues to receive regular veterinary and preventive care."
            }

        ],


        documents: [

            {
                icon: "💉",
                title: "Vaccination Certificate",
                type: "PDF",
                size: "245 KB"
            },

            {
                icon: "❤️",
                title: "Adoption Certificate",
                type: "PDF",
                size: "318 KB"
            },

            {
                icon: "🩺",
                title: "Medical Report",
                type: "PDF",
                size: "521 KB"
            },

            {
                icon: "🪪",
                title: "Microchip Record",
                type: "PDF",
                size: "182 KB"
            },

            {
                icon: "📋",
                title: "Health Assessment",
                type: "PDF",
                size: "407 KB"
            },

            {
                icon: "📄",
                title: "PawPal Registration",
                type: "PDF",
                size: "196 KB"
            }

        ]

    },


    luna: {

        name: "Luna",

        breed: "Domestic Shorthair",

        species: "Cat",

        gender: "Female",

        age: "2 Years",

        dateOfBirth: "18 July 2024",

        colour: "White & Grey",

        microchip: "98200058721463",

        passportId: "PP-2026-LUNA-00731",

        registrationDate: "08 November 2025",

        currentOwner: "Sarah Thomas",

        lastUpdated: "28 Aug 2026",

        emergencyNote: "Sensitive to certain flea treatments",

        vaccinationCount: "2",

        vetVisitCount: "3",

        medicationCount: "1",

        nextDue: "12 Sep",

        photo: "🐱",


        identity: [

            {
                label: "Full Name",
                value: "Luna"
            },

            {
                label: "Species",
                value: "Cat"
            },

            {
                label: "Breed",
                value: "Domestic Shorthair"
            },

            {
                label: "Gender",
                value: "Female"
            },

            {
                label: "Date of Birth",
                value: "18 July 2024"
            },

            {
                label: "Age",
                value: "2 Years"
            },

            {
                label: "Colour / Markings",
                value: "White & Grey"
            },

            {
                label: "Microchip ID",
                value: "98200058721463"
            },

            {
                label: "Current Owner",
                value: "Sarah Thomas"
            }

        ],


        medicalHistory: [

            {
                date: "12 Sep 2026",
                title: "Annual Wellness Check",
                type: "Vet Visit",
                status: "Upcoming",
                icon: "🩺",
                detail: "Annual veterinary wellness check due."
            },

            {
                date: "28 Aug 2026",
                title: "Flea & Tick Treatment",
                type: "Medication",
                status: "Active",
                icon: "💊",
                detail: "Current preventative treatment."
            },

            {
                date: "05 Aug 2026",
                title: "Rabies Vaccine",
                type: "Vaccination",
                status: "Completed",
                icon: "💉",
                detail: "Rabies vaccination recorded."
            },

            {
                date: "18 Jul 2026",
                title: "DHPP Vaccine",
                type: "Vaccination",
                status: "Completed",
                icon: "💉",
                detail: "Core vaccination recorded."
            },

            {
                date: "02 May 2026",
                title: "General Health Check",
                type: "Vet Visit",
                status: "Completed",
                icon: "🩺",
                detail: "Routine physical examination completed."
            }

        ],


        vaccinations: [

            {
                vaccine: "Rabies Vaccine",
                date: "05 Aug 2026",
                nextDue: "05 Aug 2027",
                status: "Valid"
            },

            {
                vaccine: "DHPP Vaccine",
                date: "18 Jul 2026",
                nextDue: "18 Jul 2027",
                status: "Valid"
            }

        ],


        medications: [

            {
                name: "Flea & Tick Treatment",
                purpose: "Preventative parasite control",
                dosage: "As prescribed",
                startDate: "28 Aug 2026",
                endDate: "28 Sep 2026",
                status: "Active"
            }

        ],


        vetVisits: [

            {
                date: "02 May 2026",
                title: "General Health Check",
                clinic: "PawCare Veterinary Clinic",
                doctor: "Dr. Anjali Menon",
                description: "Routine physical examination and preventive care review."
            },

            {
                date: "18 Jul 2026",
                title: "Vaccination Visit",
                clinic: "PawCare Veterinary Clinic",
                doctor: "Dr. Anjali Menon",
                description: "Core vaccination administered and health status reviewed."
            },

            {
                date: "05 Aug 2026",
                title: "Rabies Vaccination",
                clinic: "Happy Paws Animal Hospital",
                doctor: "Dr. Rahul Nair",
                description: "Rabies vaccination administered successfully."
            }

        ],


        lifeHistory: [

            {
                year: "2024",
                icon: "🐾",
                title: "Born",
                description: "Luna was born on 18 July 2024."
            },

            {
                year: "2025",
                icon: "🏥",
                title: "Rescued",
                description: "Luna was brought into the PawPal rescue network."
            },

            {
                year: "2025",
                icon: "🏠",
                title: "Registered with PawPal",
                description: "Luna was registered in the PawPal pet care system."
            },

            {
                year: "2025",
                icon: "❤️",
                title: "Adopted",
                description: "Luna was adopted by Sarah Thomas."
            },

            {
                year: "2026",
                icon: "🐱",
                title: "Current Family",
                description: "Luna continues to receive routine vaccinations and preventive care."
            }

        ],


        documents: [

            {
                icon: "💉",
                title: "Vaccination Certificate",
                type: "PDF",
                size: "224 KB"
            },

            {
                icon: "❤️",
                title: "Adoption Certificate",
                type: "PDF",
                size: "301 KB"
            },

            {
                icon: "🩺",
                title: "Medical Report",
                type: "PDF",
                size: "489 KB"
            },

            {
                icon: "💊",
                title: "Medication Record",
                type: "PDF",
                size: "178 KB"
            },

            {
                icon: "🪪",
                title: "Microchip Record",
                type: "PDF",
                size: "191 KB"
            },

            {
                icon: "📄",
                title: "PawPal Registration",
                type: "PDF",
                size: "202 KB"
            }

        ]

    }

};


/* =========================================================
   STATE
   ========================================================= */

const passportState = {
    pet: getSavedPassportPet()
};


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function getSavedPassportPet() {

    try {

        const savedPet =
            localStorage.getItem(
                "pawpal-passport-pet"
            );

        if (
            savedPet &&
            Object.prototype.hasOwnProperty.call(
                passportData,
                savedPet
            )
        ) {
            return savedPet;
        }

    } catch (error) {

        console.warn(
            "Could not read saved passport pet.",
            error
        );

    }

    return "bruno";
}


function savePassportPet(pet) {

    try {

        localStorage.setItem(
            "pawpal-passport-pet",
            pet
        );

    } catch (error) {

        console.warn(
            "Could not save passport pet.",
            error
        );

    }

}


/* =========================================================
   PET SELECTOR
   ========================================================= */

function updatePassportSelector() {

    const buttons =
        document.querySelectorAll(
            ".passport-pet-button"
        );


    buttons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.pet === passportState.pet
        );

    });

}


/* =========================================================
   UPDATE COVER
   ========================================================= */

function renderPassportCover(pet) {

    const photo =
        document.getElementById("passportPhoto");

    const name =
        document.getElementById("passportPetName");

    const breed =
        document.getElementById("passportPetBreed");

    const gender =
        document.getElementById("passportGender");

    const age =
        document.getElementById("passportAge");

    const passportId =
        document.getElementById("passportId");

    const lastUpdated =
        document.getElementById("lastUpdated");


    if (photo) {
        photo.textContent = pet.photo;
    }


    if (name) {
        name.textContent = pet.name;
    }


    if (breed) {
        breed.textContent = pet.breed;
    }


    if (gender) {
        gender.textContent = pet.gender;
    }


    if (age) {
        age.textContent = pet.age;
    }


    if (passportId) {
        passportId.textContent = pet.passportId;
    }


    if (lastUpdated) {
        lastUpdated.textContent = pet.lastUpdated;
    }

}


/* =========================================================
   OVERVIEW
   ========================================================= */

function renderOverview(pet) {

    const vaccinationCount =
        document.getElementById(
            "vaccinationCount"
        );

    const vetVisitCount =
        document.getElementById(
            "vetVisitCount"
        );

    const medicationCount =
        document.getElementById(
            "medicationCount"
        );

    const nextDue =
        document.getElementById(
            "nextDue"
        );


    if (vaccinationCount) {
        vaccinationCount.textContent =
            pet.vaccinationCount;
    }


    if (vetVisitCount) {
        vetVisitCount.textContent =
            pet.vetVisitCount;
    }


    if (medicationCount) {
        medicationCount.textContent =
            pet.medicationCount;
    }


    if (nextDue) {
        nextDue.textContent =
            pet.nextDue;
    }

}


/* =========================================================
   IDENTITY
   ========================================================= */

function renderIdentity(pet) {

    const container =
        document.getElementById(
            "identityGrid"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        pet.identity.map(item => {

            return `

                <div class="identity-item">

                    <small>
                        ${item.label}
                    </small>

                    <strong>
                        ${item.value}
                    </strong>

                </div>

            `;

        }).join("");

}


/* =========================================================
   MEDICAL TIMELINE
   ========================================================= */

function renderMedicalHistory(pet) {

    const container =
        document.getElementById(
            "passportMedicalTimeline"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        pet.medicalHistory.map(event => {

            const statusClass =
                event.status
                    .toLowerCase()
                    .replace(/\s+/g, "-");


            return `

                <div class="passport-timeline-item">

                    <div class="passport-timeline-date">
                        ${event.date}
                    </div>


                    <div class="passport-timeline-marker ${statusClass}">
                        ${event.icon}
                    </div>


                    <div class="passport-timeline-content">

                        <div class="passport-timeline-top">

                            <div>

                                <h4>
                                    ${event.title}
                                </h4>

                                <span class="passport-timeline-type">
                                    ${event.type}
                                </span>

                            </div>


                            <span class="passport-health-status ${statusClass}">
                                ${event.status}
                            </span>

                        </div>


                        <p class="passport-timeline-detail">
                            ${event.detail}
                        </p>

                    </div>

                </div>

            `;

        }).join("");

}


/* =========================================================
   VACCINATIONS
   ========================================================= */

function renderVaccinations(pet) {

    const tbody =
        document.getElementById(
            "vaccinationTableBody"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML =
        pet.vaccinations.map(vaccine => {

            const statusClass =
                vaccine.status.toLowerCase();


            return `

                <tr>

                    <td>
                        ${vaccine.vaccine}
                    </td>

                    <td>
                        ${vaccine.date}
                    </td>

                    <td>
                        ${vaccine.nextDue}
                    </td>

                    <td>

                        <span class="vaccine-status ${statusClass}">
                            ${vaccine.status === "Valid"
                                ? "✓ Valid"
                                : "◷ Upcoming"}
                        </span>

                    </td>

                </tr>

            `;

        }).join("");

}


/* =========================================================
   MEDICATIONS
   ========================================================= */

function renderMedications(pet) {

    const container =
        document.getElementById(
            "medicationList"
        );


    if (!container) {
        return;
    }


    if (
        !pet.medications ||
        pet.medications.length === 0
    ) {

        container.innerHTML = `

            <div class="no-medication">

                <span>
                    💚
                </span>

                <strong>
                    No active medications
                </strong>

                <p>
                    No medication records are currently active
                    for ${pet.name}.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        pet.medications.map(medication => {

            return `

                <div class="medication-card">

                    <div class="medication-icon">
                        💊
                    </div>


                    <div class="medication-content">

                        <div class="medication-content-top">

                            <div>

                                <h4>
                                    ${medication.name}
                                </h4>

                                <span class="medication-purpose">
                                    ${medication.purpose}
                                </span>

                            </div>

                            <span class="medication-status">
                                ${medication.status}
                            </span>

                        </div>


                        <div class="medication-details">

                            <span>
                                Dosage: ${medication.dosage}
                            </span>

                            <span>
                                Start: ${medication.startDate}
                            </span>

                            <span>
                                End: ${medication.endDate}
                            </span>

                        </div>

                    </div>

                </div>

            `;

        }).join("");

}


/* =========================================================
   VET VISITS
   ========================================================= */

function renderVetVisits(pet) {

    const container =
        document.getElementById(
            "vetHistoryGrid"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        pet.vetVisits.map(visit => {

            return `

                <article class="vet-card">

                    <div class="vet-card-top">

                        <span class="vet-icon">
                            🩺
                        </span>

                        <span class="vet-date">
                            ${visit.date}
                        </span>

                    </div>


                    <h4>
                        ${visit.title}
                    </h4>


                    <p class="vet-clinic">
                        ${visit.clinic}
                    </p>


                    <p class="vet-description">
                        ${visit.description}
                    </p>


                    <div class="vet-doctor">

                        <span>
                            👨‍⚕️
                        </span>

                        <span>
                            ${visit.doctor}
                        </span>

                    </div>

                </article>

            `;

        }).join("");

}


/* =========================================================
   LIFE HISTORY
   ========================================================= */

function renderLifeHistory(pet) {

    const container =
        document.getElementById(
            "lifeHistory"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        pet.lifeHistory.map(item => {

            return `

                <div class="life-history-item">

                    <div class="life-history-marker">
                        ${item.icon}
                    </div>


                    <div class="life-history-year">
                        ${item.year}
                    </div>


                    <div class="life-history-content">

                        <h4>
                            ${item.title}
                        </h4>

                        <p>
                            ${item.description}
                        </p>

                    </div>

                </div>

            `;

        }).join("");

}


/* =========================================================
   DOCUMENT VAULT
   ========================================================= */

function renderDocuments(pet) {

    const container =
        document.getElementById(
            "documentGrid"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        pet.documents.map(document => {

            return `

                <div class="document-card">

                    <div class="document-icon">
                        ${document.icon}
                    </div>


                    <div class="document-info">

                        <h4>
                            ${document.title}
                        </h4>

                        <span>
                            ${document.type} • ${document.size}
                        </span>

                    </div>


                    <button
                        type="button"
                        class="document-view"
                        data-document="${document.title}"
                    >
                        View
                    </button>

                </div>

            `;

        }).join("");


    attachDocumentButtons();

}


/* =========================================================
   EMERGENCY INFORMATION
   ========================================================= */

function renderEmergencyInformation(pet) {

    const owner =
        document.getElementById(
            "emergencyOwner"
        );

    const note =
        document.getElementById(
            "emergencyNote"
        );


    if (owner) {
        owner.textContent =
            pet.currentOwner;
    }


    if (note) {
        note.textContent =
            pet.emergencyNote;
    }

}


/* =========================================================
   DOCUMENT BUTTONS
   ========================================================= */

function attachDocumentButtons() {

    const buttons =
        document.querySelectorAll(
            ".document-view"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const documentName =
                    button.dataset.document;


                showPassportToast(
                    `${documentName} will be available once document storage is connected.`
                );

            }
        );

    });

}


/* =========================================================
   TOAST
   ========================================================= */

function showPassportToast(message) {

    const oldToast =
        document.querySelector(
            ".passport-toast"
        );


    if (oldToast) {
        oldToast.remove();
    }


    const toast =
        document.createElement("div");


    toast.className =
        "passport-toast";


    toast.innerHTML = `

        <span>
            🐾
        </span>

        <p>
            ${message}
        </p>

    `;


    document.body.appendChild(toast);


    requestAnimationFrame(() => {

        toast.classList.add("show");

    });


    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3500);

}


/* =========================================================
   RENDER COMPLETE PASSPORT
   ========================================================= */

function renderPassport() {

    const pet =
        passportData[
            passportState.pet
        ];


    if (!pet) {
        return;
    }


    updatePassportSelector();

    renderPassportCover(pet);

    renderOverview(pet);

    renderIdentity(pet);

    renderMedicalHistory(pet);

    renderVaccinations(pet);

    renderMedications(pet);

    renderVetVisits(pet);

    renderLifeHistory(pet);

    renderDocuments(pet);

    renderEmergencyInformation(pet);

}


/* =========================================================
   PET SELECTOR EVENTS
   ========================================================= */

function setupPetSelector() {

    const buttons =
        document.querySelectorAll(
            ".passport-pet-button"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const selectedPet =
                    button.dataset.pet;


                if (
                    !Object.prototype.hasOwnProperty.call(
                        passportData,
                        selectedPet
                    )
                ) {
                    return;
                }


                passportState.pet =
                    selectedPet;


                savePassportPet(
                    selectedPet
                );


                renderPassport();

            }
        );

    });

}


/* =========================================================
   PRINT PASSPORT
   ========================================================= */

function setupPrintButton() {

    const printButton =
        document.getElementById(
            "printPassport"
        );


    if (!printButton) {
        return;
    }


    printButton.addEventListener(
        "click",
        () => {

            window.print();

        }
    );

}


/* =========================================================
   INITIALISE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupPetSelector();

        setupPrintButton();

        renderPassport();

    }
);