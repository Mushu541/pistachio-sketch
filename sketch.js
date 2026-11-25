let img;
let img_bg;
let opaque = [];
let points = [];
let numPoints = 15;
let r = 3;
let d; // center-to-center spacing
let maxPoints = 3000;
let mouseMoving = false;

async function setup() {
  img_bg = await loadImage("tree.JPG");
  img = await loadImage("tree_cutout_compressed.png");
  createCanvas(1152, 768);
  img_bg.resize(width, 0);
  img.resize(width, 0);
  img.loadPixels();

  d = r * 2 + 1; // diameter + small gap

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      if (img.pixels[(y * img.width + x) * 4 + 3] > 128) opaque.push([x, y]);
    }
  }

  for (let i = 0; i < numPoints; i++) {
    const [x, y] = random(opaque);
    // a = lattice rotation, born = frame it appeared (for fade-in)
    points.push({ x, y, a: random(TWO_PI), born: 0 });
  }
}

function draw() {
  mouseCheck();
  background(200);
  image(img_bg, 0, 0);
  image(img, 0, 0);

  // grow slowly: one new point every 3 frames
  if (frameCount % 3 === 0 && points.length < maxPoints) grow();

  fill(255,100);
  stroke(255);
  strokeWeight(1);
  for (const p of points) {
    const t = min(1, (frameCount - p.born) / 20); // 20-frame grow-in
    circle(p.x, p.y, r * 2 *t);
  }
}

function grow() {
  // implement mouse moiving
  if (mouseMoving == true) {
    for (let tries = 0; tries < 1; tries++) {
      const parent = random(points);
      const k = floor(random(6));
      const ang = parent.a + (k * TWO_PI) / 6; // one of 6 hex directions
      const x = parent.x + cos(ang) * d;
      const y = parent.y + sin(ang) * d;

      if (isOpaque(x, y) && !tooClose(x, y)) {
        points.push({ x, y, a: parent.a, born: frameCount });
        return;
      }
    }
  }
}

function isOpaque(x, y) {
  x = round(x);
  y = round(y);
  if (x < 0 || y < 0 || x >= img.width || y >= img.height) return false;
  return img.pixels[(y * img.width + x) * 4 + 3] > 128;
}

function tooClose(x, y) {
  for (const p of points) {
    if (dist(x, y, p.x, p.y) < d * 0.9) return true; // 0.9 absorbs float error
  }
  return false;
}

function  mouseCheck() {
if ( dist(mouseX,mouseY,pmouseX,pmouseY)>0) {
  mouseMoving=true;}
  else {
  mouseMoving=false;
  }
}
  
