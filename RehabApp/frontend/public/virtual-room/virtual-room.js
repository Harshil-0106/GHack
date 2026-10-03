/* Idle RPG Game for Rehab Platform */

class IdleRPG extends Phaser.Scene {
    constructor() {
        super({ key: 'IdleRPG' });
    }

    preload() {
        // Generate basic placeholder textures for Hero and Monster
        let g1 = this.make.graphics({ x: 0, y: 0, add: false });
        g1.fillStyle(0x3b82f6, 1);
        g1.fillCircle(32, 32, 32);
        g1.fillStyle(0x1e3a8a, 1);
        g1.fillRect(40, 20, 40, 10); // sword
        g1.generateTexture('hero', 80, 64);

        let g2 = this.make.graphics({ x: 0, y: 0, add: false });
        g2.fillStyle(0xef4444, 1);
        g2.fillTriangle(32, 0, 64, 64, 0, 64);
        g2.generateTexture('monster', 64, 64);
    }

    create() {
        this.cameras.main.setBackgroundColor('#1c1917');

        // Core game stats
        this.heroStats = {
            maxHp: 100,
            hp: 100,
            attack: 10
        };

        this.monsterLevel = 1;
        this.monsterStats = {
            maxHp: 50,
            hp: 50,
            attack: 5
        };

        // UI Setup
        this.add.text(400, 30, 'Idle Rehab Hero RPG', { fontSize: '28px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

        // Hero Setup
        this.hero = this.add.sprite(200, 200, 'hero');
        this.heroHpBarBg = this.add.rectangle(200, 130, 100, 15, 0x555555);
        this.heroHpBarFill = this.add.rectangle(200, 130, 100, 15, 0x22c55e);
        this.heroHpText = this.add.text(200, 130, '100/100', { fontSize: '12px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.text(200, 100, 'YOUR HERO', { fontSize: '18px', color: '#3b82f6', fontStyle: 'bold' }).setOrigin(0.5);
        this.heroAtkText = this.add.text(200, 250, `ATK: 10`, { fontSize: '16px', color: '#9ca3af' }).setOrigin(0.5);

        // Monster Setup
        this.monster = this.add.sprite(600, 200, 'monster');
        this.monsterHpBarBg = this.add.rectangle(600, 130, 100, 15, 0x555555);
        this.monsterHpBarFill = this.add.rectangle(600, 130, 100, 15, 0xef4444);
        this.monsterHpText = this.add.text(600, 130, '50/50', { fontSize: '12px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        this.monsterLevelText = this.add.text(600, 100, `Slime (Lv 1)`, { fontSize: '18px', color: '#ef4444', fontStyle: 'bold' }).setOrigin(0.5);
        this.monsterAtkText = this.add.text(600, 250, `ATK: 5`, { fontSize: '16px', color: '#9ca3af' }).setOrigin(0.5);

        // Shop UI
        let shopBg = this.add.rectangle(400, 350, 800, 100, 0x292524);
        this.add.text(400, 320, '-- TOKEN SHOP --', { fontSize: '14px', color: '#f59e0b' }).setOrigin(0.5);

        this.upgradeAtkBtn = this.add.rectangle(250, 360, 220, 40, 0x3b82f6).setInteractive({ useHandCursor: true });
        this.add.text(250, 360, 'Upgrade Sword (20 Tokens)', { fontSize: '14px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

        this.upgradeHpBtn = this.add.rectangle(550, 360, 220, 40, 0x10b981).setInteractive({ useHandCursor: true });
        this.add.text(550, 360, 'Upgrade Max HP (20 Tokens)', { fontSize: '14px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

        // Interactions
        this.upgradeAtkBtn.on('pointerdown', () => this.buyUpgrade('attack'));
        this.upgradeHpBtn.on('pointerdown', () => this.buyUpgrade('hp'));

        // Tokens Display
        this.tokenDisplay = this.add.text(400, 80, 'Tokens: 0', { fontSize: '24px', color: '#fbbf24', fontStyle: 'bold' }).setOrigin(0.5);

        // Battle Timer
        this.battleEvent = this.time.addEvent({
            delay: 1500,
            callback: this.combatTick,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        // Sync tokens continuously from state manager
        if (window.coreState) {
            this.tokenDisplay.setText(`Tokens: ${window.coreState.getState().tokens}`);
        }
    }

    buyUpgrade(type) {
        if (!window.coreState) return;
        let tokens = window.coreState.getState().tokens;

        if (tokens >= 20) {
            window.coreState.updateUserTokens(-20); // deduct tokens via universal logic

            if (type === 'attack') {
                this.heroStats.attack += 5;
                this.heroAtkText.setText(`ATK: ${this.heroStats.attack}`);
                if (window.Viora) window.Viora.say("Sword upgraded! Slay those monsters.");
            } else if (type === 'hp') {
                this.heroStats.maxHp += 20;
                this.heroStats.hp = this.heroStats.maxHp;
                if (window.Viora) window.Viora.say("Max health increased! You're getting tougher.");
            }
            this.updateHpBars();

            // Floating animation for purchase
            let valText = this.add.text(400, 350, '-20 Tokens', { fontSize: '20px', color: '#ef4444', fontStyle: 'bold' }).setOrigin(0.5);
            this.tweens.add({
                targets: valText, y: 300, alpha: 0, duration: 1000,
                onComplete: () => valText.destroy()
            });

        } else {
            if (window.Viora) window.Viora.say("You don't have enough tokens! Complete more reps!");
        }
    }

    combatTick() {
        if (this.monsterStats.hp <= 0 || this.heroStats.hp <= 0) return;

        this.monsterStats.hp -= this.heroStats.attack;

        this.tweens.add({
            targets: this.hero, x: 250, duration: 100, yoyo: true,
            onComplete: () => {
                if (this.monsterStats.hp > 0) {
                    this.heroStats.hp -= this.monsterStats.attack;
                    this.tweens.add({
                        targets: this.monster, x: 550, duration: 100, yoyo: true,
                        onComplete: () => {
                            this.updateHpBars();
                            this.checkCombatStatus();
                        }
                    });
                } else {
                    this.updateHpBars();
                    this.checkCombatStatus();
                }
            }
        });
    }

    checkCombatStatus() {
        if (this.monsterStats.hp <= 0) {
            this.monsterLevel++;
            this.monsterStats.maxHp = 50 + (this.monsterLevel * 20);
            this.monsterStats.hp = this.monsterStats.maxHp;
            this.monsterStats.attack = 5 + (this.monsterLevel * 3);

            this.monsterLevelText.setText(`Monster (Lv ${this.monsterLevel})`);
            this.monsterAtkText.setText(`ATK: ${this.monsterStats.attack}`);

            this.heroStats.hp = Math.min(this.heroStats.maxHp, this.heroStats.hp + 10);

            let rewardText = this.add.text(600, 150, 'Defeated!', { fontSize: '20px', color: '#fbbf24', fontStyle: 'bold' }).setOrigin(0.5);
            this.tweens.add({
                targets: rewardText, y: 100, alpha: 0, duration: 1500,
                onComplete: () => rewardText.destroy()
            });

            if (window.Viora && this.monsterLevel % 5 === 0) {
                window.Viora.say(`Wow, level ${this.monsterLevel} reached! Excellent progress.`);
            }

        } else if (this.heroStats.hp <= 0) {
            this.heroStats.hp = this.heroStats.maxHp;
            this.monsterLevel = Math.max(1, this.monsterLevel - 2);
            this.monsterStats.maxHp = 50 + (this.monsterLevel * 20);
            this.monsterStats.hp = this.monsterStats.maxHp;
            this.monsterStats.attack = 5 + (this.monsterLevel * 3);

            this.monsterLevelText.setText(`Monster (Lv ${this.monsterLevel})`);
            this.monsterAtkText.setText(`ATK: ${this.monsterStats.attack}`);

            let dieText = this.add.text(200, 150, 'Felled...', { fontSize: '20px', color: '#ef4444', fontStyle: 'bold' }).setOrigin(0.5);
            this.tweens.add({
                targets: dieText, y: 100, alpha: 0, duration: 2000,
                onComplete: () => dieText.destroy()
            });

            if (window.Viora) window.Viora.say("Oh no! The monster got you. Spend some tokens to gear up!");
        }
        this.updateHpBars();
    }

    updateHpBars() {
        let hPct = Math.max(0, this.heroStats.hp / this.heroStats.maxHp);
        this.heroHpBarFill.width = 100 * hPct;
        this.heroHpText.setText(`${Math.max(0, this.heroStats.hp)}/${this.heroStats.maxHp}`);

        let mPct = Math.max(0, this.monsterStats.hp / this.monsterStats.maxHp);
        this.monsterHpBarFill.width = 100 * mPct;
        this.monsterHpText.setText(`${Math.max(0, this.monsterStats.hp)}/${this.monsterStats.maxHp}`);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    parent: 'phaser-game',
    scene: [IdleRPG]
};

if (!window.phaserGame) {
    window.phaserGame = new Phaser.Game(config);
}
