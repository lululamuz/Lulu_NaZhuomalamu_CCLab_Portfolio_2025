function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES); 
}

  background(255, 255, 102);
  noStroke(); 
  
  let sc = second();
  let scAngle = sc * 6; 
  let leftClosed = false;
  let rightClosed = false;
  
  //on the left side - dog closes eyes
  if (scAngle > 0 && scAngle < 180) {
    leftClosed = true;
  } else { 
    rightClosed = true;
  }

  fill(41, 0, 102);
  rect(300, 0, 300, 600); 
  
  fill(10, 0, 26);
  circle(450, 333, 120); // face
  triangle(390, 333, 449, 295, 392, 235); // left ear
  triangle(390, 333, 497, 232, 510, 327); // right ear
  triangle(450, 387, 600, 600, 300, 600); // body

  if(rightClosed){ //open eyes
    stroke(10,0,26);
    strokeWeight(3);
    line(400, 345, 440, 345); //right eye closed
    line(460, 345, 500, 345); //left eye closed
    noStroke();
  } else { //open eyes
    fill(255);
    circle(420, 345, 35);
    circle(480, 345, 35);
    fill(10,0,26);
    ellipse(420, 350, 10, 40);
    ellipse(480, 350, 10, 40);
  }

  fill(255, 179, 255); 
  ellipse(450, 370, 15, 8); // nose

  fill(204, 153, 102);
  circle(145, 333, 120); 
  triangle(143, 380, 0, 600, 300, 600); 
  fill(172, 115, 57);
  ellipse(90, 270, 40, 70); 
  ellipse(200, 270, 40, 70); 

  if(leftClosed){ //close eyes
    stroke(10,0,26);
    strokeWeight(3);
    line(100, 345, 128, 345); //right eye closed
    line(155, 345, 185, 345); //left eye closed
    noStroke();
  } else { //open eyes
    fill(255);
    circle(114, 345, 35);
    circle(170, 345, 35);
    fill(10, 0, 26); 
    circle(114, 345, 20);
    circle(170, 345, 20);
  }

  fill(255, 179, 255); 
  ellipse(140, 370, 20, 10); // nose
  
  //clock
  fill(10, 0, 26);
  circle(300, 120, 160);
  fill(255);
  circle(300, 120, 140);
  
  push();
  translate(300, 120);
  rotate(-90);

  //seconds
  stroke(200, 0, 0);
  strokeWeight(2);
  line(0, 0, cos(scAngle) * 60, sin(scAngle) * 60);

  fill(0);
  noStroke();
  circle(0, 0, 10);

  pop();

  push();
  fill(0);
  text("(" + mouseX + ", " + mouseY + ")", mouseX, mouseY);
  pop();
}
