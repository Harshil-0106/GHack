/**
 * virtual-room.js
 * A minimal Phaser 3 2D environment allowing the user to walk around
 * a single room and purchase furniture using their global token wallet.
 */

class RoomScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RoomScene' });
    }

    createEmojiTexture(key, emoji, size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.font = `${size * 0.8}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, size / 2, size / 2 + size * 0.05);
        this.textures.addCanvas(key, canvas);
    }

    preload() {
        this.createEmojiTexture('player', '🏃', 32);
        this.createEmojiTexture('wall', '🧱', 64);
        this.createEmojiTexture('desk', '💻', 64);
        this.createEmojiTexture('bed', '🛏️', 64);

        const g = this.add.graphics();
        g.fillStyle(0x0f172a, 1);
        g.fillRect(0, 0, 64, 64);
        g.lineStyle(1, 0x1e293b, 1);
        g.strokeRect(0, 0, 64, 64);
        g.generateTexture('floor', 64, 64);
        g.clear();

        g.lineStyle(2, 0xeab308, 1);
        g.strokeRect(0, 0, 64, 64);
        g.generateTexture('buy-zone', 64, 64);
        g.destroy();
    }

    create() {
        this.add.tileSprite(400, 200, 800, 400, 'floor');

        const walls = this.physics.add.staticGroup();
        for (let x = 32; x < 800; x += 64) {
            walls.create(x, 32, 'wall');
            walls.create(x, 400 - 32, 'wall');
        }
        for (let y = 32; y < 400; y += 64) {
            if (y !== 32 && y !== (400 - 32)) {
                walls.create(32, y, 'wall');
                walls.create(800 - 32, y, 'wall');
            }
        }

        this.items = [
            { id: 'desk', cost: 150, x: 200, y: 120, bought: false },
            { id: 'bed', cost: 300, x: 600, y: 120, bought: false }
        ];

        this.zones = this.physics.add.staticGroup();
        this.furnitureSprites = [];

        this.items.forEach(item => {
            const zone = this.zones.create(item.x, item.y, 'buy-zone');
            zone.itemData = item;

            const label = this.add.text(item.x, item.y - 45, `${item.id.toUpperCase()}\n${item.cost}🪙`, {
                fontSize: '14px', fill: '#000', align: 'center', fontStyle: 'bold'
            }).setOrigin(0.5);
            zone.label = label;
        });

        this.player = this.physics.add.sprite(400, 200, 'player');
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, walls);
        this.physics.add.collider(this.player, this.zones);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.gameTokens = window.coreState ? window.coreState.getState().tokens : 0;
        window.addEventListener('stateChanged', (e) => {
            this.gameTokens = e.detail.tokens;
        });

        this.promptText = this.add.text(400, 360, "", {
            fontSize: '18px', fill: '#000', backgroundColor: '#fff', padding: 8
        }).setOrigin(0.5).setVisible(false);
    }

    update() {
        const speed = 160;
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
        }

        this.handleInteractions();
    }

    handleInteractions() {
        this.promptText.setVisible(false);
        let standingNear = null;

        this.zones.getChildren().forEach(zone => {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, zone.x, zone.y);
            if (dist < 80 && !zone.itemData.bought) {
                standingNear = zone;
            }
        });

        if (standingNear) {
            if (this.gameTokens >= standingNear.itemData.cost) {
                this.promptText.setText(`Press SPACE to buy ${standingNear.itemData.id} (Cost: ${standingNear.itemData.cost}🪙)`);
                this.promptText.setVisible(true);

                if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
                    this.buyItem(standingNear);
                }
            } else {
                this.promptText.setText(`Not enough tokens for ${standingNear.itemData.id} (${standingNear.itemData.cost}🪙)`);
                this.promptText.setVisible(true);
            }
        }
    }

    buyItem(zone) {
        if (window.coreState && window.coreState.getState().tokens >= zone.itemData.cost) {
            window.coreState.updateUserTokens(-zone.itemData.cost);
            zone.itemData.bought = true;

            zone.disableBody(true, true);
            zone.label.setVisible(false);

            const furn = this.physics.add.staticSprite(zone.itemData.x, zone.itemData.y, 'desk');
            if (zone.itemData.id === 'bed') {
                furn.setTexture('bed');
            }
            this.physics.add.collider(this.player, furn);

            this.promptText.setText("Purchased!");

            // Hook up to Viora widget if loaded!
            if (window.Viora && window.Viora.say) {
                window.Viora.say(`Awesome! You just bought the ${zone.itemData.id}!`);
            }
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    parent: 'phaser-game',
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: RoomScene,
    backgroundColor: '#0f172a'
};

// Launch Phaser game!
try {
    window.phaserGame = new Phaser.Game(config);
} catch (e) {
    document.getElementById('phaser-game').innerText = "Phaser Load Error: " + e.toString();
    console.error(e);
}
