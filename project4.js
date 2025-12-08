function setup() {

  // create the canvas

  canvas = createCanvas(400, 600);

  // attach the canvas to the div in your HTML

  canvas.parent("sketch-container");
}

function draw() {
  background(153, 230, 255);

  //head
  ellipse(200, 120, 120, 130);
  
  //left eye
  stroke(40);
  beginShape();
  vertex(164, 97);
  quadraticVertex(178, 90, 191, 92);
    quadraticVertex(177, 96, 164, 103);
    quadraticVertex(177, 99, 191, 99);
  line(177, 501, 166, 500);
  endShape();
  
   //right eye
  stroke(40);
  beginShape();
  vertex(213, 89);
  quadraticVertex(227, 85, 237, 88);
    quadraticVertex(225, 90, 214, 98);
      quadraticVertex(229, 92, 235, 94);
  line(177, 501, 166, 500);
  endShape();
  
  //nose
  stroke(40);
  beginShape();
  vertex(195, 141);
  vertex(199, 146);
  line(177, 501, 166, 500);
  endShape();
  
   //mouth
  stroke(40);
  beginShape();
  vertex(189, 156);
 quadraticVertex(198, 161, 210, 155);
  line(177, 501, 166, 500);
  endShape();

  //left arm
  stroke(40);
  beginShape();
  vertex(138, 192);
  vertex(127, 218);
  quadraticVertex(110, 203, 96, 209);
  quadraticVertex(88, 223, 97, 248);
  quadraticVertex(121, 252, 145, 242);
  line(177, 501, 166, 500);
  endShape();

  //feet
  stroke(40);
  beginShape();
  vertex(185, 362);
  quadraticVertex(144, 413, 72, 434);
  quadraticVertex(55, 438, 54, 459);
  quadraticVertex(60, 490, 82, 455);
  quadraticVertex(97, 444, 121, 440);
  vertex(109, 451);
  quadraticVertex(96, 461, 105, 480);
  quadraticVertex(118, 484, 132, 476);
  quadraticVertex(139, 462, 140, 447);
  quadraticVertex(141, 437, 157, 432);
  quadraticVertex(178, 444, 164, 468);
  quadraticVertex(183, 500, 200, 465);
  quadraticVertex(203, 441, 196, 432);
  quadraticVertex(219, 440, 231, 462);
  quadraticVertex(235, 471, 256, 478);
  vertex(282, 476);
  quadraticVertex(288, 462, 250, 429);
  quadraticVertex(275, 429, 309, 471);
  vertex(347, 468);
  quadraticVertex(354, 449, 341, 429);
  quadraticVertex(317, 416, 287, 410);
  quadraticVertex(269, 403, 213, 361);
  line(177, 501, 166, 500);
  endShape();
  
  //body n arm
  stroke(40);
  beginShape();
  vertex(156, 160);
  vertex(108, 76);
  quadraticVertex(106, 47, 78, 61);
  quadraticVertex(71, 81, 85, 88);
  vertex(139, 195);
  quadraticVertex(138, 305, 118, 357);
  quadraticVertex(210, 387, 276, 360);
  quadraticVertex(263, 259, 256, 190);
  vertex(312, 83);
  quadraticVertex(329, 66, 311, 48);
  quadraticVertex(286, 49, 287, 70);
  vertex(238, 164);
  quadraticVertex(199, 225, 156, 161);
  line(177, 501, 166, 500);
  endShape();

  //belt
  stroke(40);
  beginShape();
  vertex(138, 223);
  quadraticVertex(198, 247, 259, 222);
  vertex(261, 245);
  quadraticVertex(200, 270, 136, 245);
  vertex(138, 223);
  line(177, 501, 166, 500);
  endShape();

  //body right arm
  stroke(40);
  beginShape();
  vertex(254, 189);
  vertex(276, 215);
  quadraticVertex(276, 232, 239, 260);
  quadraticVertex(217, 224, 220, 221);
  quadraticVertex(236, 210, 251, 212);
  line(177, 501, 166, 500);
  endShape();

}
