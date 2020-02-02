// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/AaGK-fj-BAM

var s;
var scl = 20;
var random_control = 0;
var food;
var button;
var Slider;
var canvasHeight =  window.innerHeight*0.75
var canvasWidth =  window.innerWidth*0.75

function setup() {

  createCanvas(canvasWidth, canvasHeight);
  s = new Snake();
  frameRate(10);
  pickLocation();

  button = createButton('Random');
  button.position(10, canvasHeight + 10);
  button.mousePressed(randomButtonFun);
  Slider = createSlider(0, 200, 0);
  Slider.position(100, canvasHeight + 15);

  function randomButtonFun() {
    random_control = 1
  }

}

function pickLocation() {
  var cols = floor(width/scl);
  var rows = floor(height/scl);
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(scl);
}

function mousePressed() {
  s.total++;
}

function draw() {
  background(51);

  if (s.eat(food)) {
    pickLocation();
  }
  randomMove()
  s.death();
  s.update();
  s.show();


  fill(255, 0, 100);
  rect(food.x, food.y, scl, scl);
}


function keyPressed() {
  if (keyCode === UP_ARROW) {
    s.dir(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    s.dir(0, 1);
  } else if (keyCode === RIGHT_ARROW) {
    s.dir(1, 0);
  } else if (keyCode === LEFT_ARROW) {
    s.dir(-1, 0);
  }
}


function randomMove() {
var sliderValue = Slider.value() / 100;
console.log(sliderValue)
if (random_control===1) {

  var r = random(1) + sliderValue;

  if (s.xspeed === 1){
  if (r > 0.5) {
    s.xspeed = 0
    s.yspeed = -1
  } else {
    s.xspeed = 0
    s.yspeed = 1
  }
} else { // We are moving in the y-direction
  if (r > 0.5) {
    s.xspeed = 1
    s.yspeed = 0
  } else {
    s.xspeed = -1
    s.yspeed = 0
  }
}
}
}
