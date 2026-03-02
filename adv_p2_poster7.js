function makePoster7(p) {
  let font;
  let word = "RANDOM";
  let fs = 140;

  let dots = [];
  let wordCenter;
  let trigger = 170;

  p.preload = () => {
    font = p.loadFont("Fredoka-Regular.ttf");
  };

  p.setup = () => {
    const c = p.createCanvas(600, 600);
    c.parent("canvas-p7");
    buildWord();
  };

  function buildWord() {
    dots = [];

    p.textFont(font);

    // Auto scale so the word fits
    fs = 160;
    p.textSize(fs);
    while (p.textWidth(word) > p.width * 0.86) {
      fs -= 6;
      p.textSize(fs);
    }

    // Center the word precisely
    let b = font.textBounds(word, 0, 0, fs);
    let x = p.width / 2 - (b.x + b.w / 2);
    let y = p.height / 2 - (b.y + b.h / 2);

    let pts = font.textToPoints(word, x, y, fs, {
      sampleFactor: 0.20,
      simplifyThreshold: 0
    });

    // Word center (average of points)
    let sx = 0, sy = 0;
    for (let pt of pts) { sx += pt.x; sy += pt.y; }
    wordCenter = p.createVector(sx / pts.length, sy / pts.length);

    for (let pt of pts) {
      dots.push(new Dot(pt.x, pt.y));
    }
  }

  p.draw = () => {
    p.background(20);

    let d = p.dist(p.mouseX, p.mouseY, wordCenter.x, wordCenter.y);
    let raw = p.constrain(p.map(d, trigger, 0, 0, 1), 0, 1);
    let shatter = Math.pow(raw, 0.22);

    for (let dot of dots) {
      dot.update(shatter);
      dot.display();
    }
  };

  class Dot {
    constructor(x, y) {
      this.home = p.createVector(x, y);
      this.pos = p.createVector(x, y);

      this.dest = p.createVector(p.random(p.width), p.random(p.height));
      this.seed = p.random(1000);
    }

    update(shatter) {
      let tx = p.lerp(this.home.x, this.dest.x, shatter);
      let ty = p.lerp(this.home.y, this.dest.y, shatter);

      let j = (p.noise(this.seed, p.frameCount * 0.03) - 0.5) * 16 * shatter;
      tx += j;
      ty -= j * 0.6;

      let speedOut = 0.30;
      let speedBack = 0.12;
      let spd = shatter > 0.02 ? speedOut : speedBack;

      this.pos.x = p.lerp(this.pos.x, tx, spd);
      this.pos.y = p.lerp(this.pos.y, ty, spd);
    }

    display() {
      p.stroke(255);
      p.strokeWeight(2);
      p.point(this.pos.x, this.pos.y);
    }
  }

  // Press R to re-randomize
  p.keyPressed = () => {
    if (p.key === "r" || p.key === "R") buildWord();
  };
}

// ✅ 实例化
new p5(makePoster7);
