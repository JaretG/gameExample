import { Idle, Running } from './playerStates.js';

export class Player {
    constructor(game) {
        this.game = game;
        this.width = 148;
        this.height = 141;
        this.hitboxWidth = 120;
        this.hitboxHeight = 40;   
        this.hitboxOffsetX = 14;  
        this.hitboxOffsetY = 50;


        this.x = 0;
        this.y = this.game.height / 2 - this.height / 2;
        this.image = document.getElementById('player1');
        this.maxFrame;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.maxSpeed = 5;
        this.angle = 0;

        this.states = [new Idle(this), new Running(this)];
        this.currentState = this.states[0];
        this.currentState.enter();
    }

    reset(){
        this.x = 0;
        this.y = this.game.height / 2 - this.height / 2;
        this.speedX = 0;
        this.speedY = 0;
        this.angle = 0;
        this.frameX = 0;
        this.frameTimer = 0;
        this.setState(0, 0);   // back to Idle (speed 0)
    }

    update(input, deltaTime) {
        // Only check collisions while the game is actively playing
        if(this.game.gameState === 'playing'){
            this.checkCollision();
        }
        this.currentState.handleInput(input);

        // Horizontal movement
        if (input.includes('ArrowRight')) this.speedX = this.maxSpeed;
        else if (input.includes('ArrowLeft')) this.speedX = -this.maxSpeed;
        else this.speedX = 0;

        // Vertical movement
        if (input.includes('ArrowDown')) this.speedY = this.maxSpeed;
        else if (input.includes('ArrowUp')) this.speedY = -this.maxSpeed;
        else this.speedY = 0;

        // Apply movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Keep inside screen
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y > this.game.height - this.height) this.y = this.game.height - this.height;

        // ROTATION
        // Starts looking right angle = 0
        if (input.includes('ArrowUp')) {
            this.angle = -Math.PI / 4;   // -45 degrees
            
        } else if (input.includes('ArrowDown')) {
            this.angle = Math.PI / 4;    // +45 degrees
        } else {
            this.angle = 0;              // facing right
        }

        // Sprite animation
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }

    draw(context) {
        if (this.game.debug) {
        // Draw the rotated hitbox outline
        const cx = this.x + this.hitboxOffsetX + this.hitboxWidth / 2;
        const cy = this.y + this.hitboxOffsetY + this.hitboxHeight / 2;
        const hw = this.hitboxWidth / 2;
        const hh = this.hitboxHeight / 2;
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);

        context.save();
        context.strokeStyle = 'red';
        context.beginPath();
        const corners = [
            { x: -hw, y: -hh },
            { x:  hw, y: -hh },
            { x:  hw, y:  hh },
            { x: -hw, y:  hh }
        ];
        corners.forEach((c, i) => {
            const px = cx + (c.x * cos - c.y * sin);
            const py = cy + (c.x * sin + c.y * cos);
            if (i === 0) context.moveTo(px, py);
            else context.lineTo(px, py);
        });
        context.closePath();
        context.stroke();
        context.restore();
    }
        
        // part that actually rotates the character
        context.save();
        context.translate(this.x + this.width / 2, this.y + this.height / 2);
        context.rotate(this.angle);
        context.drawImage(
            this.image,
            this.frameX * this.width,
            this.frameY * this.height,
            this.width,
            this.height,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        context.restore();
    }

    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }

    checkCollision(){
    // Center of the *hitbox*, not the whole sprite
    const cx = this.x + this.hitboxOffsetX + this.hitboxWidth / 2;
    const cy = this.y + this.hitboxOffsetY + this.hitboxHeight / 2;

    const hw = this.hitboxWidth / 2;
    const hh = this.hitboxHeight / 2;

    const cos = Math.cos(this.angle);
    const sin = Math.sin(this.angle);

    this.game.enemies.forEach(enemy => {
        const ex = enemy.x + enemy.width / 2;
        const ey = enemy.y + enemy.height / 2;
        const ehw = enemy.width / 2;
        const ehh = enemy.height / 2;

        const dx = ex - cx;
        const dy = ey - cy;

        // player's local X
        const dist1 = Math.abs(dx * cos + dy * sin);
        const proj1 = hw + ehw * Math.abs(cos) + ehh * Math.abs(sin);
        if (dist1 > proj1) return;

        // player's local Y
        const dist2 = Math.abs(-dx * sin + dy * cos);
        const proj2 = hh + ehw * Math.abs(sin) + ehh * Math.abs(cos);
        if (dist2 > proj2) return;

        // World X
        const distX = Math.abs(dx);
        const projX = ehw + hw * Math.abs(cos) + hh * Math.abs(sin);
        if (distX > projX) return;

        // World Y
        const distY = Math.abs(dy);
        const projY = ehh + hw * Math.abs(sin) + hh * Math.abs(cos);
        if (distY > projY) return;

        // Real overlap = die
        enemy.markedForDeletion = true;
        this.game.setGameOver();
    });
}
}