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
    teams.forEach(function(team)//create a paddle for each team
    {
        paddles.push(new Paddle(SCREEN_WIDTH,SCREEN_HEIGHT,team));  
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
numOfBalls = 5,
balls = createBalls(numOfBalls),
lastTime = 100,
pingPongObjects = [...paddles,...balls], 
windowSize; 
 
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
    //update paddles and balls 
    let deltaTime = timestamp - lastTime; 
        lastTime = timestamp;  
    paddles.forEach(function (paddle) 
    {    
        paddle.update(deltaTime,balls); 
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
   
 
 