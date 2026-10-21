class Enemy{
    constructor(){
        this.frameX=0;
        this.frameY=0;
        this.fps=20;
        this.frameInterval=1000/this.fps;
        this.frameTimer=0;
        this.markedForDeletion=false;
        this.scored=false;


    }
    update(deltaTime){
        this.x -= this.speedX+this.game.speed;
        this.y += this.speedY;
        if(this.frameTimer>this.frameInterval){
            this.frameTimer=0;
            if(this.frameX<this.maxFrame) this.frameX++;
            else this.frameX=0;
        }else{
            this.frameTimer+=deltaTime;
        }

        if (!this.scored && this.x + this.width < this.game.player.x) {
            if (this.isTop) {                 // only score once per pair
                this.game.score++;
                if(this.game.score>this.game.highestScore){
                    this.game.highestScore=this.game.score;
                }
            }
            this.scored = true;
        }

        // Still delete the pillar when it goes fully off-screen
        if (this.x + this.width < 0) {
            this.markedForDeletion = true;
        }
    }
    draw(context){
        if(this.game.debug)context.strokeRect(this.x,this.y,this.width,this.height);

        context.drawImage(this.image,this.frameX*this.width,0,this.width,this.height,this.x,this.y,this.width,this.height)
    }
    


}

export class PillarEnemy extends Enemy{//child class
    constructor(game,isTop,gapY,gapSize){
        super();//calling code from constructor
        this.game=game;
        this.width=91;
        this.height=233;
        this.x=this.game.width;
        this.speedX=2;
        this.speedY=0;

        this.maxFrame=0;
        this.image=document.getElementById('enemyPillar');
        this.isTop=isTop;
        if(isTop){
            // Bottom edge of top pillar sits at gapY
            this.y = gapY - this.height;
        }else{
            // Top edge of bottom pillar sits at gapY + gapSize
            this.y = gapY + gapSize;
        }
    }
    update(deltaTime){
        super.update(deltaTime);
    }
}