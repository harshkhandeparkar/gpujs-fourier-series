const canvas = document.getElementById('main-canvas');
const gpu = new GPU({
  canvas,
  mode: 'gpu'
})

let dim = 1000, // dimensions
  centerX = dim / 2,
  centerY = dim / 2,
  bg = 0, // backgroundColor: 0 to 1(greyscale)
  color = 1, // color of the point: 0 to 1(greyscale)
  speed = 0.001, // Angle Step in radians
  doRender = false,
  rendersPerFrame = 20,
  pi = Math.PI,
  pointSize = 0.1, // Size of the point/brush
  coordScaleFactor = 20; // Coordinates are multiplied by this(makes the graphs bigger or smaller)

document.getElementById('speed').value = speed;
document.getElementById('rend-per-frame').value = rendersPerFrame;
document.getElementById('pt-size').value = pointSize;
document.getElementById('coord-scale-factor').value = coordScaleFactor;


// complex nos with -ve time periods(clockwise) starting with -1, -2....
let clistnegative = [
  new Complex(2.0, pi),
  new Complex(4.5, 0),
  new Complex(2.5, pi),
  new Complex(0.0, pi),
  new Complex(1.5, 0)
]

// complex nos 1with non-negative time periods(anti-clockwise) staring with 0, 1, 2...
let clist = [
  new Complex(1.0, 0),
  new Complex(0.0, 0),
  new Complex(4.5, 0),
  new Complex(5.0, pi),
  new Complex(5.5, 0)
]