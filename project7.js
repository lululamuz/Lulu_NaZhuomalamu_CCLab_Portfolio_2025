// Travel Lulu 

let bg_china, bg_switzerland, bg_uk, bg_us;

function preload() {
  bg_china = loadImage("chinajpg.jpg"); 
  bg_switzerland = loadImage("swiss.jpg"); 
  bg_uk = loadImage("uk.jpg");
  bg_us = loadImage("us.jpg");
}

let scene = 0; // 0 = title, 1 = China, 2 = Switzerland, 3 = UK, 4 = USA, 5 = Ending

let player;
let platforms = [];
let goal;

function setup() {
  createCanvas(600, 400);
  player = new Player(80, 300);
}

function draw() {
  switch (scene) {
    case 0:
      drawTitleScene();
      break;
    case 1:
      drawLevelScene("China", 1);
      break;
    case 2:
      drawLevelScene("Switzerland", 2);
      break;
    case 3:
      drawLevelScene("United Kingdom", 3);
      break;
    case 4:
      drawLevelScene("United States", 4);
      break;
    case 5:
      drawEndingScene();
      break;
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 26;
    this.h = 26;
    this.vx = 0;
    this.vy = 0;
    this.speed = 3;
    this.jumpStrength = -10;
    this.onGround = false;
  }

  update() {
    this.vx = 0;
    if (keyIsDown(LEFT_ARROW)) this.vx = -this.speed;
    if (keyIsDown(RIGHT_ARROW)) this.vx = this.speed;
    this.x += this.vx;

    this.vy += 0.6;
    this.y += this.vy;
    this.onGround = false;

    for (let p of platforms) {
      if (
        this.x + this.w / 2 > p.x &&
        this.x - this.w / 2 < p.x + p.w
      ) {
        let prevBottom = this.y - this.vy + this.h / 2;
        let newBottom = this.y + this.h / 2;
        if (prevBottom <= p.y && newBottom > p.y && this.vy >= 0) {
          this.y = p.y - this.h / 2;
          this.vy = 0;
          this.onGround = true;
        }
      }
    }

    if (this.y + this.h / 2 > height) {
      this.y = height - this.h / 2;
      this.vy = 0;
      this.onGround = true;
    }

    if (scene === 1 || scene === 2 || scene === 3 || scene === 4) {
      this.x = constrain(this.x, this.w / 2, width + this.w);
    } else {
      this.x = constrain(this.x, this.w / 2, width - this.w / 2);
    }
  }

  jump() {
    if (this.onGround) {
      this.vy = this.jumpStrength;
      this.onGround = false;
    }
  }

  show() {
    push();
    translate(this.x, this.y);
    drawMiniLulu();
    pop();
  }

  resetPosition(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
  }
}

class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h
  }

  show() {
    noStroke();
    fill(250); 
    rect(this.x, this.y, this.w, this.h, 3);
  }
}

class Goal {
  constructor(x, y, w, h, sceneNumber) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.sceneNumber = sceneNumber; 
  }

  show() {
    stroke(200);
    strokeWeight(2);
    line(this.x + 8, this.y + this.h - 20, this.x + 8, this.y - 30);

    noStroke();

    if (this.sceneNumber === 1) {
      // China
      fill(200, 0, 0);
      rect(this.x + 8, this.y - 30, 40, 26);
    } else if (this.sceneNumber === 2) {
      // Switzerland
      fill(210, 0, 0);
      rect(this.x + 8, this.y - 30, 40, 26);
    } else if (this.sceneNumber === 3) {
      // UK
      fill(15, 40, 100);
      rect(this.x + 8, this.y - 30, 40, 26);
    } else if (this.sceneNumber === 4) {
      // USA
      fill(230);
      rect(this.x + 8, this.y - 30, 40, 26);
    }
  }

  collidesWith(player) {
    return !(
      player.x + player.w / 2 < this.x ||
      player.x - player.w / 2 > this.x + this.w ||
      player.y + player.h / 2 < this.y ||
      player.y - player.h / 2 > this.y + this.h
    );
  }
}

// Title scene
function drawTitleScene() {
  background(0); 

  stroke(255);
  strokeWeight(2);
  line(width - 60, 90, width - 60, 40); 
  noStroke();
  fill(255);
  triangle(width - 60, 40, width - 35, 50, width - 60, 60); 

  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(36);
  text("Travel Lulu", width / 2, height / 2 - 10);

  textSize(13);
  text("Click to start", width / 2, height / 2 + 15);
}

