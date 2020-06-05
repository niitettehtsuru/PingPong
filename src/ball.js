'use strict'; 
class Ball
{
    constructor(screenWidth,screenHeight)
    {    
        this.id = ~~((Math.random() * 100000000) + 1);
        this.screenWidth = screenWidth;//width of browser window screen
        this.screenHeight = screenHeight;//height of browser window screen 
        this.radius = 2;  
        this.color  = 'white'; 
        this.position = {x:this.screenWidth/2,y:this.screenHeight/2};//the center of the screen
        this.maxSpeed = 10; 
        this.speed = {x: Math.random() > 0.5? 2:-2 ,y:Math.random() > 0.5? 2:-2};   
        this.destination = this.getBallDestination();//where the ball is headed, either to the right, left, top or bottom wall
    }  
    draw(ctx)
    {
        ctx.beginPath(); 
        ctx.arc(this.position.x,this.position.y,this.radius,0,2*Math.PI);
        ctx.fillStyle = this.color; 
        ctx.fill(); 
        ctx.strokeStyle = this.color;
        ctx.stroke(); 
    }
    getId()
    {
        return this.id; 
    }
    getBallData() 
    {
        return {x:this.position.x, y:this.position.y, radius:this.radius};
    }
    getDestination() 
    {
        return this.destination;
    }
    getBallDestination()
    { 
        let ballDestination = {team:'left',time:0,pointOfContact:{x:0,y:0}};
        if(this.speed.x > 0 && this.speed.y > 0)//if ball is headed downwards to the right
        {   
            let dy = this.screenHeight - this.position.y - 20;//vertical distance of ball to the top of the bottom paddle
            let dx = this.screenWidth - this.position.x -20;//horizontal distance of ball to the top of the right paddle
            let timeToTouchBottom = dy/this.speed.y; 
            let timeToTouchRight  = dx/this.speed.x;  
            if(timeToTouchBottom < timeToTouchRight)//if it will touch the bottom paddle first
            { 
                let x = this.position.x + timeToTouchBottom * this.speed.x;//x coordinate at which ball will touch the bottom 
                let pointOfContact = {x:x,y:this.screenHeight-20}; 
                ballDestination = {team:'bottom',time:timeToTouchBottom,pointOfContact:pointOfContact}; 
            }
            else //if it will touch the right paddle first 
            {
                let y = this.position.y + timeToTouchRight * this.speed.y;//y coordinate at which ball will touch the right wall
                let pointOfContact = {x:this.screenWidth -20,y:y}; 
                ballDestination = {team:'right',time:timeToTouchRight,pointOfContact:pointOfContact}; 
            }  
        }
        else if(this.speed.x < 0 && this.speed.y > 0)//if ball is headed downwards to the left
        {  
            let dy = this.screenHeight - this.position.y - 20;//vertical distance of ball to the top of the bottom paddle
            let dx = this.position.x - 20;//horizontal distance of ball to the top of the left paddle
            let timeToTouchBottom = dy/this.speed.y; 
            let timeToTouchLeft  = Math.abs(dx/this.speed.x); 
            if(timeToTouchBottom < timeToTouchLeft)//if it will touch the bottom paddle first
            {
                let x = this.position.x - timeToTouchBottom * Math.abs(this.speed.x);//x coordinate at which ball will touch the bottom 
                let pointOfContact = {x:x,y:this.screenHeight-20};  
                ballDestination = {team:'bottom',time:timeToTouchBottom,pointOfContact:pointOfContact}; 
            }
            else//if it will touch the left paddle first 
            {
                let y = this.position.y + timeToTouchLeft * this.speed.y;//y coordinate at which ball will touch the left wall
                let pointOfContact = {x:20,y:y}; 
                ballDestination = {team:'left',time:timeToTouchLeft,pointOfContact:pointOfContact}; 
            } 
        }
        else if(this.speed.x > 0 && this.speed.y < 0)//if ball is headed upwards to the right
        { 
            let dy = this.position.y - 20;//vertical distance of ball to the bottom of the top paddle
            let dx = this.screenWidth - this.position.x - 20;//horizontal distance of ball to the top of the right paddle
            let timeToTouchTop = Math.abs(dy/this.speed.y); 
            let timeToTouchRight  = dx/this.speed.x; 
            if(timeToTouchTop < timeToTouchRight)//if it will touch the top paddle first
            {
                let x = this.position.x + timeToTouchTop * this.speed.x;//x coordinate at which ball will touch the top 
                let pointOfContact = {x:x,y:20};  
                ballDestination = {team:'top',time:timeToTouchTop,pointOfContact:pointOfContact}; 
            }
            else//if it will touch the right paddle first 
            {
                let y = this.position.y - timeToTouchRight * Math.abs(this.speed.y);//y coordinate at which ball will touch the right wall
                let pointOfContact = {x:this.screenWidth - 20,y:y}; 
                ballDestination = {team:'right',time:timeToTouchRight,pointOfContact:pointOfContact}; 
            }  
        }
        else if(this.speed.x < 0 && this.speed.y < 0)//if ball is headed upwards to the left
        { 
            let dy = this.position.y - 20;//vertical distance of ball to the bottom of the top paddle
            let dx = this.position.x - 20;//horizontal distance of ball to the top of the left paddle
            let timeToTouchTop  = Math.abs(dy/this.speed.y); 
            let timeToTouchLeft = Math.abs(dx/this.speed.x); 
            if(timeToTouchTop < timeToTouchLeft)//if it will touch the top paddle first
            {
                let x = this.position.x - timeToTouchTop * Math.abs(this.speed.x);//x coordinate at which ball will touch the top 
                let pointOfContact = {x:x,y:20};
                ballDestination = {team:'top',time:timeToTouchTop,pointOfContact:pointOfContact}; 
            }
            else //if it will touch the right paddle first 
            {
                let y = this.position.y - timeToTouchLeft * Math.abs(this.speed.y);//y coordinate at which ball will touch the left wall
                let pointOfContact = {x:20,y:y}; 
                ballDestination = {team:'left',time:timeToTouchLeft,pointOfContact:pointOfContact}; 
            }
        }
        return ballDestination;
    } 
    resize(screenHeight,screenWidth)
    { 
        let dy              = screenHeight/this.screenHeight;//percentage change in browser window height 
        let dx              = screenWidth/this.screenWidth;//percentage change in browser window width  
        this.screenHeight   = screenHeight;  
        this.screenWidth    = screenWidth; 
    }
    update(deltaTime,paddles)
    {   
        //keep the ball moving in its current direction  
        this.position.x += this.speed.x; 
        this.position.y += this.speed.y; 
        //check collision with paddle
        let collidedWithPaddle = false; 
        for(let i = 0;i < paddles.length; i++) 
        {
            let paddle = paddles[i];
            collidedWithPaddle = this.collisionDetected(paddle.getPaddleData());
            if(collidedWithPaddle)
            {    
                switch(paddle.getTeam())
                {
                    case 'left':
                        this.speed.x = -this.speed.x;//move in the opposite horizontal direction 
                        this.speed.y = Math.random() > 0.5? -this.speed.y: this.speed.y ;//flip a coin to move either up or down 
                        //this.position.x = 25; //move slightly away from left paddle
                        break; 
                    case 'right': 
                        this.speed.x = -this.speed.x;//move in the opposite horizontal direction 
                        this.speed.y = Math.random() > 0.5? -this.speed.y: this.speed.y ;//flip a coin to move either up or down 
                        //this.position.x = this.screenWidth - 25; //move slightly away from right paddle
                        break; 
                    case 'top': 
                        this.speed.y = -this.speed.y;//move in the opposite vertical direction 
                        this.speed.x = Math.random() > 0.5? -this.speed.x: this.speed.x ;//flip a coin to move either left or right 
                        //this.position.y = 25; //move slightly away from top paddle
                        break; 
                    case 'bottom':
                        this.speed.y = -this.speed.y;//move in the opposite vertical direction 
                        this.speed.x = Math.random() > 0.5? -this.speed.x: this.speed.x ;//flip a coin to move either left or right 
                        //this.position.y = this.screenHeight - 25; //move slightly away from bottom paddle
                        break; 
                } 
                //slightly change the angle of movement in the current direction
                this.speed.x += Math.random() > 0.5? Math.random() : -Math.random(); 
                this.speed.y += Math.random() > 0.5? Math.random() : -Math.random(); 
                if(this.speed.x > 2.5)
                {
                    this.speed.x = 2.5;
                }
                if(this.speed.x < -2.5)
                {
                    this.speed.x = -2.5;
                }
                if(this.speed.y > 2.5)
                {
                    this.speed.y = 2.5;
                }
                if(this.speed.y < -2.5)
                {
                    this.speed.y = -2.5;
                }
                break; //ball can't collide with more than 1 paddle at a time
            }
        } 
        if(!collidedWithPaddle)//if there's no collision with the paddle
        {
           //check collision with wall
            if//ball touches the left wall or ball touches the right wall
            (this.position.x - this.radius < 0 || this.position.x + this.radius> this.screenWidth)
            {
                this.speed.x = -this.speed.x;//move in the opposite horizontal direction 
                this.speed.y = Math.random() > 0.5? -this.speed.y: this.speed.y ;//flip a coin to move either up or down 
                 
            }    
            if//ball touches the top of the wall or ball touches the bottom of the wall
            (this.position.y - this.radius < 0 || this.position.y + this.radius > this.screenHeight) 
            {
                this.speed.y = -this.speed.y;//move in the opposite vertical direction 
                this.speed.x = Math.random() > 0.5? -this.speed.x: this.speed.x ;//flip a coin to move either left or right 
                 
            }  
        } 
        this.destination = this.getBallDestination();
    }  
    collisionDetected(paddle)//ball has collided with paddle
    { 
        //Find the vertical & horizontal (distX/distY) distances between the ball’s center and the paddle’s center
        let distX = Math.abs(this.position.x - paddle.x - paddle.width/2);
        let distY = Math.abs(this.position.y - paddle.y - paddle.height/2); 
        //If the distance is greater than halfCircle + halfRect, then they are too far apart to be colliding
        if (distX > (paddle.width/2 + this.radius)) 
        { 
            return false; 
        }
        if (distY > (paddle.height/2 + this.radius)) 
        { 
            return false; 
        } 
        //If the distance is less than halfRect then they are definitely colliding
        if (distX <= (paddle.width/2)) 
        { 
            return true; 
        } 
        if (distY <= (paddle.height/2)) 
        { 
            return true; 
        }
        //test for collision at the paddle corner
        /* Think of a line from the paddle center to any paddle corner. Now extend that line by the radius of the ball.
            If the ball’s center is on that line they are colliding at exactly that paddle corner.*/
        //Using Pythagoras formula to compare the distance between ball and paddle centers.
        let dx=distX-paddle.width/2;
        let dy=distY-paddle.height/2;
        return (dx*dx+dy*dy<=(this.radius*this.radius));
    }  
}