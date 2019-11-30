const canvas = document.getElementById('main-canvas');
const gpu = new GPU({
  canvas,
  mode: 'gpu'
})

let dim = 1000,
  centerX = dim / 2,
  centerY = dim / 2,
  bg = 0,
  color = 1,
  speed = 0.001,
  doRender = false,
  rendersPerFrame = 20,
  pi = Math.PI,
  pointSize = 0.2,
  coordScaleFactor = 20;

document.getElementById('speed').value = speed;
document.getElementById('rend-per-frame').value = rendersPerFrame;
document.getElementById('pt-size').value = pointSize;
document.getElementById('coord-scale-factor').value = coordScaleFactor;

const scaleCoords = coord => Math.floor(coord * coordScaleFactor) / coordScaleFactor;

const render = gpu.createKernel(function (x, y, pixels, coordScaleFactor, pointSize) {
  let out = pixels[this.thread.y][this.thread.x]; // default color: background

  if (
    Math.abs(x - (this.thread.x - this.constants.centerX) / coordScaleFactor) < pointSize &&
    Math.abs(y - (this.thread.y - this.constants.centerY) / coordScaleFactor) < pointSize
  ) out = this.constants.color;

  return out;
},
  {
    output: [dim, dim],
    pipeline: true,
    constants: {
      dim,
      centerX,
      centerY,
      color
    }
  }
)

const blankGraph = gpu.createKernel(function() { // Create the starting blank graph with axes
  if ( // Coordinate Axes
    this.thread.x == this.constants.centerX ||
    this.thread.y == this.constants.centerY
  ) return 0.5;
  else return this.constants.bg;
},
{
  output: [dim, dim],
  pipeline: true,
  constants: {
    centerX,
    centerY,
    bg
  }
})

const getTex = gpu.createKernel(function(tex) { // get a separate texture so that source and destination textures should not match
  return tex[this.thread.y][this.thread.x];
},
{
  output: [dim, dim],
  pipeline: true
})

const display = gpu.createKernel(function(pixels) { // Display the pixels on the canvas
  const color = pixels[this.thread.y][this.thread.x];
  this.color(color, color, color);
},
{
  output: [dim, dim],
  graphical: true
})

// complex nos with -ve time periods(clockwise) starting with -1, -2....
let clistnegative = [
  new Complex(2.0, pi),
  new Complex(4.5, 0),
  new Complex(2.5, pi/2),
  new Complex(0, pi),
  new Complex(1.5, 0)
]

// complex nos 1with non-negative time periods(anti-clockwise) staring with 0, 1, 2...
let clist = [
  new Complex(1.0, 0),
  new Complex(0.0, 0),
  new Complex(4.5, 0),
  new Complex(5.0, pi/2),
  new Complex(5.5, 0)
]

let renders = 0; // renders count
let frames = 0; // frame count
let renderPixelsTex = blankGraph(); // initial black graph rendered pixels texture

const doDraw = () => {
  if(doRender) {
    for (let i = 0; i < rendersPerFrame; i++) {
      const res = new Complex(0, 0); // resultant

      clist.forEach(c => res.add(c)) // Add the nos to the resultant
      clistnegative.forEach(c => res.add(c))

      renders++; // count the rendered frame

      renderPixelsTex = render(res.x, res.y, getTex(renderPixelsTex), coordScaleFactor, pointSize);

      clist.forEach((c, i) => c.multiply(new Complex(1, i * speed))) // next rotation step
      clistnegative.forEach((c, i) => c.multiply(new Complex(1, -(i + 1) * speed)))
    }
    display(renderPixelsTex);
    frames++;
  }
  window.requestAnimationFrame(doDraw);
}

//  Rendering--------------------------------------

document.getElementById('start-stop').onclick = e => {
  e.preventDefault();
  
  if (doRender) {
    doRender = false;
    e.target.innerText = 'Start';
    document.getElementById('change').disabled = false;
  }
  else {
    doRender = true;
    e.target.innerText = 'Stop';
    document.getElementById('change').disabled = true;
  }
}

document.getElementById('restart').onclick = e => {
  e.preventDefault();

  doRender = false;
  renderPixelsTex = blankGraph();
  doRender = true;
  document.getElementById('start-stop').innerText = 'Stop';
  document.getElementById('change').disabled = true;
}

document.getElementById('change').onclick = e => {
  e.preventDefault();

  speed = document.getElementById('speed').value;
  rendersPerFrame = document.getElementById('rend-per-frame').value;
  pointSize = document.getElementById('pt-size').value;
  coordScaleFactor = document.getElementById('coord-scale-factor').value;
}

window.requestAnimationFrame(doDraw);

setInterval(() => {
  document.getElementById('frames').innerHTML = `
  ${renders} renders per second <br>
  ${frames} fps <br>
  speed/step per render: ${speed} <br>
  rendersPerFrame: ${rendersPerFrame} <br>
  dimensions: ${dim} x ${dim} <br>
  coordScaleFactor: ${coordScaleFactor} <br>
  pointSize: ${pointSize}
`;
  frames = 0;
  renders = 0;
}, 1000)