function setup() {

  // create the canvas

  canvas = createCanvas(400, 400);

  // attach the canvas to the div in your HTML

  canvas.parent("sketch-container");
}

function draw() {
  background(153, 230, 255);
  noStroke(); 
  
     fill(255, 99, 71); 
    circle(700, 200, 140); //sun
  
      fill(70, 130, 180);
    rect(0, 215, 800, 200); //ocean
  
      fill(32, 96, 59);
    triangle(0, 290, 200, 295, 0, 151); //far mountain
     fill(46, 139, 87);
    triangle(0, 295, 295, 295, 100, 151); //close mountain
  
      fill(2245, 245, 220);
    rect(0, 290, 280, 120); //beach
  
      fill(70, 130, 180); //surf
    circle(280, 305, 30); //top
    circle(270, 330, 35); //middle
    circle(255, 360, 42); //down
    circle(235, 390, 44); //down
  
      fill(217, 179, 140);
    rect(195, 0, 20, 400); //window left 
    rect(507, 0, 20, 400); //window right 
    rect(0, 400, 250, 20); //window down 
  
      fill(255, 255, 255); //cloud
    circle(328, 100, 50); 
    circle(370, 100, 50);
    circle(415, 100, 50);
    circle(347, 80, 50);
    circle(395, 80, 50);
  
      fill(51, 26, 0);
    rect(530, 200, 120, 100); //hair back
  
      fill(46, 139, 87); //body
    rect(515, 254, 150, 200, 40); //last variable = round corner
      fill(32, 96, 59); //arm line
    rect(546, 294, 7, 100, 40); //left arm
    rect(627, 294, 7, 100, 40); //left arm
  
     fill(134, 89, 45); //floor
    rect(0, 420, 300, 100); 
  
      fill(77, 38, 0);
    circle(310, 440, 200); //table
    fill(77, 38, 0);
    rect(313,340,530,200); //table
  
      fill(255, 230, 204);
    circle(590, 200, 120); //face
    circle(538, 210, 50); //left ear
    circle(640, 208, 50); //right ear
  
      push();
      fill(51, 26, 0);
    translate(540,135);
    rotate(TWO_PI);
    arc(50, 50, 120, 120, PI, TWO_PI, CHORD); //bangs
      pop();
  
      fill(51, 26, 0);
    rect(530, 180, 10, 100,40); //hair left piece 
      fill(51, 26, 0);
    rect(640, 180, 10, 100,40); //hair right piece  
   
     fill(51, 26, 0);
    circle(563, 210, 20); //left eye
    circle(617, 210, 20); //right eye
   
     fill(210, 105, 30);
    arc(591, 229, 30, 30, 0, PI + TWO_PI, CHORD); //mouth
  
     fill(32, 96, 59); //beer
    rect(390, 360, 50, 80, 20); 
    rect(404, 320, 20, 50, 5); 
     fill(255, 255, 230); //beer label
    rect(390, 385, 30, 30); 
  
     fill(255, 255, 255); //glass 
    rect(460, 330, 40, 70, 10); 
     fill(255, 219, 77); //liquid in glass
    rect(460, 360, 40, 40, 10); 
     fill(217, 217, 217); //glass mouth
    rect(460, 330, 40, 20, 100); 
  
     fill(255, 255, 255); //pasta plate
    ellipse(600, 400, 130, 50);
     fill(217, 217, 217); //plate shadow
    ellipse(600, 397, 100, 35);
     fill(255, 204, 102); //pasta 
    ellipse(600, 388, 90, 35);
  
  //show coordinates with mouse
  fill(0);
  text("(" + mouseX + ", " + mouseY + ")", mouseX, mouseY);
  stroke(0);

}
