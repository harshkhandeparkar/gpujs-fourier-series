const render = gpu.createKernel(function (finalComplex, pixels, coordScaleFactor, pointSize) {
  let out = pixels[this.thread.y][this.thread.x];

  if (
    Math.abs(finalComplex[0] - (this.thread.x - this.constants.centerX) / coordScaleFactor) < pointSize &&
    Math.abs(finalComplex[1] - (this.thread.y - this.constants.centerY) / coordScaleFactor) < pointSize
  ) out = this.constants.color;

  return out;
},
  {
    output: [dim, dim],
    pipeline: true,
    constants: {centerX, centerY, color}
  }
)

// Graphics Kernels
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

// // Complex Calc Kernels
// const positiveTimePeriodMult = gpu.createKernel(function(complexes, speed) { // complexes is a 2d array with 1st dimension being the index of the no and the second being [Re, Im, Modulus]
//   const x = this.thread.x,
//     y = this.thread.y;

//   const r = Math.sqrt(Math.pow(complexes[y][0], 2) + Math.pow(complexes[y][1], 2));

//   if (x == 0) return Math.cos(complexes[y][2] + speed*y)*r;
//   if (x == 1) return Math.sin(complexes[y][2] + speed*y)*r;
//   if (x == 2) return complexes[y][2] + speed*y;
// }, 
// {
//   output: [3, clist.length],
//   pipeline: true
// })

// const negativeTimePeriodMult = gpu.createKernel(function(complexes, speed) { // complexes is a 2d array with 1st dimension being the index of the no and the second being [Re, Im, Modulus]
//   const x = this.thread.x,
//     y = this.thread.y;

//   const r = Math.sqrt(Math.pow(complexes[y][0], 2) + Math.pow(complexes[y][1], 2));

//   if (x == 0) return Math.cos(complexes[y][2] - speed*y)*r;
//   if (x == 1) return Math.sin(complexes[y][2] - speed*y)*r;
//   if (x == 2) return complexes[y][2] - speed*y;

// },
// {
//   output: [3, clistnegative.length],
//   pipeline: true
// })

// const getFinalComplex = gpu.createKernel(function(complexes, complexesNegative) {
//   const x = this.thread.x;
//   let sum = 0;
  
//   if (x == 0) {
//     for (let i = 0; i < this.constants.positive; i++) sum += complexes[i][0];
//     for (let i = 0; i < this.constants.negative; i++) sum += complexesNegative[i][0];
//   }
//   if (x == 1) {
//     for (let i = 0; i < this.constants.positive; i++) sum += complexes[i][1];
//     for (let i = 0; i < this.constants.negative; i++) sum += complexesNegative[i][1];
//   }

//   return sum;
// },
// {
//   output: [2],
//   constants: {
//     positive: clist.length,
//     negative: clistnegative.length
//   },
//   pipeline: true
// })
