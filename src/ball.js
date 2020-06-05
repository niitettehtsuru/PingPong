'use strict'; 
/* A ball that is served in a ping pong game
 * -----------------------------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      2nd June, 2020 
 * @email:     calebniitettehaddy@gmail.com 
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/PingPong
 * @codepen:   https://codepen.io/niitettehtsuru/pen/NWqENww
 * @license:   GNU General Public License v3.0
 */
class Ball
{
    constructor(screenWidth,screenHeight)
    {    
        this.id = ~~((Math.random() * 100000000) + 1);
        this.screenWidth = screenWidth;//width of browser window screen
        this.screenHeight = screenHeight;//height of browser window screen 
        this.radius = 5;  
        this.color  = 'black'; 
        this.position = {x:this.screenWidth/2,y:this.screenHeight/2};//starting position of the ball at the center of the screen
        this.unitSpeed = 5;//starting magnitude of a ball's velocity  
        this.speed = {x: Math.random() > 0.5? this.unitSpeed:-this.unitSpeed ,y:Math.random() > 0.5? this.unitSpeed:-this.unitSpeed};   
        this.destination = this.getBallDestination();//where the ball is headed, either to the right, left, top or bottom wall
        //this prevents the ball from getting stuck on a paddle
        this.leftPaddleIsHit = false;//true if ball hits the left paddle, false otherwise
        this.rightPaddleIsHit = false;//true if ball hits the left paddle, false otherwise
        this.topPaddleIsHit = false;//true if ball hits the left paddle, false otherwise
        this.bottomPaddleIsHit = false;//true if ball hits the left paddle, false otherwise
    }  
    getBallDestination()//get where the ball is headed and when it will get there
    { 
        let ballDestination = {team:'left',time:0,pointOfContact:{x:0,y:0}};
        if(this.speed.x > 0 && this.speed.y > 0)//if ball is headed downwards to the right
        {   
            let dy = this.screenHeight - this.position.y - PADDLE_SIZE_MIN;//vertical distance of ball to the top of the bottom paddle
            let dx = this.screenWidth - this.position.x -PADDLE_SIZE_MIN;//horizontal distance of ball to the top of the right paddle
            let timeToTouchBottom = dy/this.speed.y; 
            let timeToTouchRight  = dx/this.speed.x;  
            if(timeToTouchBottom < timeToTouchRight)//if ball will get past the bottom paddle first
            { 
                let x = this.position.x + timeToTouchBottom * this.speed.x;//x coordinate at which ball will get past the bottom paddle
                let pointOfContact = {x:x,y:this.screenHeight-PADDLE_SIZE_MIN};//complete coordinates at which ball will get past the bottom paddle
                ballDestination = {team:'bottom',time:timeToTouchBottom,pointOfContact:pointOfContact}; 
            }
            else //if ball will get past the right paddle first 
            {
                let y = this.position.y + timeToTouchRight * this.speed.y;//y coordinate at which ball will get past the right paddle
                let pointOfContact = {x:this.screenWidth -PADDLE_SIZE_MIN,y:y};//complete coordinates at which ball will get past the right paddle 
                ballDestination = {team:'right',time:timeToTouchRight,pointOfContact:pointOfContact}; 
            }  
        }
        else if(this.speed.x < 0 && this.speed.y > 0)//if ball is headed downwards to the left
        {  
            let dy = this.screenHeight - this.position.y - PADDLE_SIZE_MIN;//vertical distance of ball to the top of the bottom paddle
            let dx = this.position.x - PADDLE_SIZE_MIN;//horizontal distance of ball to the top of the left paddle
            let timeToTouchBottom = dy/this.speed.y; 
            let timeToTouchLeft  = Math.abs(dx/this.speed.x); 
            if(timeToTouchBottom < timeToTouchLeft)//if ball will get past the bottom paddle first
            {
                let x = this.position.x - timeToTouchBottom * Math.abs(this.speed.x);//x coordinate at which ball will get past the bottom paddle
                let pointOfContact = {x:x,y:this.screenHeight-PADDLE_SIZE_MIN};//complete coordinates at which ball will get past the bottom paddle  
                ballDestination = {team:'bottom',time:timeToTouchBottom,pointOfContact:pointOfContact}; 
            }
            else//if ball will get past the left paddle first 
            {
                let y = this.position.y + timeToTouchLeft * this.speed.y;//y coordinate at which ball will get past the left paddle
                let pointOfContact = {x:PADDLE_SIZE_MIN,y:y};//complete coordinates at which ball will get past the left paddle 
                ballDestination = {team:'left',time:timeToTouchLeft,pointOfContact:pointOfContact}; 
            } 
        }
        else if(this.speed.x > 0 && this.speed.y < 0)//if ball is headed upwards to the right
        { 
            let dy = this.position.y - PADDLE_SIZE_MIN;//vertical distance of ball to the bottom of the top paddle
            let dx = this.screenWidth - this.position.x - PADDLE_SIZE_MIN;//horizontal distance of ball to the top of the right paddle
            let timeToTouchTop = Math.abs(dy/this.speed.y); 
            let timeToTouchRight  = dx/this.speed.x; 
            if(timeToTouchTop < timeToTouchRight)//if ball will get past the top paddle first
            {
                let x = this.position.x + timeToTouchTop * this.speed.x;//x coordinate at which ball will get past the top 
                let pointOfContact = {x:x,y:PADDLE_SIZE_MIN};//complete coordinates at which ball will get past the top paddle 
                ballDestination = {team:'top',time:timeToTouchTop,pointOfContact:pointOfContact}; 
            }
            else//if it will get past the right paddle first 
            {
                let y = this.position.y - timeToTouchRight * Math.abs(this.speed.y);//y coordinate at which ball will get past a right paddle
                let pointOfContact = {x:this.screenWidth - PADDLE_SIZE_MIN,y:y};//complete coordinates at which ball will get past a right paddle 
                ballDestination = {team:'right',time:timeToTouchRight,pointOfContact:pointOfContact}; 
            }  
        }
        else if(this.speed.x < 0 && this.speed.y < 0)//if ball is headed upwards to the left
        { 
            let dy = this.position.y - PADDLE_SIZE_MIN;//vertical distance of ball to the bottom of the top paddle
            let dx = this.position.x - PADDLE_SIZE_MIN;//horizontal distance of ball to the top of the left paddle
            let timeToTouchTop  = Math.abs(dy/this.speed.y); 
            let timeToTouchLeft = Math.abs(dx/this.speed.x); 
            if(timeToTouchTop < timeToTouchLeft)//if ball will get past the top paddle first
            {
                let x = this.position.x - timeToTouchTop * Math.abs(this.speed.x);//x coordinate at which ball will get past the top paddle
                let pointOfContact = {x:x,y:PADDLE_SIZE_MIN};//complete coordinates at which ball will get past the top paddle 
                ballDestination = {team:'top',time:timeToTouchTop,pointOfContact:pointOfContact}; 
            }
            else //if it will get past the left paddle first 
            {
                let y = this.position.y - timeToTouchLeft * Math.abs(this.speed.y);//y coordinate at which ball will get past the left paddle
                let pointOfContact = {x:PADDLE_SIZE_MIN,y:y}; //complete coordinates at which ball will get past the left paddle 
                ballDestination = {team:'left',time:timeToTouchLeft,pointOfContact:pointOfContact}; 
            }
        }
        return ballDestination;
    } 
    getId()
    {
        return this.id; 
    }
    getBallData() //returns geometric dimensions of the ball
    {
        return {x:this.position.x, y:this.position.y, radius:this.radius};
    }
    getDestination() 
    {
        return this.destination;
    } 
    resize(screenHeight,screenWidth)//let the ball be responsive to the resizing of the window
    { 
        let dy = screenHeight/this.screenHeight;//percentage change in browser window height 
        let dx = screenWidth/this.screenWidth;//percentage change in browser window width  
        this.screenHeight = screenHeight;  
        this.screenWidth  = screenWidth; 
        this.position.y *= dy;
        this.position.x *= dx; 
    }
    adjustSpeed()//set a maximum and minimum speed restriction for the ball
    {
        if(this.speed.x > 0)
        {
            if(this.speed.x > this.unitSpeed + 0.5)
            {
                this.speed.x = this.unitSpeed + 0.5;
            }
            if(this.speed.x < this.unitSpeed - 1)
            {
                this.speed.x = this.unitSpeed - 1;
            }
        }
        if(this.speed.x < 0)
        {
            if(this.speed.x < -(this.unitSpeed + 0.5))
            {
                this.speed.x = -(this.unitSpeed + 0.5);
            } 
            if(this.speed.x > -this.unitSpeed + 1)
            {
                this.speed.x = -this.unitSpeed + 1;
            }
        }
        
        if(this.speed.y > 0)
        {
            if(this.speed.y > this.unitSpeed + 0.5)
            {
                this.speed.y = this.unitSpeed + 0.5;
            }
            if(this.speed.y < this.unitSpeed - 1)
            {
                this.speed.y = this.unitSpeed - 1;
            }
        }
        if(this.speed.y < 0)
        {
            if(this.speed.y < -(this.unitSpeed + 0.5))
            {
                this.speed.y = -(this.unitSpeed + 0.5);
            } 
            if(this.speed.y > -this.unitSpeed + 1)
            {
                this.speed.y = -this.unitSpeed + 1;
            }
        } 
    }
    paddleIsTouched(paddle)//true if ball has touched a paddle, false otherwise
    { 
        //Find the vertical & horizontal (distX/distY) distances between the ball’s center and the paddle’s center
        let distX = Math.abs(this.position.x - paddle.x - paddle.width/2);
        let distY = Math.abs(this.position.y - paddle.y - paddle.height/2); 
        //If the distance is greater than halfBall + halfPaddle, then they are too far apart to be colliding
        if (distX > (paddle.width/2 + this.radius)) 
        { 
            return false; 
        }
        if (distY > (paddle.height/2 + this.radius)) 
        { 
            return false; 
        } 
        //If the distance is less than halfPaddle then they are definitely colliding
        if (distX <= (paddle.width/2)) 
        { 
            return true; 
        } 
        if (distY <= (paddle.height/2)) 
        { 
            return true; 
        }
        //test for collision at the paddle corner
        //Think of a line from the paddle center to any paddle corner. Now extend that line by the radius of the ball.
        //If the ball’s center is on that line they are colliding at exactly that paddle corner.
        //Using Pythagoras formula to compare the distance between ball and paddle centers.
        let dx=distX-paddle.width/2;
        let dy=distY-paddle.height/2;
        return (dx*dx+dy*dy<=(this.radius*this.radius));
    }  
    draw(ctx)
    {
        //draw the ball
        ctx.beginPath(); 
        ctx.arc(this.position.x,this.position.y,this.radius,0,2*Math.PI);
        ctx.fillStyle = this.color; 
        ctx.fill(); 
        ctx.strokeStyle = this.color;
        ctx.stroke();  
    }
    update(deltaTime,paddles)
    {   
        if(this.leftPaddleIsHit)
        {
            this.position.x = this.radius + PADDLE_SIZE_MIN+1;//move slightly away from left paddle
        }
        if(this.rightPaddleIsHit)
        {
            this.position.x = this.screenWidth - PADDLE_SIZE_MIN -1 - this.radius;//move slightly away from right paddle
        }
        if(this.topPaddleIsHit)
        {
            this.position.y = this.radius + PADDLE_SIZE_MIN+1;//move slightly away from the top paddle
        }
        if(this.bottomPaddleIsHit)
        {
            this.position.y = this.screenHeight - PADDLE_SIZE_MIN- 1 - this.radius;//move slightly away from the bottom paddle
        }
        //reset
        this.leftPaddleIsHit = false; 
        this.rightPaddleIsHit = false; 
        this.topPaddleIsHit = false; 
        this.bottomPaddleIsHit = false; 
        
        //keep the ball moving in its current direction  
        this.position.x += this.speed.x; 
        this.position.y += this.speed.y; 
        //check collision with a paddle
        let collidedWithPaddle = false; 
        for(let i = 0;i < paddles.length; i++) 
        {
            let paddle = paddles[i];
            collidedWithPaddle = this.paddleIsTouched(paddle.getPaddleData());
            if(collidedWithPaddle)//if ball has collided with a paddle
            {    
                switch(paddle.getTeam())
                {
                    case 'left'://if ball collided with a paddle on the left wall
                        this.speed.x = -this.speed.x;//move right
                        this.speed.y = Math.random() > 0.5? -this.speed.y: this.speed.y ;//flip a coin to move either up or down 
                        this.leftPaddleIsHit = true;  
                        break; 
                    case 'right'://if ball collided with a paddle on the right wall
                        this.speed.x = -this.speed.x;//move left
                        this.speed.y = Math.random() > 0.5? -this.speed.y: this.speed.y ;//flip a coin to move either up or down 
                        this.rightPaddleIsHit = true;  
                        break; 
                    case 'top'://if ball collided with a paddle on the top wall
                        this.speed.y = -this.speed.y;//move down 
                        this.speed.x = Math.random() > 0.5? -this.speed.x: this.speed.x ;//flip a coin to move either left or right 
                        this.topPaddleIsHit = true; 
                        
                        break; 
                    case 'bottom'://if ball collided with a paddle on the bottom wall
                        this.speed.y = -this.speed.y;//move up 
                        this.speed.x = Math.random() > 0.5? -this.speed.x: this.speed.x ;//flip a coin to move either left or right 
                        this.bottomPaddleIsHit = true; 
                        break; 
                } 
                //slightly change the angle of movement in the current direction
                this.speed.x += Math.random() > 0.5? Math.random() : -Math.random(); 
                this.speed.y += Math.random() > 0.5? Math.random() : -Math.random(); 
                this.adjustSpeed();
                break; //ball can't collide with more than 1 paddle at a time
            }
        } 
        if(!collidedWithPaddle)//if there's NO collision with the paddle
        {
            //check collision with wall
            if(this.position.x - this.radius < 0 )//ball touches the left wall  
            { 
                //update the number of goals conceded by the left team
                let goalsConceded  = +`${document.getElementById('leftTeam').innerHTML}` ; 
                document.getElementById('leftTeam').innerHTML =`${goalsConceded+1}`;  
                this.speed.x = -this.speed.x;//move right 
                this.speed.y = Math.random() > 0.5? -this.speed.y: this.speed.y ;//flip a coin to move either up or down   
                
            }    
            if(this.position.x + this.radius> this.screenWidth)//ball touches the right wall 
            { 
                //update the number of goals conceded by the right team
                let goalsConceded  = +`${document.getElementById('rightTeam').innerHTML}` ; 
                document.getElementById('rightTeam').innerHTML =`${goalsConceded+1}`;
                this.speed.x = -this.speed.x;//move left
                this.speed.y = Math.random() > 0.5? -this.speed.y: this.speed.y ;//flip a coin to move either up or down 
                 
            }    
            if(this.position.y - this.radius < 0)//ball touches the top of the wall  
            { 
                //update the number of goals conceded by the top team
                let goalsConceded  = +`${document.getElementById('topTeam').innerHTML}` ; 
                document.getElementById('topTeam').innerHTML =`${goalsConceded+1}`;
                this.speed.y = -this.speed.y;//move down
                this.speed.x = Math.random() > 0.5? -this.speed.x: this.speed.x ;//flip a coin to move either left or right  
            }  
            if(this.position.y + this.radius > this.screenHeight)//ball touches the bottom of the wall 
            {
                //update the number of goals conceded bottom team 
                let goalsConceded  = +`${document.getElementById('bottomTeam').innerHTML}` ; 
                document.getElementById('bottomTeam').innerHTML =`${goalsConceded+1}`; 
                this.speed.y = -this.speed.y;//move up 
                this.speed.x = Math.random() > 0.5? -this.speed.x: this.speed.x ;//flip a coin to move either left or right  
            } 
        } 
        //update where the ball is headed and when it will get there
        this.destination = this.getBallDestination();
    }  
}