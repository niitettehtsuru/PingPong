'use strict'; 
/* A paddle for hitting tha ball
 * -----------------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      2nd June, 2020 
 * @email:     calebniitettehaddy@gmail.com 
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/PingPong
 * @codepen:   https://codepen.io/niitettehtsuru/pen/NWqENww
 * @license:   GNU General Public License v3.0
 */  
class Paddle
{
    constructor(screenWidth,screenHeight,team)
    {       
        this.screenWidth = screenWidth;//width of browser window screen
        this.screenHeight= screenHeight;//height of browser window screen  
        this.width       = PADDLE_SIZE_MAX; 
        this.height      = PADDLE_SIZE_MIN;
        this.team        = team;//type of team, whether left, right, top or bottom
        this.setInitialWidthAndHeight(this.team); 
        //place each paddle at the center against the wall.For eg, if team is top, paddle will be placed at the center against the top wall. 
        this.position    = this.setCenterPosition(this.team); 
        this.speed       = this.setInitialSpeed(this.team);//speed of the paddle  
        this.color       = this.setInitialColor(this.team);//colour of the paddle  
        this.lockedOnTarget    = false; //true if paddle is locked on a ball,false otherwise
        this.lockedBall = new Ball(this.screenWidth,this.screenHeight);//the ball that the paddle is locked on
    } 
    setInitialColor(team)//set color of paddle based on the team it belongs to
    { 
        let color = 'rgba(255,255,255,0.5)';
        switch(team)
        {
            case 'left'://if paddle is on the left wall  
                color = 'rgba(128,0,0,0.7)';//red
                break; 
            case 'right'://if paddle is on the right wall  
                color = 'rgba(0,0,0,0.7)';//black
                break; 
            case 'top'://if paddle is on the top wall  
                color = 'rgba(0,0,125,0.7)';//blue
                break; 
            case 'bottom'://if paddle is on the bottom wall  
                color = 'rgba(255,255,255,0.5)';//white
                break; 
        }
        return color; 
    }
    setInitialSpeed(team)//set speed of paddle based on the team it belongs to 
    { 
        let speed = {x:0,y:0};   
        switch(team)
        {
            case 'left'://if paddle is on the left or right wall  
            case 'right': 
                speed = {x:0,y:25};//it will move only vertically 
                break; 
            case 'top'://if paddle is on the top or bottom wall  
            case 'bottom':
                speed = {x:25,y:0};//it will move only horizontally
                break; 
        }
        return speed; 
    }
    setInitialWidthAndHeight(team)//set width and height for paddle based on the team it belongs to
    {
        switch(team)
        {
            case 'left'://if paddle is on the left or right wall  
            case 'right': 
                this.width  = PADDLE_SIZE_MIN; 
                this.height = PADDLE_SIZE_MAX;
                break; 
            case 'top'://if paddle is on the top or bottom wall  
            case 'bottom': 
                this.width  = PADDLE_SIZE_MAX; 
                this.height = PADDLE_SIZE_MIN; 
                break; 
        }
    }
    setCenterPosition(team)//set starting position of the paddle based on the team it belongs  to 
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
    isLocked()//returns true of paddle is locked on target, false otherwise
    {
        return this.lockedOnTarget;
    }
    getLockedBallId()//get id of the ball that the paddle is locked on 
    {
        return this.lockedBall.getId(); 
    }
    getPaddleData()//returns geometric dimensions of the paddle
    {
        return {x:this.position.x,y:this.position.y,width:this.width,height:this.height};
    }
    getTeam()//returns the type of team the paddle belongs to
    {
        return this.team; 
    }  
    resize(screenHeight,screenWidth)//let the paddle be responsive to the resizing of the window
    { 
        let dy = screenHeight/this.screenHeight;//percentage change in browser window height 
        let dx = screenWidth/this.screenWidth;//percentage change in browser window width  
        this.screenHeight = screenHeight;  
        this.screenWidth  = screenWidth; 
        this.position.y *= dy;
        this.position.x *= dx;
        if(this.team === 'bottom')
        {
            this.position.y = this.screenHeight - PADDLE_SIZE_MIN; 
        }
        if(this.team === 'right')
        {
            this.position.x = this.screenWidth - PADDLE_SIZE_MIN; 
        }
    }
    draw(ctx)//draw the paddle
    {
        ctx.beginPath();
        ctx.rect(this.position.x,this.position.y,this.width,this.height);  
        ctx.fillStyle   = this.color;
        ctx.fill(); 
    } 
    getTimeToCatchBall(ball)//how long it will take for the paddle to move from it's current position to hit the ball
    {
        let timeToCatchBall = 0;  
        let pointOfContact = ball.getDestination().pointOfContact;//where the ball will meet the paddle
        switch(ball.getDestination().team)
        {
            case 'left'://if paddle is on the left wall   
                if//if paddle is positioned to receive the ball
                (this.position.y <  pointOfContact.y && this.position.y + this.height > pointOfContact.y)
                {
                    //then there's no need to find how long it will take to hit the ball
                }
                else //if paddle is NOT positioned to receive the ball
                { 
                    if(this.position.y + this.height < pointOfContact.y)//if paddle is above point of contact
                    {
                        let dy = pointOfContact.y - (this.position.y + this.height);//distance from paddle to point of contact
                        timeToCatchBall = dy/this.speed.y; 
                    } 
                    if(this.position.y > pointOfContact.y)//if paddle is below point of contact
                    {
                        let dy = this.position.y - pointOfContact.y;//distance from paddle to point of contact
                        timeToCatchBall = dy/this.speed.y;  
                    } 
                } 
                break; 
            case 'right'://if paddle is on the right wall   
                if//if paddle is positioned to receive the ball
                (this.position.y <  pointOfContact.y && this.position.y + this.height > pointOfContact.y)
                {
                    //then there's no need to find how long it will take to hit the ball
                }
                else 
                { 
                    if(this.position.y + this.height < pointOfContact.y)//if paddle is above point of contact 
                    {
                        let dy = pointOfContact.y - (this.position.y + this.height);//distance from paddle to point of contact
                        timeToCatchBall = dy/this.speed.y; 
                    } 
                    if(this.position.y > pointOfContact.y)//if paddle is below point of contact
                    { 
                        let dy = this.position.y - pointOfContact.y;//distance from paddle to point of contact
                        timeToCatchBall = dy/this.speed.y;  
                    } 
                } 
                break; 
            case 'top'://if paddle is on the top wall   
                if//if paddle is positioned to receive the ball
                (this.position.x <  pointOfContact.x && this.position.x + this.width > pointOfContact.x)
                {
                    //then there's no need to find how long it will take to hit the ball
                }
                else 
                { 
                    if(this.position.x + this.width < pointOfContact.x)//if paddle is to the left of the point of contact 
                    {
                        let dx = pointOfContact.x - (this.position.x + this.width);//distance from paddle to point of contact
                        timeToCatchBall = dx/this.speed.x;   
                    } 
                    if(this.position.x > pointOfContact.x)//if paddle is to the right of the point of contact
                    { 
                        let dx = this.position.x - pointOfContact.x;//distance from paddle to point of contact
                        timeToCatchBall = dx/this.speed.x; 
                    } 
                }
            case 'bottom'://if paddle is on the bottom wall  
                if//if paddle is positioned to receive the ball
                (this.position.x <  pointOfContact.x && this.position.x + this.width > pointOfContact.x)
                {
                    //then there's no need to find how long it will take to hit the ball
                }
                else 
                { 
                    if(this.position.x + this.width < pointOfContact.x)//if paddle is to the left of the point of contact 
                    {
                        let dx = pointOfContact.x - (this.position.x + this.width);//distance from paddle to point of contact
                        timeToCatchBall = dx/this.speed.x;   
                    } 
                    if(this.position.x > pointOfContact.x)//if paddle is to the right of the point of contact
                    { 
                        let dx = this.position.x - pointOfContact.x;//distance from paddle to point of contact
                        timeToCatchBall = dx/this.speed.x; 
                    } 
                }
                break; 
        }
        return timeToCatchBall; 
    }
    ballIsLockedByAnotherPaddle(paddles,ball)//returns true if another paddle has a lock on the ball, false otherwise
    {
        let result = false; 
        let team = this.team; 
        paddles.some(function(paddle)
        {
            if(paddle.isLocked() && paddle.getLockedBallId() === ball.getId() && paddle.getTeam() === team)
            {
                result = true; 
            }
            return paddle.isLocked() && paddle.getLockedBallId() === ball.getId();//quit the iteration if ball is locked by another paddle
        });
        return result; 
    }
    update(deltaTime,balls,paddles)
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
                for(let i = 0; i < qualifiedBalls.length; i++)//find and get a lock on the ball that will get past the paddle first 
                {
                    let qualifiedBall = qualifiedBalls[i];
                    if(!this.ballIsLockedByAnotherPaddle(paddles,qualifiedBall))
                    {
                        let eta = qualifiedBall.getDestination().time;//estimated time of arrival of the ball
                        let timeToCatchBall = this.getTimeToCatchBall(qualifiedBall);
                        if(eta < fastestTime && timeToCatchBall <= eta/*if the ball can be caught*/)
                        {
                            fastestTime = eta; 
                            this.lockedBall = qualifiedBall;  
                            this.lockedOnTarget = true;
                        } 
                    }  
                } 
            }
        } 
        if(this.lockedOnTarget)//if paddle is locked on a ball...
        {
            let pointOfContact = this.lockedBall.getDestination().pointOfContact; 
            //...move paddle to receive the ball
            switch(this.team) 
            {
                case 'left'://if paddle is on the left wall
                    if//if paddle is positioned to receive the ball
                    (this.position.y <  pointOfContact.y && this.position.y + this.height > pointOfContact.y)
                    {   //adjust the paddle to receive the ball at it's center
                        if(this.position.y + this.height/2 < pointOfContact.y && //if the center of the paddle is above the point of contact
                          this.position.y + this.height < this.screenHeight)//and bottom of paddle is NOT beyond the bottom of the canvas 
                        {
                            this.position.y += this.speed.y;//move the paddle down 
                        }  
                        if(this.position.y + this.height/2 > pointOfContact.y && //if the center of the paddle is below the point of contact
                            this.position.y > 0)//and the top of paddle is NOT beyond the top of the canvas 
                        {
                            this.position.y -= this.speed.y;//move the paddle up 
                        } 
                    }
                    else //if paddle is NOT positioned to receive the ball
                    { 
                        if(this.position.y + this.height < pointOfContact.y)//if paddle is above point of contact 
                        {
                            this.position.y += this.speed.y;//move the paddle down
                            if(this.position.y + this.height > this.screenHeight)//if bottom of paddle is going beyond the bottom of the canvas
                            {
                                this.position.y = this.screenHeight - this.height;//adjust the position
                            } 
                        } 
                        if(this.position.y > pointOfContact.y)//if paddle is below point of contact
                        { 
                            this.position.y -= this.speed.y;//move the paddle up 
                            if(this.position.y < 0)//if top of paddle is going beyond the top of the canvas
                            {
                                this.position.y = 0;//adjust the position
                            }
                        } 
                    } 
                    break;
                case 'right': //if paddle is on the right wall 
                    if//if paddle is positioned to receive the ball
                    (this.position.y <  pointOfContact.y && this.position.y + this.height > pointOfContact.y)
                    {   //adjust the paddle to receive the ball at it's center
                        if(this.position.y + this.height/2 < pointOfContact.y && //if the center of the paddle is above the point of contact
                            this.position.y + this.height < this.screenHeight)//and bottom of paddle is NOT beyond the bottom of the canvas 
                        {
                            this.position.y += this.speed.y;//move the paddle down 
                        }  
                        if(this.position.y + this.height/2 > pointOfContact.y && //if the center of the paddle is below the point of contact
                            this.position.y > 0) //and the top of paddle is NOT beyond the top of the canvas 
                        {
                            this.position.y -= this.speed.y;//move the paddle up 
                        } 
                    }
                    else //if paddle is NOT positioned to receive the ball
                    { 
                        if(this.position.y + this.height < pointOfContact.y)//if paddle is above point of contact 
                        {
                            this.position.y += this.speed.y;//move the paddle down
                            if(this.position.y + this.height > this.screenHeight)//if bottom of paddle is beyond the bottom of the canvas
                            {
                                this.position.y = this.screenHeight - this.height;//adjust the position
                            } 
                        } 
                        if(this.position.y > pointOfContact.y)//if paddle is below point of contact
                        { 
                            this.position.y -= this.speed.y;//move the paddle up 
                            if(this.position.y < 0)//if top of paddle is  beyond the top of the canvas
                            {
                                this.position.y = 0;//adjust the position
                            }
                        } 
                    } 
                    break;  
                case 'top': //if paddle is on the top wall 
                    if//if paddle is positioned to receive the ball
                    (this.position.x <  pointOfContact.x && this.position.x + this.width > pointOfContact.x)
                    {   //adjust the paddle to receive the ball at it's center
                        if(this.position.x + this.width/2 < pointOfContact.x && //if the center of the paddle is to the left of the ball,
                            this.position.x + this.width < this.screenWidth)//and the right edge of paddle is NOT beyond the right edge of the canvas 
                        {
                            this.position.x += this.speed.x;//move the paddle to the right       
                        }  
                        if(this.position.x + this.width/2 > pointOfContact.x && //if the center of the paddle is to the right of the ball,
                           this.position.x > 0)//and the left edge of paddle is NOT beyond the left edge of the canvas 
                        {
                            this.position.x -= this.speed.x;//move the paddle to the left       
                        } 
                    }
                    else //if paddle is NOT positioned to receive the ball
                    { 
                        if(this.position.x + this.width < pointOfContact.x)//if paddle is to the left of the point of contact 
                        {
                            this.position.x += this.speed.x;//move the paddle to the right
                            if(this.position.x + this.width > this.screenWidth)//if right of paddle is beyond the right edge of the canvas
                            {
                                this.position.x = this.screenWidth - this.width;//adjust
                            }
                        } 
                        if(this.position.x > pointOfContact.x)//if paddle is to the right of the point of contact
                        { 
                            this.position.x -= this.speed.x;//move the paddle to the left
                            if(this.position.x < 0)//if left of paddle is beyond the left edge of the canvas
                            {
                                this.position.x = this.screenWidth;//adjust
                            }
                        } 
                    }
                    break; 
                case 'bottom'://if paddle is on the bottom wall 
                    //if paddle is positioned to receive the ball
                    if(this.position.x <  pointOfContact.x && this.position.x + this.width > pointOfContact.x)
                    {   //adjust the paddle to receive the ball at it's center
                        if(this.position.x + this.width/2 < pointOfContact.x && //if the center of the paddle is to the left of the ball,
                            this.position.x + this.width < this.screenWidth)//and the right edge of paddle is NOT beyond the right edge of the canvas
                        {
                            this.position.x += this.speed.x;//move the paddle to the right       
                        }  
                        if(this.position.x + this.width/2 > pointOfContact.x && //if the center of the paddle is to the right of the ball,
                            this.position.x > 0)//and the left edge of paddle is NOT beyond the left edge of the canvas 
                        {
                            this.position.x -= this.speed.x;//move the paddle to the left       
                        } 
                    }
                    else //if paddle is NOT positioned to receive the ball
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
            
            //check if there's another ball that will hit the paddle before the locked ball. 
            for(let i = 0; i < balls.length; i++)
            { 
                let newBall = balls[i];
                if(newBall.getDestination().team === this.team && //ball is headed for this paddle
                        newBall.getId() !== this.lockedBall.getId() && //ball is not the currently locked ball
                    !this.ballIsLockedByAnotherPaddle(paddles,newBall))//ball is not locked by another paddle
                {  
                    let newBallEta = newBall.getDestination().time;//estimated time of arrival of the new ball
                    let timeToCatchNewBall = this.getTimeToCatchBall(newBall);//time to move paddle from current position to hit the ball 
                    let lockedBallEta = this.lockedBall.getDestination().time;//estimated time of arrival of the currently locked ball 
                    if(timeToCatchNewBall <= newBallEta/*if the new ball can be caught*/ && newBallEta < lockedBallEta/*new ball will hit the paddle before the locked ball*/)
                    { 
                        this.lockedBall = newBall;//replace the currently locked ball with the new ball
                        this.lockedOnTarget = true;
                    }
                }  
            } 
            //update the locked ball
            let lockedBallId = this.lockedBall.getId();
            for(let j = 0; j < balls.length; j++)
            {
                let ball = balls[j];
                if (ball.getId() === lockedBallId && ball.getDestination().team === this.team)
                {
                    this.lockedBall = ball;
                    break; 
                } 
                if(j === balls.length-1)//if locked ball is missing(things happen)
                {
                    this.lockedOnTarget = false;//set the paddle to fetch another ball to lock
                } 
            }  
            //if the locked ball touches the paddle or the wall of the canvas(the one the paddle is on), release the lock 
            if(this.ballTouchedPaddle(this.lockedBall.getBallData()) || this.ballTouchedWall(this.lockedBall.getBallData()))
            {   
                this.lockedOnTarget = false;  
            }
        }  
    }
    ballTouchedPaddle(ball)//returns true if ball has collided with paddle, false otherwise
    {                                                             
        //Find the vertical & horizontal (distX/distY) distances between the ball’s center and the paddle’s center
        let distX = Math.abs(ball.x - this.position.x - this.width/2);
        let distY = Math.abs(ball.y - this.position.y - this.height/2); 
        //If the distance is greater than halfBall + halfPaddle, then they are too far apart to be colliding
        if (distX > (this.width/2 + ball.radius)) 
        { 
            return  false; 
        }
        if (distY > (this.height/2 + ball.radius)) 
        { 
            return false; 
        }  
        //If the distance is less than halfPaddle then they are definitely colliding
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
    ballTouchedWall(ball)//returns true if ball touches a wall, false otherwise
    {    
        switch(this.team)
        {
            case 'left'://if paddle is on the left wall  
                if(ball.x - ball.radius < 0)//if ball touches the left wall
                {
                    //update the number of goals conceded by the left team
                    let goalsConceded  = +`${document.getElementById('leftTeam').innerHTML}` ; 
                    document.getElementById('leftTeam').innerHTML =`${goalsConceded+1}`;  
                    return true; 
                }
                break; 
            case 'right'://if paddle is on the right wall  
                if(ball.x + ball.radius > this.screenWidth)//if ball touches the right wall
                {   //update the number of goals conceded by the right team
                    let goalsConceded  = +`${document.getElementById('rightTeam').innerHTML}` ; 
                    document.getElementById('rightTeam').innerHTML =`${goalsConceded+1}`;
                    return true; 
                }
                break; 
            case 'top'://if paddle is on the top wall  
                if(ball.y - ball.radius < 0)//if ball touches the top of the wall
                {
                    //update the number of goals conceded by the top team
                    let goalsConceded  = +`${document.getElementById('topTeam').innerHTML}` ; 
                    document.getElementById('topTeam').innerHTML =`${goalsConceded+1}`;
                    return true; 
                }
                break; 
            case 'bottom'://if paddle is on the bottom wall  
                if(ball.y + ball.radius > this.screenHeight)//if ball touches the bottom of the wall
                { 
                    //update the number of goals conceded bottom team 
                    let goalsConceded  = +`${document.getElementById('bottomTeam').innerHTML}` ; 
                    document.getElementById('bottomTeam').innerHTML =`${goalsConceded+1}`;
                    return true; 
                }
                break; 
        }
        return false;  
    } 
}