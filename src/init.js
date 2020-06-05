'use strict'; 
/* Sets everything up
 * ------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      2nd June, 2020 
 * @email:     calebniitettehaddy@gmail.com 
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/SocialDistancing
 * @codepen:   https://codepen.io/niitettehtsuru/pen/NWqENww
 * @license:   GNU General Public License v3.0
 */  
let 
c   = document.getElementById("pingPongCanvas"), 
ctx = c.getContext("2d");   
function getBrowserWindowSize() 
{
    let 
    win     = window,
    doc     = document,
    offset  = 20,
    docElem = doc.documentElement,
    body    = doc.getElementsByTagName('body')[0],
    browserWindowWidth  = win.innerWidth || docElem.clientWidth || body.clientWidth,
    browserWindowHeight = win.innerHeight|| docElem.clientHeight|| body.clientHeight; 
    return {x:browserWindowWidth-offset,y:browserWindowHeight-offset}; 
}  

let 
teams  = ['left','right','top','bottom'],
browserWindowSize   = getBrowserWindowSize();
c.width = browserWindowSize.x;//width of canvas
c.height= browserWindowSize.y;//height of canvas

function createPaddles() 
{
    let paddles = [];  
    teams.forEach(function(team)      
    {   
        if(team === 'top' || team === 'bottom')
        {
            paddles.push(new Paddle(SCREEN_WIDTH,SCREEN_HEIGHT,team));  
            paddles.push(new Paddle(SCREEN_WIDTH,SCREEN_HEIGHT,team));  
            paddles.push(new Paddle(SCREEN_WIDTH,SCREEN_HEIGHT,team));
            paddles.push(new Paddle(SCREEN_WIDTH,SCREEN_HEIGHT,team));
        } 
        else
        {
            paddles.push(new Paddle(SCREEN_WIDTH,SCREEN_HEIGHT,team));  
            paddles.push(new Paddle(SCREEN_WIDTH,SCREEN_HEIGHT,team));    
        }
            
    }); 
    return paddles;  
}
function createBalls(numOfBalls)
{
    let balls = [];
    for(let i = 0; i < numOfBalls; i++)
    {
        balls.push(new Ball(SCREEN_WIDTH,SCREEN_HEIGHT));
    }
    return balls; 
}
let  
SCREEN_WIDTH  = browserWindowSize.x,
SCREEN_HEIGHT = browserWindowSize.y, 
paddles = createPaddles(),
numOfBalls = 4,
balls = createBalls(numOfBalls),
lastTime = 100,
pingPongObjects = [...paddles,...balls], 
windowSize; 
 
function drawLawnMarkings() 
{
    //draw horizontal line
    let p1 = {x:0,y:SCREEN_HEIGHT/2}; 
    let p2 = {x:SCREEN_WIDTH,y:SCREEN_HEIGHT/2};  
    ctx.beginPath(); 
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 0.3; 
    ctx.moveTo(p1.x,p1.y);
    ctx.lineTo(p2.x,p2.y); 
    ctx.stroke(); 
    ctx.closePath(); 
    //draw vertical line
    p1 = {x:SCREEN_WIDTH/2,y:0}; 
    p2 = {x:SCREEN_WIDTH/2,y:SCREEN_HEIGHT};  
    ctx.beginPath(); 
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 0.3; 
    ctx.moveTo(p1.x,p1.y);
    ctx.lineTo(p2.x,p2.y); 
    ctx.stroke(); 
    ctx.closePath(); 
    //draw rectangle to mark center 
    ctx.beginPath();
    ctx.rect(SCREEN_WIDTH/2-5,SCREEN_HEIGHT/2-5,10,10);  
    ctx.fillStyle   = 'rgba(255,255,255,0.7)';
    ctx.fill();
}
function onWindowResize()//called every time the window gets resized. 
{  
    windowSize     = getBrowserWindowSize();
    c.width        = windowSize.x; 
    c.height       = windowSize.y; 
    SCREEN_WIDTH   = windowSize.x;
    SCREEN_HEIGHT  = windowSize.y; 
    pingPongObjects.forEach(function (obj) 
    {     
        obj.resize(SCREEN_HEIGHT,SCREEN_WIDTH); 
    }); 
}  
window.addEventListener('resize',onWindowResize);  
function animationLoop(timestamp)
{      
    ctx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
    drawLawnMarkings();
    //update paddles and balls 
    let deltaTime = timestamp - lastTime; 
        lastTime = timestamp;  
    paddles.forEach(function (paddle) 
    {    
        paddle.update(deltaTime,balls,paddles); 
    });  
    balls.forEach(function (ball) 
    {        
        ball.update(deltaTime,paddles); 
    });
    //draw paddles and balls
    pingPongObjects.forEach(function (obj) 
    {       
        obj.draw(ctx);   
    }); 
    requestAnimationFrame(animationLoop);   
} 
requestAnimationFrame(animationLoop);   
   
 
 