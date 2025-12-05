let cursor = {
  x : 0,
  y : 0,
  diameter : 50,
  test : 20,
  highlight : 10
}

let diameter2 = 20;

  function setup() {

  // create the canvas

  canvas = createCanvas(600, 600);

  // attach the canvas to the div in your HTML

  canvas.parent("sketch-container");
}

function draw() {
  background(255);
  
  let offset = map(cursor.x, 0, width, -50, 50);
  // Draw vertical lines using a loop.
  for (let x = -100; x < 700; x += 10) {
  stroke(255, 0, 102);
  strokeWeight(3);
  line(x + offset, 600, x + offset, 0);
  }
  
  // Draw the words
  //200 - 275
  //O
  stroke(255, 0, 102);
  line(300, 225, 300, 200);//mid
  line(300, 255, 300, 275);//mid
  line(290, 205, 290, 230);//left
  line(290, 250, 290, 270);//left
  line(280, 210, 280, 265);//left
  line(270, 230, 270, 250);//left
  line(310, 205, 310, 230);//right
  line(310, 250, 310, 270);//right
  line(320, 210, 320, 265);//right
  line(330, 230, 330, 250);//right
  
  //H
  line(250, 200, 250, 275);//right
  line(240, 200, 240, 275);//right
  line(230, 250, 230, 230);//mid
  line(220, 250, 220, 230);//mid
  line(210, 200, 210, 275);//left
  line(200, 200, 200, 275);//left
  
  //S
  line(180, 210, 180, 220);
  line(170, 200, 170, 220);
  line(160, 200, 160, 220);
  line(150, 200, 150, 220);
  line(140, 210, 140, 250);
  line(130, 220, 130, 245);
  line(150, 240, 150, 250);
  line(160, 240, 160, 250);
  line(170, 245, 170, 275);
  line(180, 250, 180, 270);
  line(160, 260, 160, 275);
  line(150, 260, 150, 275);
  line(140, 260, 140, 270);
  line(130, 260, 130, 265);
  
  //E
  line(350, 200, 350, 275);
  line(360, 200, 360, 275);
  line(370, 200, 370, 220);//top
  line(380, 200, 380, 220);//top
  line(390, 200, 390, 220);//top
  line(370, 260, 370, 275);//bottom
  line(380, 260, 380, 275);//bottom
  line(390, 260, 390, 275);//bottom
  line(370, 235, 370, 250);//mid
  line(380, 235, 380, 250);//mid
  line(390, 235, 390, 250);//mid
  
  //right S
  line(460, 210, 460, 220);
  line(450, 200, 450, 220);
  line(440, 200, 440, 220);
  line(430, 200, 430, 220);
  line(420, 210, 420, 250);
  line(410, 220, 410, 245);
  line(430, 240, 430, 250);
  line(440, 240, 440, 250);
  line(450, 245, 450, 275);
  line(460, 250, 460, 270);
  line(440, 260, 440, 275);
  line(430, 260, 430, 275);
  line(420, 260, 420, 270);
  line(410, 260, 410, 265);
  
 
  fill(255);
  cursor.x = mouseX
  cursor.y = mouseY
  circle(cursor.x, cursor.y, cursor.diameter);
  fill(0)
  noStroke();
  circle(cursor.x , cursor.y, cursor.test);
  fill(255);
  circle(cursor.x - 4, cursor.y -4, cursor.highlight);

  //show coordinates with mouse
/*
  push();
  fill(0);
  text("(" + mouseX + ", " + mouseY + ")", mouseX, mouseY);
  stroke(0);
  pop();
  */

}
