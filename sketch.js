/*
 * This program sketch is copied from Even Peck's example at
 * https://editor.p5js.org/evanpeck/sketches/O7MjzPFxb
 * This is from my own learning.
 * Xiannong Meng
 * 2022-06-25
 *
 * Revisions made by Tsugunobu Miyake
 * 1. The balls are emitted radially from one   
 * point instead of having random initial points.
 * 2. The balls are emitted to construct a circular or 
 * semi-circular wave. Whether circular or semi-circular wave is 
 * emitted is determined randomly.
 * 3. After several bounces, the balls will disappear from the 
 * screen. The program automatically generates another set of  
 * balls in the random location.
 * 4. If the user clicks on a screen, current balls will be 
 * erased and new balls will be generated.
 * 5. When the balls are generated, or exploded, the explosion  
 * sound is played.
   Sound source: // https://on-jin.com/sound/listshow.php?pagename=sei&title=%E3%82%AF%E3%83%A9%E3%83%83%E3%82%AB%E3%83%BC&janl=%E7%94%9F%E6%B4%BB%E7%B3%BB%E9%9F%B3&bunr=%E9%B3%B4%E3%82%8A%E7%89%A9&kate=%E9%81%93%E5%85%B7


 * Product website: https://tm032.github.io/BouncingBall-p5/
 */

var balls = [];
var sound;

var maxBalls = 100;
var ballCount = 0;

function preload() {
  // Load the explosion sound.
  sound = loadSound("explosion.mp3");
}

function setup() {

 createCanvas(windowWidth, windowHeight);
  
  noStroke();
  
  
  createBalls(100, 100);

}

function createBalls(x, y) {
  if(random(2) < 1){
    generateSemiCircles(x, y);
  }else{
    generateCircles(x, y);
  }
  sound.play();
}

// Generate semi-circular wave
function generateSemiCircles(x, y) {
  var ballSpeed = 4;
  tilt = random() * 2 * PI;
  for(var loops = 0; loops < 3; loops++){
    for (var ballNum = loops * maxBalls; ballNum < (loops + 1) * maxBalls; ballNum++) {
    radian = (ballNum % maxBalls) / maxBalls * PI;
    
  	balls[ballNum] = new Ball(x, y, 
                              ballSpeed * Math.cos(radian + tilt),
                              ballSpeed * Math.sin(radian + tilt)); 
    }
    ballSpeed *= 0.7; // Decrease the speed.
  }
}

// Generate circular wave
function generateCircles(x, y) {
  var ballSpeed = 3;
  
  for(var loops = 0; loops < 3; loops++){
    for (var ballNum = loops * maxBalls; ballNum < (loops + 1) * maxBalls; ballNum++) {
    radian = ballNum / maxBalls * 2 * PI;
    
  	balls[ballNum] = new Ball(x, y, 
                              ballSpeed * Math.cos(radian),
                              ballSpeed * Math.sin(radian)); 
    }
    ballSpeed *= 0.7;
  }
}


function draw() {  
  // Checks if all balls disappeared.
  var allBallsGone = true;
  
  // Black background
  background(0);
  
  for (var ballNum = 0; ballNum < balls.length; ballNum++) {
    balls[ballNum].display();
    balls[ballNum].checkForHitWall();
    balls[ballNum].moveBall();

    // this will be false if some ball has size != 0
    allBallsGone &= balls[ballNum].size == 0;
  }
  
  if(allBallsGone) {
    // Generates balls on a random location.
    x = random(windowWidth * 0.9) + windowWidth * 0.1;
    y = random(windowHeight * 0.9) + windowHeight * 0.1;
    createBalls(x, y);
  }
  
}

// If the mouse if clicked, generate balls on a random location.
function mouseClicked() {
  createBalls(mouseX, mouseY);
}

class Ball { // Constructor
  
  constructor(x, y, vx, vy) {
    this.collideCount = 0;
    this.MAX_COLLISION = 3;
    
    // initial position
    this.ballX = x;
    this.ballY = y;
    
    // Dictates velocity + direction
    this.speedY = vx * (0.03 * random() + 1);
    this.speedX = vy * (0.03 * random() + 1);
    
    this.size = 10; //random(100);
    
    // RGB values for color
    this.red   = random(255);
    this.green = random(255);
    this.blue  = random(255);
  }
  
  display() {
    fill(this.red, this.green, this.blue);
    ellipse(this.ballX, this.ballY, this.size);
  }
  
  checkForHitWall() {
    // Hide the ball if the collision count is about to
    // exceed the MAX_COLLISION
    if(this.collideCount >= this.MAX_COLLISION){
      this.size = 0;
      this.x = 100;
      this.y = 100;
      this.vx = 0;
      this.vy = 0;
    }
    
    let radius = this.size / 2;
    if ((this.ballY+radius) > height || (this.ballY-radius) < 0) {
  	  this.speedY = -this.speedY;
      this.collideCount++;
    }
    if ((this.ballX+radius) > width  || (this.ballX-radius) < 0) {
      this.speedX = -this.speedX;  
      this.collideCount++;
    }
  }
  
  
  reverseBall() {
    
      this.speedX = -this.speedX;
      this.speedY = -this.speedY;    
  }
  
  moveBall() {

    this.ballX += this.speedX;
  	this.ballY += this.speedY;
  }
  
}
