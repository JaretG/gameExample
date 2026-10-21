export class UI{
    constructor(game){
        this.game=game;
        this.fontSize=30;
        this.fontFamily='Helvetica';
    }
    draw(context){
        context.font=this.fontSize+'px '+this.fontFamily;
        context.textAlign='left';
        context.fillStyle=this.game.fontColor;

        context.fillText('Highest Score: '+ this.game.highestScore,20,50);
        context.fillText('Score: '+ this.game.score,20,80);

        //waiting
        if(this.game.gameState === 'waiting'){
            context.textAlign = 'center';
            context.font = '40px ' + this.fontFamily;
            context.fillText('Press ENTER to Start', this.game.width / 2, this.game.height / 2);
            context.font = '20px ' + this.fontFamily;
            context.fillText('Use Arrow Keys to move · Avoid the pillars!', this.game.width / 2, this.game.height / 2 + 40);
        }

        // Gameover
        if(this.game.gameState === 'gameOver'){
            context.textAlign = 'center';
            context.font = '50px ' + this.fontFamily;
            context.fillStyle = 'red';
            context.fillText('GAME OVER', this.game.width / 2, this.game.height / 2 - 30);

            context.fillStyle = this.game.fontColor;
            context.font = '30px ' + this.fontFamily;
            context.fillText('Final Score: ' + this.game.score, this.game.width / 2, this.game.height / 2 + 20);

            context.font = '22px ' + this.fontFamily;
            context.fillText('Press ENTER to Restart', this.game.width / 2, this.game.height / 2 + 60);
        }

    }
}