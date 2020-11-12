import * as PIXI from 'pixi.js'

let app = new PIXI.Application({
  width: 256,
  height: 256,
  antialias: true,
  // transparent: true,
  resolution: 1,
});

document.body.appendChild(app.view);

app.renderer.backgroundColor = 0x061639;
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

const loader = new PIXI.Loader();
loader.add('ball', 'assets/ball.png');
loader.add('star', 'assets/yellow.png');
loader.add('clouds', 'assets/clouds.png');
loader.add('finish', 'assets/pixiePerilousness.png');
loader.load(setup);

function init() {
  //
}

let state = init;
let res;
let ball;
let clouds;
let finish;
let background;
function setup(loader, resources) {
  res = resources;
  clouds = new PIXI.Sprite(res.clouds.texture);
  clouds.width = 2000;
  clouds.height = window.innerHeight;
  clouds.x = 0;
  clouds.y = 0;

  finish = new PIXI.Sprite(res.finish.texture);
  finish.width = 2000;
  finish.height = window.innerHeight;
  finish.x = 2000;
  finish.y = 0;

  background = new PIXI.Container();
  background.addChild(clouds);
  background.addChild(finish);
  background.width = 4000;
  background.height = window.innerHeight;
  background.zIndex = 1;
  background.vx = 0;
  background.vy = 0;

  ball = new PIXI.Sprite(res.ball.texture);
  ball.width = 50;
  ball.height = 50;
  // ball.x = 160;
  // ball.y = 160;
  ball.vx = 0;
  ball.vy = 0;
  ball.position.set(160, 160);
  // ball.visible = false;
  // ball.anchor.x = 0.5;
  // ball.anchor.y = 0.5;
  ball.anchor.set(0.5, 0.5);
  ball.interactive = true;
  // ball.on('mousedown', () => {
  //   console.log('mousedown');
  // });
  ball.mousedown = ball.touchstart = ballMousedownHandler;
  ball.mouseup = ball.touchend = ballMouseupHandler;
  ball.mousemove = ball.touchmove = function(e) {
    if (!this.isDown) return;
    console.log('move', e);
    this.x = e.data.global.x;
    this.force = (this.x - this.preX) * 0.1;
    console.log('force', this.force);
    this.preX = this.x;
    // this.y = e.data.global.y;
  }
  ball.zIndex = 2;

  app.stage.addChild(background);
  app.stage.addChild(ball);
  state = play;
  app.ticker.add(gameLoop);
}

function ballMousedownHandler() {
  this.isDown = true;
  this.texture = res.star.texture;
  this.alpha = 1;
  this.vx = 0;
}

function ballMouseupHandler() {
  this.isDown = false;
  this.texture = res.ball.texture;
  this.alpha = 1;
}

window.addEventListener('mouseup', () => {
  ball.mouseup();
});

function gameLoop(delta) {
  state(delta);
}

const velocity = 10;
function play(delta) {
    if (ball.isDown) {
      return;
    }
    if (ball.force > 0) {
      ball.force -= 0.01;
    } else {
      ball.force = 0;
    }
    ball.y += ball.vy;
    // ball.vx = velocity * ball.force;
    ball.x += ball.vx;
    console.log('ball.force', ball.force, ball.x, ball.vx);

    background.y += background.vy;
    background.vx = velocity * ball.force;
    background.x += -background.vx;
    ball.rotation += velocity * ball.force * 0.01;
}