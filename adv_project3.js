let video;

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("sketch-container");

  video = createCapture(VIDEO);
  video.size(600, 600);
  video.hide();
}

function draw() {
  background(0);

  if (video) {
    image(video, 0, 0, width, height);
  }
}
