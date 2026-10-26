const states = {
    IDLE: 0,
    RUNNING: 1,
}

class State {
    constructor(state) {
        this.state = state;
    }
}

export class Idle extends State {
    constructor(player) {
        super('IDLE');
        this.player = player;
    }
    enter() {
        this.player.frameX = 0;
        this.player.frameY = 2;      // Use row 0 for idle
        this.player.maxFrame = 3;
    }
    handleInput(input) {
        // Any arrow key pressed = start running
        if (input.includes('ArrowLeft') ||
            input.includes('ArrowRight') ||
            input.includes('ArrowUp') ||
            input.includes('ArrowDown')) {
            this.player.setState(states.RUNNING, 1);
        }
    }
}

export class Running extends State {
    constructor(player) {
        super('RUNNING');
        this.player = player;
    }
    enter() {
        this.player.frameX = 0;
        this.player.frameY = 2;      // Use row 2 for running animation
        this.player.maxFrame = 3;
    }
    handleInput(input) {
        // No movement keys = go back to idle
        if (!input.includes('ArrowLeft') &&
            !input.includes('ArrowRight') &&
            !input.includes('ArrowUp') &&
            !input.includes('ArrowDown')) {
            //this.player.setState(states.IDLE, 0);
        }
    }
}