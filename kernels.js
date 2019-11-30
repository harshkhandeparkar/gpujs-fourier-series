const render = gpu.createKernel(function (x, y, pixels, coordScaleFactor, pointSize) {
  let out = pixels[this.thread.y][this.thread.x];

  if (
    Math.abs(x - (this.thread.x - this.constants.centerX) / coordScaleFactor) < pointSize &&
    Math.abs(y - (this.thread.y - this.constants.centerY) / coordScaleFactor) < pointSize
  ) out = this.constants.color;

  return out;
},
  {
    output: [dim, dim],
    pipeline: true,
    constants: {dim, centerX, centerY, color}
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
  constants: {centerX, centerY, bg}
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