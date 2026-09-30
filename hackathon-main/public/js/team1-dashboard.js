/**
 * team1-dashboard.js
 * Handles UI logic, staking mechanism, storefront.
 */

class DashboardUI {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        // Listen to global state changes to update DOM
        window.addEventListener('stateChanged', (e) => {
            this.render(e.detail);
        });

        // Listen to CV output for reward calculating
        window.addEventListener('cvDataComputed', (e) => {
            const { baseXP, accuracyPercentage, flag } = e.detail;
            if (flag === 'GOOD_REP' || flag === 'SUCCESS') {
                this.calculateRewards(baseXP, accuracyPercentage);
            }

            if (flag === 'SUCCESS') {
                this.handleGoalMet();
            }
        });

        window.addEventListener('workoutMilestone', (e) => {
            if (e.detail.repCount !== undefined) {
                window.coreState.updateRepsTracker(e.detail.repCount);
            }
        });

        // Staking Action
        const stakeBtn = document.getElementById('stake-btn');
        if (stakeBtn) {
            stakeBtn.addEventListener('click', () => {
                const state = window.coreState.getState();
                if (state.tokens >= 50) {
                    window.coreState.updateUserTokens(-50);
                    window.coreState.updateStakedTokens(state.staked_tokens + 50);
                } else {
                    alert('Not enough tokens to stake!');
                }
            });
        }

        // Store Purchases/Equips
        const storeBtns = document.querySelectorAll('.store-item');
        storeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                const id = e.target.dataset.id;
                const cost = parseInt(e.target.dataset.cost);
                const state = window.coreState.getState();

                // Check if unlocked
                const isUnlocked = type === 'environment'
                    ? state.unlocked_environments.includes(id)
                    : state.unlocked_personalities.includes(id);

                if (isUnlocked) {
                    // Equip
                    window.coreState.equipItem(type, id);
                } else {
                    // Buy
                    if (window.coreState.unlockItem(type, id, cost)) {
                        window.coreState.equipItem(type, id);
                    } else {
                        alert('Cannot purchase item. Not enough tokens or already unlocked.');
                    }
                }
            });
        });
    }

    calculateRewards(baseXP, accuracyPercentage) {
        const state = window.coreState.getState();
        const streak = state.current_streak;

        // Formula: (baseXP * accuracyPercentage) + (current_streak * 10)
        const earnedTokens = Math.floor((baseXP * accuracyPercentage) + (streak * 10));

        if (earnedTokens > 0) {
            window.coreState.updateUserTokens(earnedTokens);
        }
    }

    handleGoalMet() {
        const state = window.coreState.getState();
        const staked = state.staked_tokens;

        if (staked > 0) {
            // Multiply staked tokens by 2 and add to wallet
            const reward = staked * 2;
            window.coreState.updateUserTokens(reward);
            window.coreState.updateStakedTokens(0);
            alert(`Goal Met! You won ${reward} tokens from your stake!`);
        } else {
            alert('Goal Met! No tokens staked today, but great job.');
        }
    }

    render(state) {
        // Top bar text
        document.getElementById('token-balance').innerText = state.tokens;
        document.getElementById('streak-count').innerText = state.current_streak;
        document.getElementById('patient-id').innerText = state.patient_id;

        // Staking UI
        document.getElementById('active-goal-text').innerText = state.active_goal;
        document.getElementById('staked-amount').innerText = state.staked_tokens;
        const repCountEl = document.getElementById('completed-reps');
        if (repCountEl) repCountEl.innerText = state.completed_reps || 0;

        // Adjust theme
        document.body.className = `theme-${state.active_environment}`;

        // Update store buttons UI (Locked vs Equipped)
        const storeBtns = document.querySelectorAll('.store-item');
        storeBtns.forEach(btn => {
            const type = btn.dataset.type;
            const id = btn.dataset.id;

            const isUnlocked = type === 'environment'
                ? state.unlocked_environments.includes(id)
                : state.unlocked_personalities.includes(id);

            const isEquipped = type === 'environment'
                ? state.active_environment === id
                : state.active_personality === id;

            if (isEquipped) {
                btn.innerText = 'Equipped';
                btn.classList.add('equipped');
                btn.classList.remove('unlocked');
            } else if (isUnlocked) {
                btn.innerText = 'Equip';
                btn.classList.add('unlocked');
                btn.classList.remove('equipped');
            } else {
                // Leave as cost text
                const cost = btn.dataset.cost;
                let displayName = id.replace('_', ' ');
                displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
                btn.innerText = `${displayName} (${cost}🪙)`;
                btn.classList.remove('equipped', 'unlocked');
            }
        });
    }
}

// Init when loaded
window.dashboardUI = new DashboardUI();
