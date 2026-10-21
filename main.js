import{Player} from './player.js';
import{InputHandler} from './input.js';
import{Background} from './background.js';
import{PillarEnemy}from './enemies.js';
import{UI}from './UI.js';


window.addEventListener('load',function(){
    const canvas=document.getElementById('canvas1');
    const ctx= canvas.getContext('2d');
    canvas.width=1000;
    canvas.height=500;

    class Game{
        constructor(width, height){
            this.width=width;
            this.height=height;
            this.groundMargin=80;
            this.speed=0;
            this.maxSpeed=3;
            this.background=new Background(this);
            this.player=new Player(this);
            this.input= new InputHandler(this);
            this.UI=new UI(this);
            this.enemies=[];
            this.enemyTimer=0;
            this.enemyInterval=2200;
            this.debug=false;
            this.score=0;
            this.highestScore=0;
            this.fontColor='black';
            this.gameState='waiting';

        }
        setGameOver(){
            this.gameState = 'gameOver';
            this.speed = 0;
        }
        restart(){
            this.score=0;
            this.enemies=[];
            this.enemyTimer=0;
            this.speed=0;
            this.player.reset();
            this.gameState='playing';
            this.speed=this.maxSpeed;
            this.player.setState(1,1);
        }
        
        update(deltaTime){
            this.background.update();
            //waiting
            if(this.gameState==='waiting'){
                if(this.input.keys.includes('Enter')){
                    this.restart();
                }
                return;
            }
            //GG GameOver
            if(this.gameState==='gameOver'){
                this.speed=0;
                if(this.input.keys.includes('Enter')){
                    this.restart();
                }
                return;
            }
    
            //play State
            this.player.update(this.input.keys,deltaTime);

            //enemies
            if(this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            }else{
                this.enemyTimer += deltaTime;
            }


            //make faster
            const baseSpeed = this.maxSpeed;
            const speedBoost = Math.floor(this.score / 5) * 0.4;  // every 5 points → +0.4 speed
            this.speed = baseSpeed + speedBoost;
            this.enemyInterval = Math.max(900, 2200 - this.score * 30);

            // Update enemies + remove ones that left the screen
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            
        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy=>{
                enemy.draw(context);
            });
            this.UI.draw(context);
        }
        addEnemy(){
            const gapSize = 160;                       // space the player can fly through
            const minGapY = 80;                        // keep gap away from very top
            const maxGapY = this.height - gapSize - 80;// keep gap away from very bottom
            const gapY = Math.random() * (maxGapY - minGapY) + minGapY;

            // Top pillar
            this.enemies.push(new PillarEnemy(this, true, gapY, gapSize));
            // Bottom pillar (same x, same gap)
            this.enemies.push(new PillarEnemy(this, false, gapY, gapSize));

        }
    }

    const game= new Game(canvas.width,canvas.height);
    console.log(game);
    let lastTime=0;

    function animate(timeStamp){
        const deltaTime=timeStamp-lastTime;
        lastTime=timeStamp;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);
});