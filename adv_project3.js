let model;
let modelURL = "https://teachablemachine.withgoogle.com/models/Tt7cjFUxF/";

let video;
let overlay;

let startButton;
let clearButton;
let instructionText;
let statusText;
let titleText;

let cameraStarted = false;
let modelLoaded = false;
let isPredicting = false;
let hasTriedModelLoad = false;

let currentSubtitle = "";
let currentStatus = "Camera off";
let subtitleTimer = 0;
let subtitleDuration = 180;

let label = "idle";
let confidence = 0;

let stableLabel = "";
let stableCount = 0;
let lastTriggeredLabel = "";

const CANVAS_W = 600;
const CANVAS_H = 600;

function setup() {
  let canvas = createCanvas(CANVAS_W, CANVAS_H);
  canvas.parent("sketch-container");

  overlay = createGraphics(CANVAS_W, CANVAS_H);

  setupDOM();
}

function draw() {
  background(0);

  if (cameraStarted && video) {
    drawCamera();
  } else {
    drawCameraPlaceholder();
  }

  drawDarkGradient();
  drawOverlayUI();
  image(overlay, 0, 0);

  handleSubtitleTimer();
}

function setupDOM() {
  titleText = createDiv("Sign Subtitle Camera");
  titleText.parent("sketch-container");
  titleText.position(24, 20);
  titleText.style("color", "white");
  titleText.style("font-size", "24px");
  titleText.style("font-family", "Inter, Arial, sans-serif");
  titleText.style("font-weight", "600");
  titleText.style("letter-spacing", "0.04em");
  titleText.style("z-index", "10");
  titleText.style("pointer-events", "none");

  instructionText = createDiv(
    "Show a trained gesture to the camera:<br>hi / yes / love<br><br>Keyboard backup:<br>1 = HELLO<br>2 = YES<br>3 = LOVE"
  );
  instructionText.parent("sketch-container");
  instructionText.position(24, 58);
  instructionText.style("color", "rgba(255,255,255,0.88)");
  instructionText.style("font-size", "13px");
  instructionText.style("line-height", "1.5");
  instructionText.style("font-family", "Inter, Arial, sans-serif");
  instructionText.style("max-width", "220px");
  instructionText.style("z-index", "10");
  instructionText.style("pointer-events", "none");

  statusText = createDiv("Status: Camera off");
  statusText.parent("sketch-container");
  statusText.position(360, 20);
  statusText.style("color", "white");
  statusText.style("font-size", "13px");
  statusText.style("text-align", "right");
  statusText.style("font-family", "Inter, Arial, sans-serif");
  statusText.style("width", "216px");
  statusText.style("z-index", "10");
  statusText.style("pointer-events", "none");

  startButton = createButton("Start Camera");
  startButton.parent("sketch-container");
  startButton.position(24, 548);
  startButton.mousePressed(startCamera);
  styleButton(startButton);

  clearButton = createButton("Clear Subtitle");
  clearButton.parent("sketch-container");
  clearButton.position(140, 548);
  clearButton.mousePressed(clearSubtitle);
  styleButton(clearButton);
}

function styleButton(btn) {
  btn.style("background", "rgba(255,255,255,0.12)");
  btn.style("color", "white");
  btn.style("border", "1px solid rgba(255,255,255,0.24)");
  btn.style("padding", "10px 14px");
  btn.style("border-radius", "999px");
  btn.style("font-size", "12px");
  btn.style("font-family", "Inter, Arial, sans-serif");
  btn.style("letter-spacing", "0.04em");
  btn.style("cursor", "pointer");
  btn.style("backdrop-filter", "blur(6px)");
  btn.style("z-index", "20");
}

async function startCamera() {
  if (cameraStarted) return;

  try {
    currentStatus = "Starting camera...";
    updateStatus();

    video = createCapture(VIDEO, () => {
      video.size(CANVAS_W, CANVAS_H);
      video.hide();
      cameraStarted = true;
      currentStatus = "Camera on";
      updateStatus();

      if (!hasTriedModelLoad) {
        loadModel();
      }
    });

    video.size(CANVAS_W, CANVAS_H);
    video.hide();
  } catch (error) {
    console.error("Camera error:", error);
    currentStatus = "Camera error";
    updateStatus();
  }
}

async function loadModel() {
  hasTriedModelLoad = true;

  if (typeof tmImage === "undefined") {
    console.error("tmImage is not loaded.");
    currentStatus = "Model lib missing";
    updateStatus();
    return;
  }

  try {
    currentStatus = "Loading model...";
    updateStatus();

    const modelURLFile = modelURL + "model.json";
    const metadataURL = modelURL + "metadata.json";

    model = await tmImage.load(modelURLFile, metadataURL);
    modelLoaded = true;

    currentStatus = "Waiting...";
    updateStatus();

    startPredictionLoop();
  } catch (error) {
    console.error("Model load error:", error);
    modelLoaded = false;
    currentStatus = "Model failed, keyboard works";
    updateStatus();
  }
}

function startPredictionLoop() {
  if (isPredicting || !modelLoaded) return;
  isPredicting = true;
  predictLoop();
}

async function predictLoop() {
  while (cameraStarted && modelLoaded && video && video.elt && isPredicting) {
    try {
      await predict();
    } catch (error) {
      console.error("Prediction error:", error);
      currentStatus = "Prediction error";
      updateStatus();
      break;
    }
    await sleep(120);
  }

  isPredicting = false;
}

