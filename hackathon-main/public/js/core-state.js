/**
 * core-state.js
 * Central State Manager for the Application.
 * Acts as the single source of truth interfacing with localStorage and dispatching events.
 */

const DEFAULT_STATE = {
  patient_id: "P-101",
  tokens: 850,
  current_streak: 3,
  staked_tokens: 100,
  active_goal: "15 Squats",
  active_environment: "zen_garden",
  completed_reps: 0,
  unlocked_personalities: ["default_coach", "drill_sergeant"],
  active_personality: "drill_sergeant",
  unlocked_environments: ["default_theme", "zen_garden"]
};

class StateManager {
  constructor() {
    this.state = this.loadState();
    this.initState();
  }

  loadState() {
    const saved = localStorage.getItem('rehab_state');
    if (saved) {
      try {
        return { ...DEFAULT_STATE, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_STATE;
      }
    }
    return DEFAULT_STATE;
  }

  saveState() {
    localStorage.setItem('rehab_state', JSON.stringify(this.state));
    // Dispatch a global event every time state changes
    window.dispatchEvent(new CustomEvent('stateChanged', { detail: this.state }));
  }

  initState() {
    // Initial dispatch to set up DOM elements
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('stateChanged', { detail: this.state }));
    }, 0);
  }

  // Getters & Setters
  getState() {
    return { ...this.state };
  }

  updateUserTokens(amount) {
    this.state.tokens += amount;
    this.saveState();
  }

  updateStakedTokens(amount) {
    this.state.staked_tokens = amount;
    this.saveState();
  }

  updateRepsTracker(count) {
    this.state.completed_reps = count;
    this.saveState();
  }

  unlockItem(type, id, cost) {
    if (this.state.tokens < cost) return false;

    if (type === 'environment' && !this.state.unlocked_environments.includes(id)) {
      this.state.unlocked_environments.push(id);
    } else if (type === 'personality' && !this.state.unlocked_personalities.includes(id)) {
      this.state.unlocked_personalities.push(id);
    } else {
      return false; // Already unlocked
    }

    this.state.tokens -= cost;
    this.saveState();
    return true;
  }

  equipItem(type, id) {
    if (type === 'environment' && this.state.unlocked_environments.includes(id)) {
      this.state.active_environment = id;
      this.saveState();
    } else if (type === 'personality' && this.state.unlocked_personalities.includes(id)) {
      this.state.active_personality = id;
      this.saveState();
    }
  }
}

// Global instance
window.coreState = new StateManager();
