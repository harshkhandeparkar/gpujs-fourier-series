class Complex {
  constructor(r, theta) {// r -> modulus; theta -> argument
    this.r = r;
    this.theta = theta;

    this.x = this.r*Math.cos(this.theta);
    this.y = this.r*Math.sin(this.theta);
  }

  add(n) {
    this.x +=n.x;
    this.y +=n.y;

    this.r = Math.sqrt(
      Math.pow(this.x, 2) +
      Math.pow(this.y, 2)
    )

    this.theta = Math.sinh(this.y / this.r);
    
    return this;
  }

  subtract(n) {
    this.x -= n.x;
    this.y -= n.y;

    this.r = Math.sqrt(
      Math.pow(this.x, 2) +
      Math.pow(this.y, 2)
    )

    this.theta = Math.sinh(this.y / this.r);

    return this;
  }

  multiply(n) {
    this.theta += n.theta;
    this.r *= n.r;
    this.x = this.r*Math.cos(this.theta);
    this.y = this.r*Math.sin(this.theta);

    return this;
  }

  divide(n) {
    this.theta -= n.theta;
    this.r /= n.r;
    this.x = this.r*Math.cos(this.theta);
    this.y = this.r*Math.sin(this.theta);

    return this;
  }

  conjugate() {
    this.y = -this.y;
    return this;
  }
}