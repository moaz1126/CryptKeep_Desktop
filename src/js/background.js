const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;

canvas.style.width = `${window.innerWidth}px`;
canvas.style.height = `${window.innerHeight}px`;

class Paricle{
    constructor(x, y, effect){
        this.originX = x;
        this.originY = y;
        this.effect = effect;
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.ctx = this.effect.ctx;
        this.ctx.fillStyle = 'white';
        this.vx = 0;
        this.vy = 0;
        this.ease = 0.2;
        this.friction = 0.95;
        this.dx = 0;
        this.dy = 0;
        this.distance = 0;
        this.force = 0;
        this.angle = 0;
        this.size = Math.floor(Math.random() * 5);
        this.draw();
    }   

    draw(){
        this.ctx.beginPath();
        this.ctx.fillRect(this.x, this.y, this.size, this.size)
    }

    update(){
        this.dx = this.effect.mouse.x - this.x;
        this.dy = this.effect.mouse.y - this.y;
        this.distance = this.dx * this.dx + this.dy * this.dy;
        this.force = -this.effect.mouse.radius / this.distance * 8;

        if(this.distance < this.effect.mouse.radius){
            this.angle = Math.atan2(this.dy, this.dx);
            this.vx += this.force * Math.cos(this.angle);
            this.vy += this.force * Math.sin(this.angle);
        }

        this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
        this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
        this.draw()
    }
}


class Effect {
    constructor(width, height, context){
        this.width = width;
        this.height = height;
        this.ctx = context;
        this.particlesArray = [];
        this.gap = 20;
        this.mouse = {
            radius: 3000,
            x: 0,
            y: 0
        }
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX * window.devicePixelRatio;
            this.mouse.y = e.pageY * window.devicePixelRatio;
        })

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth * window.devicePixelRatio;
            canvas.height = window.innerHeight * window.devicePixelRatio;
            this.width = canvas.width
            this.height = canvas.height
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
        
            this.particlesArray = [];
            this.init();
        })
        this.init();
    }

    init(){
        for(let x = 0; x < this.width; x += this.gap){
            for(let y = 0; y < this.height; y += this.gap){
                this.particlesArray.push(new Paricle(x, y, this))
            }
        }
    }

    update(){
        this.ctx.clearRect(0, 0, this.width, this.height);
        for(let i = 0; i < this.particlesArray.length; i++){
            this.particlesArray[i].update();
        }
    }
}

let effect = new Effect(canvas.width, canvas.height, ctx);
function animate(){
    effect.update();
    requestAnimationFrame(animate)
}
animate()



// Select the circle element
const circleElement = document.querySelector('.circle');

// Create objects to track mouse position and custom cursor position
const mouse = { x: 0, y: 0 }; // Track current mouse position
const previousMouse = { x: 0, y: 0 } // Store the previous mouse position
const circle = { x: 0, y: 0 }; // Track the circle position

// Initialize variables to track scaling and rotation
let currentScale = 0; // Track current scale value
let currentAngle = 0; // Track current angle value

// Update mouse position on the 'mousemove' event
window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

const speed = 0.17;

const tick = () => {
  circle.x += (mouse.x - circle.x) * speed;
  circle.y += (mouse.y - circle.y) * speed;
  // Create a transformation string for cursor translation
  const translateTransform = `translate(${circle.x}px, ${circle.y}px)`;

  // SQUEEZE
  // 1. Calculate the change in mouse position (deltaMouse)
  const deltaMouseX = mouse.x - previousMouse.x;
  const deltaMouseY = mouse.y - previousMouse.y;
  // Update previous mouse position for the next frame
  previousMouse.x = mouse.x;
  previousMouse.y = mouse.y;
  // 2. Calculate mouse velocity using Pythagorean theorem and adjust speed
  const mouseVelocity = Math.min(Math.sqrt(deltaMouseX**2 + deltaMouseY**2) * 4, 150); 
  // 3. Convert mouse velocity to a value in the range [0, 0.5]
  const scaleValue = (mouseVelocity / 150) * 0.5;
  // 4. Smoothly update the current scale
  currentScale += (scaleValue - currentScale) * speed;
  // 5. Create a transformation string for scaling
  const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`;

  // ROTATE
  // 1. Calculate the angle using the atan2 function
  const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI;
  // 2. Check for a threshold to reduce shakiness at low mouse velocity
  if (mouseVelocity > 20) {
    currentAngle = angle;
  }
  // 3. Create a transformation string for rotation
  const rotateTransform = `rotate(${currentAngle}deg)`;

  // Apply all transformations to the circle element in a specific order: translate -> rotate -> scale
  circleElement.style.transform = `${translateTransform} ${rotateTransform} ${scaleTransform}`;

  // Request the next frame to continue the animation
  window.requestAnimationFrame(tick);
}

// Start the animation loop
tick();