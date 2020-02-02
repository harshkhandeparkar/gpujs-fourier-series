const scaleCoords = coord => Math.floor(coord * coordScaleFactor) / coordScaleFactor;

let renders = 0; // renders countc
let frames = 0; // frame count
let renderPixelsTex = blankGraph(); // initial black graph rendered pixels texture
let lastBlank;

const deleteTexture = (texture) => {
  if (texture && texture.delete) {
    texture.delete();
  }
}

const doDraw = () => {
  if(doRender) {
    for (let i = 0; i < rendersPerFrame; i++) {
      // complexes = positiveTimePeriodMult(getTex(complexes), speed);
      // complexesNegative = negativeTimePeriodMult(getTex(complexesNegative), speed);


      // const finalComplex = getFinalComplex(complexes, complexesNegative);
      // console.log('+ve', complexes.toArray())
      // console.log('-ve', complexesNegative.toArray())
      // console.log('final', finalComplex.toArray())

      // renderPixelsTex = render(finalComplex, getTex(renderPixelsTex), coordScaleFactor, pointSize);

      const res = new Complex(0, 0); // resultant

      clist.forEach(c => res.add(c)) // Add the nos to the resultant
      clistnegative.forEach(c => res.add(c))

      renders++; // count the rendered frame

      renderPixelsTex = render([res.x, res.y], lastBlank = getTex(renderPixelsTex), coordScaleFactor, pointSize);
      deleteTexture(lastBlank); // Cleanup
      deleteTexture(renderPixelsTex); // Cleanup

      clist.forEach((c, i) => c.multiply(new Complex(1, i * speed))) // next rotation step
      clistnegative.forEach((c, i) => c.multiply(new Complex(1, -(i + 1) * speed)))

      renders++;
    }
    display(renderPixelsTex);
    frames++;
  }
  window.requestAnimationFrame(doDraw);
}

//  Rendering--------------------------------------

document.getElementById('start-stop').onclick = e => {
  e.preventDefault();

  doRender = !doRender;
  e.target.innerText = e.target.innerText === 'Start' ? 'Stop' : 'Start';
  document.getElementById('change').disabled = !document.getElementById('change').disabled;
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

document.getElementById('blank').onclick = e => {
  e.preventDefault();

  doRender = false;
  document.getElementById('start-stop').innerText = 'Start';
  document.getElementById('change').disabled = false;
  renderPixelsTex = blankGraph();
  display(renderPixelsTex);
}

display(renderPixelsTex);
window.requestAnimationFrame(doDraw);

setInterval(() => {
  document.getElementById('frames').innerHTML = `
  ${renders} renders per second <br>
  ${frames} fps <br>
  dimensions: ${dim} x ${dim} <br>
  pointSize: ${pointSize} <br>
  AntiClockwise Nos: ${clist.length - 1} <br>
  Clockwise Nos: ${clistnegative.length}
`;
  frames = 0;
  renders = 0;
}, 1000)