async function predict() {
  if (!model || !video || !video.elt) return;

  const predictions = await model.predict(video.elt);

  let bestPrediction = predictions[0];

  for (let i = 1; i < predictions.length; i++) {
    if (predictions[i].probability > bestPrediction.probability) {
      bestPrediction = predictions[i];
    }
  }

  label = bestPrediction.className;
  confidence = bestPrediction.probability;

  handleStablePrediction(label, confidence);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clearSubtitle() {
  currentSubtitle = "";
  subtitleTimer = 0;
  currentStatus = cameraStarted
    ? (modelLoaded ? "Waiting..." : "Camera on")
    : "Subtitle cleared";
  updateStatus();
}

function drawCamera() {
  if (!video) return;

  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();
}

function drawCameraPlaceholder() {
  push();
  fill(18);
  rect(0, 0, width, height);

  fill(255, 255, 255, 70);
  stroke(255, 255, 255, 40);
  rect(40, 160, width - 80, height - 260, 24);

  noStroke();
  fill(255, 255, 255, 150);
  textAlign(CENTER, CENTER);
  textSize(20);
  textFont("Inter");
  text("Click 'Start Camera' to begin", width / 2, height / 2);
  pop();
}

function drawDarkGradient() {
  push();
  noStroke();

  for (let y = 0; y < height; y += 8) {
    let alphaTop = map(y, 0, height * 0.22, 150, 0, true);
    let alphaBottom = map(y, height * 0.68, height, 0, 190, true);
    let alpha = max(alphaTop, alphaBottom);
    fill(0, alpha);
    rect(0, y, width, 8);
  }

  pop();
}

function drawOverlayUI() {
  overlay.clear();
  drawFramingCorners();
  drawSubtitleBox();
  drawStatusPanel();
}

function drawFramingCorners() {
  overlay.push();
  overlay.stroke(255, 255, 255, 130);
  overlay.strokeWeight(2);
  overlay.noFill();

  let m = 18;
  let len = 26;

  overlay.line(m, m, m + len, m);
  overlay.line(m, m, m, m + len);

  overlay.line(width - m, m, width - m - len, m);
  overlay.line(width - m, m, width - m, m + len);

  overlay.line(m, height - m, m + len, height - m);
  overlay.line(m, height - m, m, height - m - len);

  overlay.line(width - m, height - m, width - m - len, height - m);
  overlay.line(width - m, height - m, width - m, height - m - len);

  overlay.pop();
}

function drawSubtitleBox() {
  if (currentSubtitle === "") return;

  let boxW = min(width * 0.72, 460);
  let boxH = 76;
  let boxX = width / 2 - boxW / 2;
  let boxY = height - 112;

  overlay.noStroke();
  overlay.fill(0, 0, 0, 175);
  overlay.rect(boxX, boxY, boxW, boxH, 18);

  overlay.fill(255);
  overlay.textAlign(CENTER, CENTER);
  overlay.textSize(28);
  overlay.textStyle(BOLD);
  overlay.textFont("Inter");
  overlay.text(currentSubtitle, width / 2, boxY + boxH / 2);
}

function drawStatusPanel() {
  let panelW = 220;
  let panelH = 96;
  let panelX = width - panelW - 18;
  let panelY = 50;

  overlay.noStroke();
  overlay.fill(0, 0, 0, 120);
  overlay.rect(panelX, panelY, panelW, panelH, 16);

  overlay.fill(255);
  overlay.textAlign(LEFT, TOP);
  overlay.textSize(12);
  overlay.textStyle(NORMAL);
  overlay.textFont("Inter");

  overlay.text("Current status", panelX + 14, panelY + 12);
  overlay.text(currentStatus, panelX + 14, panelY + 30);
  overlay.text("Prediction: " + label, panelX + 14, panelY + 52);
  overlay.text(
    "Confidence: " + nf(confidence * 100, 2, 1) + "%",
    panelX + 14,
    panelY + 70
  );
}

function handleSubtitleTimer() {
  if (subtitleTimer > 0) {
    subtitleTimer--;
    if (subtitleTimer === 0) {
      currentSubtitle = "";
      currentStatus = cameraStarted
        ? (modelLoaded ? "Waiting..." : "Camera on")
        : "Camera off";
      updateStatus();
    }
  }
}

function triggerSubtitle(word) {
  currentSubtitle = word;
  subtitleTimer = subtitleDuration;
  currentStatus = `Detected: ${word}`;
  updateStatus();
}

function updateStatus() {
  if (statusText) {
    statusText.html(`Status: ${currentStatus}`);
  }
}

function handleStablePrediction(currentLabel, currentConfidence) {
  if (currentConfidence < 0.85) {
    stableLabel = "";
    stableCount = 0;
    return;
  }

  if (currentLabel === stableLabel) {
    stableCount++;
  } else {
    stableLabel = currentLabel;
    stableCount = 1;
  }

  if (currentLabel === "idle") {
    lastTriggeredLabel = "";
    return;
  }

  if (stableCount > 6 && currentLabel !== lastTriggeredLabel) {
    if (currentLabel === "hi") {
      triggerSubtitle("HELLO");
    } else if (currentLabel === "yes") {
      triggerSubtitle("YES");
    } else if (currentLabel === "love") {
      triggerSubtitle("LOVE");
    }

    lastTriggeredLabel = currentLabel;
  }
}

function keyPressed() {
  if (!cameraStarted) return;

  if (key === "1") {
    triggerSubtitle("HELLO");
  } else if (key === "2") {
    triggerSubtitle("YES");
  } else if (key === "3") {
    triggerSubtitle("LOVE");
  }
}

function windowResized() {
  resizeCanvas(CANVAS_W, CANVAS_H);
  overlay = createGraphics(CANVAS_W, CANVAS_H);

  if (titleText) titleText.position(24, 20);
  if (instructionText) instructionText.position(24, 58);
  if (statusText) statusText.position(360, 20);
  if (startButton) startButton.position(24, 548);
  if (clearButton) clearButton.position(140, 548);
}
