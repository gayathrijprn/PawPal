document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   PAWPAL AI ASSISTANT
===================================================== */

const assistantButton =
    document.querySelector(".pawpal-assistant-button");

const assistantPanel =
    document.querySelector(".pawpal-assistant-panel");

const closeButton =
    document.querySelector(".pawpal-assistant-close");

const assistantForm =
    document.getElementById("pawpal-assistant-form");

const assistantInput =
    document.getElementById("pawpal-assistant-input");

const messages =
    document.getElementById("pawpal-assistant-messages");

const stopButton =
    document.getElementById("pawpal-assistant-stop");


/* =====================================================
   CHECK ELEMENTS
===================================================== */

if (!assistantButton) {
    console.error("❌ PawPal Assistant button not found.");
    return;
}

if (!assistantPanel) {
    console.error("❌ PawPal Assistant panel not found.");
    return;
}

if (!assistantForm) {
    console.error("❌ PawPal Assistant form not found.");
    return;
}

console.log("🐾 PawPal Assistant loaded successfully.");


/* =====================================================
   VOICE SETTINGS
===================================================== */

let voiceEnabled = true;

let currentSpeech = null;


/* =====================================================
   CREATE VOICE BUTTON
===================================================== */

const controls =
    document.querySelector(".pawpal-assistant-controls");

let voiceButton = null;

if (controls) {

    voiceButton =
        document.createElement("button");

    voiceButton.type = "button";

    voiceButton.className =
        "pawpal-assistant-voice voice-on";

    voiceButton.textContent =
        "🔊 Voice ON";

    voiceButton.title =
        "Turn PawPal voice on or off";

    voiceButton.setAttribute(
        "aria-label",
        "Toggle PawPal voice"
    );

    controls.insertBefore(
        voiceButton,
        stopButton || controls.firstChild
    );
}


/* =====================================================
   OPEN ASSISTANT
===================================================== */

assistantButton.addEventListener("click", () => {

    console.log("🐾 Assistant button clicked.");

    assistantPanel.classList.add("active");

    setTimeout(() => {
        if (assistantInput) {
            assistantInput.focus();
        }
    }, 200);

});


/* =====================================================
   CLOSE ASSISTANT
===================================================== */

if (closeButton) {

    closeButton.addEventListener("click", () => {

        assistantPanel.classList.remove("active");

        stopSpeaking();

    });

}


/* =====================================================
   CLOSE WHEN CLICKING OUTSIDE
===================================================== */

document.addEventListener("click", (event) => {

    if (!assistantPanel.classList.contains("active")) {
        return;
    }

    const clickedInsidePanel =
        assistantPanel.contains(event.target);

    const clickedButton =
        assistantButton.contains(event.target);

    if (!clickedInsidePanel && !clickedButton) {

        assistantPanel.classList.remove("active");

        stopSpeaking();
    }

});


/* =====================================================
   ESCAPE KEY
===================================================== */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        assistantPanel.classList.remove("active");

        stopSpeaking();
    }

});


/* =====================================================
   VOICE TOGGLE
===================================================== */

if (voiceButton) {

    voiceButton.addEventListener("click", () => {

        voiceEnabled = !voiceEnabled;

        if (voiceEnabled) {

            voiceButton.textContent =
                "🔊 Voice ON";

            voiceButton.classList.remove(
                "voice-off"
            );

            voiceButton.classList.add(
                "voice-on"
            );

            console.log("🔊 PawPal voice ON");

        } else {

            voiceButton.textContent =
                "🔇 Voice OFF";

            voiceButton.classList.remove(
                "voice-on"
            );

            voiceButton.classList.add(
                "voice-off"
            );

            stopSpeaking();

            console.log("🔇 PawPal voice OFF");
        }

    });

}


/* =====================================================
   STOP SPEAKING
===================================================== */

function stopSpeaking() {

    if (
        "speechSynthesis" in window
    ) {

        window.speechSynthesis.cancel();

        currentSpeech = null;
    }

}


if (stopButton) {

    stopButton.addEventListener(
        "click",
        () => {

            stopSpeaking();

        }
    );

}


/* =====================================================
   ADD MESSAGE
===================================================== */

function addMessage(
    text,
    sender
) {

    if (!messages) {
        return;
    }

    const message =
        document.createElement("div");

    message.className =
        `pawpal-message ${sender}`;

    const content =
        document.createElement("div");

    content.className =
        "pawpal-message-content";

    content.textContent = text;

    message.appendChild(content);

    messages.appendChild(message);

    messages.scrollTop =
        messages.scrollHeight;

    return message;
}


/* =====================================================
   ADD LOADING MESSAGE
===================================================== */

function addLoadingMessage() {

    if (!messages) {
        return null;
    }

    const message =
        document.createElement("div");

    message.className =
        "pawpal-message assistant pawpal-loading";

    const content =
        document.createElement("div");

    content.className =
        "pawpal-message-content";

    content.innerHTML =
        `
            <span></span>
            <span></span>
            <span></span>
        `;

    message.appendChild(content);

    messages.appendChild(message);

    messages.scrollTop =
        messages.scrollHeight;

    return message;
}


/* =====================================================
   SPEAK AI RESPONSE
===================================================== */

function speakResponse(text) {

    if (!voiceEnabled) {
        return;
    }

    if (!("speechSynthesis" in window)) {

        console.warn(
            "⚠️ Speech synthesis is not supported."
        );

        return;
    }

    stopSpeaking();

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.rate = 1;

    speech.pitch = 1;

    speech.volume = 1;

    speech.lang = "en-IN";

    currentSpeech = speech;

    window.speechSynthesis.speak(
        speech
    );

}


/* =====================================================
   SEND MESSAGE
===================================================== */

assistantForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const message =
            assistantInput.value.trim();

        if (!message) {
            return;
        }


        /* User message */

        addMessage(
            message,
            "user"
        );

        assistantInput.value = "";

        assistantInput.disabled = true;


        /* Loading */

        const loadingMessage =
            addLoadingMessage();


        try {

            console.log(
                "🐾 Sending to PawPal AI:",
                message
            );


            const response =
                await fetch(
                    "http://localhost:3000/api/assistant",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            message: message
                        })
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}`
                );

            }


            const data =
                await response.json();


            console.log(
                "🤖 PawPal AI response:",
                data
            );


            /* Remove loading */

            if (loadingMessage) {
                loadingMessage.remove();
            }


            /* AI response */

            if (
                data &&
                data.success &&
                data.answer
            ) {

                addMessage(
                    data.answer,
                    "assistant"
                );

                speakResponse(
                    data.answer
                );

            } else {

                addMessage(
                    "Sorry, I couldn't understand that. Please try again. 🐾",
                    "assistant"
                );

            }


        } catch (error) {

            console.error(
                "❌ PawPal Assistant Error:",
                error
            );


            if (loadingMessage) {
                loadingMessage.remove();
            }


            addMessage(
                "Sorry! PawPal AI is currently unavailable. Please make sure the AI server is running. 🐾",
                "assistant"
            );

        } finally {

            assistantInput.disabled = false;

            assistantInput.focus();

        }

    }
);


/* =====================================================
   INITIAL STATE
===================================================== */

console.log(
    "🐾 PawPal AI is ready!"
);
});