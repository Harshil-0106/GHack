/**
 * team3-mascot.js
 * Logic for reading active persona, generating dynamic prompts, and triggering TTS.
 */

const PERSONALITIES = {
    default_coach: {
        pitch: 1.0,
        rate: 1.0,
        greeting: "Let's get started on your rehab.",
        goodRep: "Good form. Keep it up.",
        badRep: "Check your form. Try again.",
        success: "Workout complete. Great job today."
    },
    drill_sergeant: {
        pitch: 0.6,
        rate: 1.2,
        greeting: "Listen up recruit! Time for training!",
        goodRep: "That's exactly how it's done! Give me another!",
        badRep: "What was that? Drop deeper! Fix your form!",
        success: "Oorah! Mission accomplished recruit! Outstanding effort!"
    },
    zen_master: {
        pitch: 0.9,
        rate: 0.8,
        greeting: "Find your center. Breath and focus.",
        goodRep: "Harmonious movement. Excellent flow.",
        badRep: "Do not rush. Feel the movement deeply.",
        success: "You have achieved balance today. Rest now."
    }
};

class MascotSystem {
    constructor() {
        this.greeted = false;
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('stateChanged', (e) => {
            this.updateMascotVisuals(e.detail);
        });

        // Listen for milestone events from team2-cv-stub
        window.addEventListener('workoutMilestone', (e) => {
            const { flag } = e.detail;
            this.triggerMascotVoice(flag);
        });
    }

    updateMascotVisuals(state) {
        if (!this.greeted && window.Viora && window.Viora.say) {
            this.greeted = true;
            const p = PERSONALITIES[state.active_personality] || PERSONALITIES.default_coach;
            window.Viora.say(p.greeting);
        }
    }

    triggerMascotVoice(contextFlag) {
        const state = window.coreState.getState();
        const activeId = state.active_personality || 'default_coach';
        const persona = PERSONALITIES[activeId] || PERSONALITIES.default_coach;

        let textToSpeak = "";
        if (contextFlag === 'GOOD_REP') textToSpeak = persona.goodRep;
        else if (contextFlag === 'BAD_REP') textToSpeak = persona.badRep;
        else if (contextFlag === 'SUCCESS') textToSpeak = persona.success;
        else textToSpeak = persona.greeting;

        if (window.Viora && window.Viora.say) {
            window.Viora.say(textToSpeak);
        } else {
            console.warn("Viora TTS skipped, 3D widget not loaded.");
        }
    }
}

// Init when file loads
window.mascotSystem = new MascotSystem();
