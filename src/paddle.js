class Paddle
{
    constructor(screenWidth,screenHeight,team)
    {       
        this.screenWidth = screenWidth;//width of browser window screen
        this.screenHeight= screenHeight;//height of browser window screen  
        this.width       = 150; 
        this.height      = 20;
        this.team        = team;//type of team, whether left, right, top or bottom
        this.setInitialWidthAndHeight(this.team); 
        this.position    = this.setCenterPosition(this.team); 
        this.maxSpeed    = 10; 
        //this.speed       = 0; 
        this.speed       = this.setInitialSpeed(this.team);//{x: Math.random() > 0.5? 2:-2 ,y:Math.random() > 0.5? 2:-2};   
        this.color       = 'maroon';    
        this.lockedOnTarget    = false; //true if paddle has a ball target, false otherwise
        this.lockedBall = new Ball(this.screenWidth,this.screenHeight);
    }  
    getPaddleData() 
    {
        return {x:this.position.x,y:this.position.y,width:this.width,height:this.height};
    }
    getTeam()
    {
        return this.team; 
    }
    setInitialSpeed(team) 
    { 
        let speed = {x:0,y:0};   
        switch(team)
        {
            case 'left'://if paddle is on the left or right wall  
            case 'right': 
                speed = {x:0,y:3};//it will move only vertically 
                break; 
            case 'top'://if paddle is on the top or bottom wall  
            case 'bottom':
                speed = {x:3,y:0};//it will move only horizontally
                break; 
        }
        return speed; 
    }
    setInitialWidthAndHeight(team) 
    {
        switch(team)
        {
            case 'left'://if paddle is on the left or right wall  
            case 'right': 
                this.width  = 20; 
                this.height = 150;
                break; 
            case 'top'://if paddle is on the top or bottom wall  
            case 'bottom': 
                this.width  = 150; 
                this.height = 20; 
                break; 
        }
    }
    setCenterPosition(team) 
    {
        let position = {x:0,y:0};
        switch(team)
        {
            case 'left': 
                position.x = 0;//at the very left of the screen
                position.y = this.screenHeight/2 - this.height/2;//at the middle of the screen
                break; 
            case 'right': 
                position.x = this.screenWidth - this.width;//at the very right of the screen
                position.y = this.screenHeight/2 - this.height/2;//at the middle of the screen
                break; 
            case 'top': 
                position.x = this.screenWidth/2 - this.width/2;//at the middle of the screen
                position.y = 0;//at the very top of the screen
                break; 
            case 'bottom': 
                position.x = this.screenWidth/2 - this.width/2;//at the middle of the screen
                position.y = this.screenHeight - this.height;//at the very bottom of the screen
                break; 
        }
        return position;  
    } 
    resize(screenHeight,screenWidth)
    { 
        let dy              = screenHeight/this.screenHeight;//percentage change in browser window height 
        let dx              = screenWidth/this.screenWidth;//percentage change in browser window width  
        this.screenHeight   = screenHeight;  
        this.screenWidth    = screenWidth; 
        let position = this.position;
         
        //adjust the height
        position.y *= dy; 
        this.height*=dy;
        if(this.height > 150)
        {
            this.height = 150; 
        }
        //adjust the width
        position.x *= dx;
        this.width*=dx;
        if(this.width > 150)
        {
            this.width = 150; 
        }  
         
        /*
        switch(this.team)
        {
            case 'left': 
                position.x = 0;//at the very left of the screen
                //adjust the height
                position.y *= dy; 
                this.height*=dy;
                if(this.height > 150)
                {
                    this.height = 150; 
                }
                break; 
            case 'right': 
                position.x = this.screenWidth - this.width;//at the very right of the screen 
                //adjust the height
                position.y *= dy; 
                this.height*=dy;
                if(this.height > 150)
                {
                    this.height = 150; 
                }
                break; 
            case 'top': 
                //adjust the width
                position.x *= dx;
                this.width*=dx;
                if(this.width > 150)
                {
                    this.width = 150; 
                } 
                position.y = 0;//at the very top of the screen
                break; 
            case 'bottom':  
                //adjust the width
                position.x *= dx;
                this.width*=dx;
                if(this.width > 150)
                {
                    this.width = 150; 
                } 
                position.y = this.screenHeight - this.height;//at the very bottom of the screen
                break; 
        }
        */
        this.position = position;  
    }
    draw(ctx)
    {
        ctx.beginPath();
        ctx.rect(this.position.x,this.position.y,this.width,this.height);  
        ctx.fillStyle   = this.color;
        ctx.fill(); 
    } 
    getTimeToCatchBall(ball) 
    {
        let timeToCatchBall = 0; 
        //ballDestination = {team:'bottom',time:timeToTouchBottom,pointOfContact:pointOfContact};
        let pointOfContact = ball.getDestination().pointOfContact; 
        switch(ball.getDestination().team)
        {
            case 'left'://if paddle is on the left wall  
                //if paddle is positioned to receive the ball
                if(this.position.y <  pointOfContact.y && this.position.y + this.height > pointOfContact.y)
                {}
                else //if paddle is NOT positioned to receive the ball
                {
                    //if paddle is above point of contact 
                    if(this.position.y + this.height < pointOfContact.y)
                    {
                        let dy = pointOfContact.y - (this.position.y + this.height);//distance from paddle to point
                        timeToCatchBall = dy/this.speed.y; 
                    }
                    //if paddle is below point of contact
                    if(this.position.y > pointOfContact.y)
                    {
                        let dy = this.position.y - pointOfContact.y;//distance from paddle to point
                        timeToCatchBall = dy/this.speed.y;  
                    } 
                } 
                break; 
            case 'right'://if paddle is on the right wall  
                //if paddle is positioned to receive the ball
                if(this.position.y <  pointOfContact.y && this.position.y + this.height > pointOfContact.y)
                {}
                else 
                {
                    //if paddle is above point of contact 
                    if(this.position.y + this.height < pointOfContact.y)
                    {
                        let dy = pointOfContact.y - (this.position.y + this.height);//distance from paddle to point
                        timeToCatchBall = dy/this.speed.y; 
                    }
                    //if paddle is below point of contact
                    if(this.position.y > pointOfContact.y)
                    { 
                        let dy = this.position.y - pointOfContact.y;//distance from paddle to point
                        timeToCatchBall = dy/this.speed.y;  
                    } 
                } 
                break; 
            case 'top'://if paddle is on the top wall  
                //if paddle is positioned to receive the ball
                if(this.position.x <  pointOfContact.x && this.position.x + this.width > pointOfContact.x)
                {}
                else 
                { 
                    if(this.position.x + this.width < pointOfContact.x)//if paddle is to the left of the point of contact 
                    {
                        let dx = pointOfContact.x - (this.position.x + this.width);//distance from paddle to point
                        timeToCatchBall = dx/this.speed.x;   
                    } 
                    if(this.position.x > pointOfContact.x)//if paddle is to the right of the point of contact
                    { 
                        let dx = this.position.x - pointOfContact.x;//distance from paddle to point
                        timeToCatchBall = dx/this.speed.x; 
                    } 
                }
            case 'bottom'://if paddle is on the bottom wall  
                //if paddle is positioned to receive the ball
                if(this.position.x <  pointOfContact.x && this.position.x + this.width > pointOfContact.x)
                {}
                else 
                { 
                    if(this.position.x + this.width < pointOfContact.x)//if paddle is to the left of the point of contact 
                    {
                        let dx = pointOfContact.x - (this.position.x + this.width);//distance from paddle to point
                        timeToCatchBall = dx/this.speed.x;   
                    } 
                    if(this.position.x > pointOfContact.x)//if paddle is to the right of the point of contact
                    { 
                        let dx = this.position.x - pointOfContact.x;//distance from paddle to point
                        timeToCatchBall = dx/this.speed.x; 
                    } 
                }
                break; 
        }
        return timeToCatchBall; 
    }
    
    //shift paddle to receive ball in the middle, estimate if it is  possible to catch the ball at the current speed.
            
    update(deltaTime,balls)
    {    
        if(!this.lockedOnTarget)//if paddle is not locked on a ball,seek a ball to lock
        {
            let team = this.team;
            let qualifiedBalls = balls.filter(function (ball)//get all the balls headed for this paddle
            {
                return ball.getDestination().team === team;
            });
            if(qualifiedBalls.length > 0)//if there are balls headed for this paddle
            { 
                let fastestTime = 10000;  
                for(let i = 0; i < qualifiedBalls.length; i++)
                {
                    let qualifiedBall = qualifiedBalls[i];
                    let eta = qualifiedBall.getDestination().time;//estimated time of arrival 
                    let timeToCatchBall = this.getTimeToCatchBall(qualifiedBall);
                    if(eta < fastestTime && timeToCatchBall <= eta/*if the ball can be caught*/)
                    {
                        fastestTime = eta; 
                        this.lockedBall = qualifiedBall;  
                        this.lockedOnTarget = true;
                    } 
                }
                /*
                let lockedBall = qualifiedBalls.reduce(function(a, e, i) 
                { 
                    let eta = e.getDestination().time;//estimated time of arrival 
                    let timeToCatchBall = this.getTimeToCatchBall(e); 
                    if(eta < fastestTime && timeToCatchBall < eta)
                    {
                        fastestTime = eta; 
                        a.shift();
                        a.push(e); 
                    }  
                    return a;
                }, []);
                if (lockedBall.length > 0)//if we have the closest ball
                {
                    this.lockedOnTarget = true; 
                    this.lockedBall = lockedBall[0]; 
                } 
                */
            }
        }
        
        if(this.lockedOnTarget)//if paddle is locked on a ball,move paddle to receive the ball
        {
            let pointOfContact = this.lockedBall.getDestination().pointOfContact; 
            switch(this.team)//move paddle to receive the ball
            {
                case 'left':
                    //if paddle is positioned to receive the ball
                    if(this.position.y <  pointOfContact.y && this.position.y + this.height > pointOfContact.y)
                    { 
                        if
                        (
                            this.position.y + this.height/2 < pointOfContact.y && //if the center of the paddle is above the point of contact
                            this.position.y + this.height < this.screenHeight//and bottom of paddle is not beyond the bottom of the canvas
                        )
                        {
                            this.position.y += this.speed.y;//move the paddle down 
                        }  
                        if
                        (
                            this.position.y + this.height/2 > pointOfContact.y && //if the center of the paddle is below the point of contact
                            this.position.y > 0 //and the top of paddle is NOT beyond the top of the canvas
                        )
                        {
                            this.position.y -= this.speed.y;//move the paddle up 
                        } 
                    }
                    else //if paddle is NOT positioned to receive the ball
                    {
                        //if paddle is above point of contact 
                        if(this.position.y + this.height < pointOfContact.y)
                        {
                            this.position.y += this.speed.y;//move the paddle down
                            if(this.position.y + this.height > this.screenHeight)//if bottom of paddle is going beyond the bottom of the canvas
                            {
                                this.position.y = this.screenHeight - this.height;//adjust the position
                            } 
                        }
                        //if paddle is below point of contact
                        if(this.position.y > pointOfContact.y)
                        { 
                            this.position.y -= this.speed.y;//move the paddle up 
                            if(this.position.y < 0)//if top of paddle is going beyond the top of the canvas
                            {
                                this.position.y = 0;//adjust the position
                            }
                        } 
                    } 
                    break;
                case 'right': 
                    //if paddle is positioned to receive the ball
                    if(this.position.y <  pointOfContact.y && this.position.y + this.height > pointOfContact.y)
                    {
                        if
                        (
                            this.position.y + this.height/2 < pointOfContact.y && //if the center of the paddle is above the point of contact
                            this.position.y + this.height < this.screenHeight//and bottom of paddle is not beyond the bottom of the canvas
                        )
                        {
                            this.position.y += this.speed.y;//move the paddle down 
                        }  
                        if
                        (
                            this.position.y + this.height/2 > pointOfContact.y && //if the center of the paddle is below the point of contact
                            this.position.y > 0 //and the top of paddle is NOT beyond the top of the canvas
                        )
                        {
                            this.position.y -= this.speed.y;//move the paddle up 
                        } 
                    }
                    else 
                    {
                        //if paddle is above point of contact 
                        if(this.position.y + this.height < pointOfContact.y)
                        {
                            this.position.y += this.speed.y;//move the paddle down
                            if(this.position.y + this.height > this.screenHeight)//if bottom of paddle is going beyond the bottom of the canvas
                            {
                                this.position.y = this.screenHeight - this.height;//adjust the position
                            } 
                        }
                        //if paddle is below point of contact
                        if(this.position.y > pointOfContact.y)
                        { 
                            this.position.y -= this.speed.y;//move the paddle up 
                            if(this.position.y < 0)//if top of paddle is going beyond the top of the canvas
                            {
                                this.position.y = 0;//adjust the position
                            }
                        } 
                    } 
                    break;  
                case 'top':
                    //if paddle is positioned to receive the ball
                    if(this.position.x <  pointOfContact.x && this.position.x + this.width > pointOfContact.x)
                    { 
                        if
                        (
                            this.position.x + this.width/2 < pointOfContact.x && //if the center of the paddle is to the left of the ball,
                            this.position.x + this.width < this.screenWidth//and the right edge of paddle is NOT beyond the right edge of the canvas
                        ) 
                        {
                            this.position.x += this.speed.x;//move the paddle to the right       
                        }  
                        if
                        (
                            this.position.x + this.width/2 > pointOfContact.x && //if the center of the paddle is to the right of the ball,
                            this.position.x > 0//and the left edge of paddle is NOT beyond the left edge of the canvas
                        ) 
                        {
                            this.position.x -= this.speed.x;//move the paddle to the left       
                        } 
                    }
                    else 
                    { 
                        if(this.position.x + this.width < pointOfContact.x)//if paddle is to the left of the point of contact 
                        {
                            this.position.x += this.speed.x;//move the paddle to the right
                            if(this.position.x + this.width > this.screenWidth)//if right of paddle is going beyond the right edge of the canvas
                            {
                                this.position.x = this.screenWidth - this.width;//adjust
                            }
                        } 
                        if(this.position.x > pointOfContact.x)//if paddle is to the right of the point of contact
                        { 
                            this.position.x -= this.speed.x;//move the paddle to the left
                            if(this.position.x < 0)//if left of paddle is going beyond the left edge of the canvas
                            {
                                this.position.x = this.screenWidth;//adjust
                            }
                        } 
                    }
                    break; 
                case 'bottom':
                    //if paddle is positioned to receive the ball
                    if(this.position.x <  pointOfContact.x && this.position.x + this.width > pointOfContact.x)
                    {
                        if
                        (
                            this.position.x + this.width/2 < pointOfContact.x && //if the center of the paddle is to the left of the ball,
                            this.position.x + this.width < this.screenWidth//and the right edge of paddle is NOT beyond the right edge of the canvas
                        ) 
                        {
                            this.position.x += this.speed.x;//move the paddle to the right       
                        }  
                        if
                        (
                            this.position.x + this.width/2 > pointOfContact.x && //if the center of the paddle is to the right of the ball,
                            this.position.x > 0//and the left edge of paddle is NOT beyond the left edge of the canvas
                        ) 
                        {
                            this.position.x -= this.speed.x;//move the paddle to the left       
                        } 
                    }
                    else 
                    { 
                        if(this.position.x + this.width < pointOfContact.x)//if paddle is to the left of the point of contact 
                        {
                            this.position.x += this.speed.x;//move the paddle to the right
                            if(this.position.x + this.width > this.screenWidth)//if right of paddle is going beyond the right edge of the canvas
                            {
                                this.position.x = this.screenWidth - this.width;//adjust
                            }
                        } 
                        if(this.position.x > pointOfContact.x)//if paddle is to the right of the point of contact
                        { 
                            this.position.x -= this.speed.x;//move the paddle to the left
                            if(this.position.x < 0)//if left of paddle is going beyond the left edge of the canvas
                            {
                                this.position.x = 0;//adjust
                            }
                        } 
                    }
                    break;   
            } 
            
            //check if there's another ball with a faster eta that can be caught 
            for(let i = 0; i < balls.length; i++)
            { 
                let newBall = balls[i];
                if(newBall.getDestination().team === this.team && newBall.getId() !== this.lockedBall.getId())
                {  
                    let newBallEta = newBall.getDestination().time;//estimated time of arrival 
                    let timeToCatchNewBall = this.getTimeToCatchBall(newBall); 
                    let lockedBallEta = this.lockedBall.getDestination().time;//estimated time of arrival 
                    let timeToCatchLockedBall = this.getTimeToCatchBall(this.lockedBall);
                    if(timeToCatchNewBall <= newBallEta/*if the new ball can be caught*/ && newBallEta < lockedBallEta/*new ball will hit the paddle before the locked ball*/)
                    
                    //if(timeToCatchNewBall <= newBallEta/*if the new ball can be caught*/ && timeToCatchNewBall < timeToCatchLockedBall/*new ball will hit the paddle before the locked ball*/)
                    { 
                        this.lockedBall = newBall;  
                        this.lockedOnTarget = true;
                    }
                }  
            }
            
            //update locked ball
            let lockedBallId = this.lockedBall.getId();
            for(let j = 0; j < balls.length; j++)
            {
                let ball = balls[j];
                if (ball.getId() === lockedBallId && ball.getDestination().team === this.team)
                {
                    this.lockedBall = ball;
                    break; 
                } 
                if(j === balls.length-1)
                {
                    this.lockedOnTarget = false;  
                } 
            }  
            //if the locked ball touches the paddle or the wall of the canvas(the one the paddle is on), release the lock
            //console.log(this.lockedBall.getBallData().radius);
            if(this.ballTouchedPaddle(this.lockedBall.getBallData()) || this.ballTouchesWall(this.lockedBall.getBallData()))
            {   //console.log('collision'); 
                this.lockedOnTarget = false;  
                //this.lockedBall =  null; 
            }
        }  
    }
    ballTouchedPaddle(ball)//ball has collided with paddle
    {   
        //Find the vertical & horizontal (distX/distY) distances between the ball’s center and the paddle’s center
        let distX = Math.abs(ball.x - this.position.x - this.width/2);
        let distY = Math.abs(ball.y - this.position.y - this.height/2); 
        //If the distance is greater than halfCircle + halfRect, then they are too far apart to be colliding
        if (distX > (this.width/2 + ball.radius)) 
        { 
            return false; 
        }
        if (distY > (this.height/2 + ball.radius)) 
        { 
            return false; 
        }  
        //If the distance is less than halfRect then they are definitely colliding
        if (distX <= (this.width/2)) 
        { 
            return true; 
        } 
        if (distY <= (this.height/2)) 
        { 
            return true; 
        }
        
        //test for collision at the paddle corner
        // Think of a line from the paddle center to any paddle corner. Now extend that line by the radius of the ball.
        //If the ball’s center is on that line they are colliding at exactly that paddle corner.
        //Using Pythagoras formula to compare the distance between ball and paddle centers.
        let dx=distX-this.width/2;
        let dy=distY-this.height/2;
        return (dx*dx+dy*dy<=(ball.radius*ball.radius)); 
    }
    ballTouchesWall(ball)
    {   
        switch(this.team)
        {
            case 'left'://if paddle is on the left wall  
                if(ball.x - ball.radius < 0)//if ball touches the left wall
                {
                    return true; 
                }
                break; 
            case 'right'://if paddle is on the right wall  
                if(ball.x + ball.radius > this.screenWidth)//if ball touches the right wall
                {
                    return true; 
                }
                break; 
            case 'top'://if paddle is on the top wall  
                if(ball.y - ball.radius < 0)//if ball touches the top of the wall
                {
                    return true; 
                }
                break; 
            case 'bottom'://if paddle is on the bottom wall  
                if(ball.y + ball.radius > this.screenHeight)//if ball touches the bottom of the wall
                {
                    return true; 
                }
                break; 
        }
        return false;  
    }
    
}