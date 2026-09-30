/**
 * team2-cv-stub.js
 * MediaPipe CV Integration Client
 * Connects to the local Python backend via WebSocket on ws://localhost:8765
 */

class ComputerVisionClient {
    constructor() {
        this.ws = null;
        this.statusDiv = document.getElementById('cv-status');

        this.bindDemoControls();
        this.initWebSocket();
    }

    initWebSocket() {
        this.updateStatus('CV System: Connecting to ws://localhost:8765...', '#facc15');

        try {
            this.ws = new WebSocket('ws://localhost:8765');

            this.ws.onopen = () => {
                this.updateStatus('CV System: Connected. Detecting Exercises.', '#4ade80');
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.event === 'rep_counted') {
                        this.handleRepCounted(data);
                    } else if (data.event === 'frame') {
                        let img = document.getElementById('live-feed-img');
                        if (!img) {
                            img = document.createElement('img');
                            img.id = 'live-feed-img';
                            img.style.width = '100%';
                            img.style.height = '100%';
                            img.style.objectFit = 'cover';
                            document.querySelector('.mock-webcam').innerHTML = '';
                            document.querySelector('.mock-webcam').appendChild(img);
                        }
                        img.src = `data:image/jpeg;base64,${data.image}`;
                    }
                } catch (e) {
                    console.error("Failed to parse WS message", e);
                }
            };

            this.ws.onclose = () => {
                this.updateStatus('CV System: Disconnected. Retrying in 5s...', '#ef4444');
                setTimeout(() => this.initWebSocket(), 5000);
            };

            this.ws.onerror = (err) => {
                console.error('WebSocket Error:', err);
                // Will trigger onclose naturally
            };

        } catch (e) {
            console.error('WebSocket Init Error:', e);
            this.updateStatus('CV System: Failed to Connect', '#ef4444');
        }
    }

    updateStatus(text, color) {
        if (this.statusDiv) {
            this.statusDiv.style.color = color;
            this.statusDiv.innerText = text;
        }
    }

    handleRepCounted(data) {
        // example payload: {"event": "rep_counted", "reps": 7, "depth_ok": true, "form_score": 85.5, "exercise": "squat"}
        const flag = data.depth_ok ? 'GOOD_REP' : 'BAD_REP';
        const accuracy = data.form_score || 0;
        const repCount = data.reps || 1;

        this.updateStatus(`CV System: ${data.exercise.toUpperCase()} - ${flag} (${accuracy.toFixed(1)}%)`, '#4ade80');

        // Fire mascot voice event
        window.dispatchEvent(new CustomEvent('workoutMilestone', {
            detail: { flag, accuracy, repCount }
        }));

        // Trigger reward calculation
        // Convert base form score (0-100) to percentage (0.0-1.0)
        window.dispatchEvent(new CustomEvent('cvDataComputed', {
            detail: { baseXP: 50, accuracyPercentage: (accuracy / 100), flag }
        }));
    }

    bindDemoControls() {
        const demoRepBtn = document.getElementById('demo-rep-btn');
        const demoFailBtn = document.getElementById('demo-fail-btn');
        const demoFinishBtn = document.getElementById('demo-finish-btn');

        // Using synthetic objects to match handleRepCounted expected payload
        if (demoRepBtn) demoRepBtn.addEventListener('click', () => this.handleRepCounted({
            depth_ok: true, form_score: 85, reps: 1, exercise: 'Simulated Squat'
        }));
        if (demoFailBtn) demoFailBtn.addEventListener('click', () => this.handleRepCounted({
            depth_ok: false, form_score: 30, reps: 1, exercise: 'Simulated Squat'
        }));
        if (demoFinishBtn) demoFinishBtn.addEventListener('click', () => {
            // Simulate success which team1 dashboard specifically checks for
            window.dispatchEvent(new CustomEvent('workoutMilestone', {
                detail: { flag: 'SUCCESS', accuracy: 90, repCount: 15 }
            }));
            window.dispatchEvent(new CustomEvent('cvDataComputed', {
                detail: { baseXP: 50, accuracyPercentage: 0.9, flag: 'SUCCESS' }
            }));
        });
    }
}

// Init when loaded
window.cvSystem = new ComputerVisionClient();