function drawLevelScene(countryName, sceneNumber) {
  if (sceneNumber === 1 && bg_china) {
    image(bg_china, 0, 0, width, height);
  } else if (sceneNumber === 2 && bg_switzerland) {
    image(bg_switzerland, 0, 0, width, height);
  } else if (sceneNumber === 3 && bg_uk) {
    image(bg_uk, 0, 0, width, height);
  } else if (sceneNumber === 4 && bg_us) {
    image(bg_us, 0, 0, width, height);
  } else {
    background(0);
  }

  for (let p of platforms) {
    p.show();
  }

  goal.show();

  player.update();
  player.show();

  fill(255);
  textAlign(LEFT, TOP);
  textSize(18);
  text(countryName, 15, 15);

  textSize(12);
  text("LEFT / RIGHT to move, UP to jump", 15, 40);

  if (sceneNumber === 1) {
    if (player.x - player.w / 2 > width) {
      scene = 2;
      setupScene(2);
    }
  } else if (sceneNumber === 2) {
    // Switzerland - UK
    if (player.x - player.w / 2 > width) {
      scene = 3;
      setupScene(3);
    }
  } else if (sceneNumber === 3) {
    // UK - USA
    if (player.x - player.w / 2 > width) {
      scene = 4;
      setupScene(4);
    }
  } else if (sceneNumber === 4) {
    // USA - ending
    if (player.x - player.w / 2 > width) {
      scene = 5;
      player.resetPosition(width / 2, 280);
    }
  }
}

 function drawEndingScene() {
  background(0);

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(26);
  text("Thank u 4 traveling with Lulu! ^^", width / 2, 140);
  textSize(18);
  text("China → Switzerland → UK → US → ?", width / 2, 190);
  textSize(14);
  text("Click to play again", width / 2, 250);
}

function setupScene(sceneNumber) {
  platforms = [];

  if (sceneNumber === 1) {
    // China
    platforms.push(new Platform(0, 320, 200, 20)); 
    player.resetPosition(70, 300);
    platforms.push(new Platform(220, 280, 80, 15));
    platforms.push(new Platform(340, 250, 80, 15));
    platforms.push(new Platform(460, 220, 260, 15)); 
    goal = new Goal(520, 190, 70, 50, 1); 
  } else if (sceneNumber === 2) {
    // Switzerland
    player.resetPosition(70, 280);
    platforms.push(new Platform(0, 300, 150, 20));   
    platforms.push(new Platform(230, 300, 120, 20)); 
    platforms.push(new Platform(390, 300, 210, 20));
    goal = new Goal(500, 270, 70, 50, 2); 
  } else if (sceneNumber === 3) {
    // UK
    player.resetPosition(80, 200);
    platforms.push(new Platform(40, 220, 150, 15));  
    platforms.push(new Platform(230, 260, 150, 15));  
    platforms.push(new Platform(420, 300, 260, 15)); 
    goal = new Goal(480, 270, 70, 50, 3); 
} else if (sceneNumber === 4) {
    // USA
    player.resetPosition(60, 300);
    platforms.push(new Platform(0, 320, 120, 20));
    platforms.push(new Platform(120, 280, 80, 15));  
    platforms.push(new Platform(220, 240, 80, 15));  
    platforms.push(new Platform(320, 200, 80, 15));  
    platforms.push(new Platform(480, 300, 160, 20)); 
    goal = new Goal(500, 270, 70, 50, 4);
}
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    player.jump();
  }
}

function mousePressed() {
  if (scene === 0) {
    scene = 1;
    setupScene(1);
  } else if (scene === 5) {
    scene = 0;
  }
}

function drawMiniLulu() {
  push();

  fill(0);
  noStroke();
  ellipse(-10, -5, 10, 18);  
  ellipse(10, -5, 10, 18);   

  fill(255, 242, 230);
  ellipse(0, -15, 30, 30);

  fill(0);
  arc(0, -15, 30, 30, PI, 0);

  fill(255);
  stroke(0);
  strokeWeight(2);
  arc(-7, -12, 14, 12, 0, PI, CHORD);

  fill(255);
  arc(7, -12, 14, 12, 0, PI, CHORD);

  fill(0);
  arc(-7, -12, 6, 5, 0, PI, CHORD);

  fill(0);
  arc(7, -12, 6, 5, 0, PI, CHORD);

  stroke(0);
  strokeWeight(2);
  line(-3, -2, 0, -6);
  line(0, -6, 3, -2);

  pop();
}
