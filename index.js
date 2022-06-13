const canvas = document.getElementById("mycanvas");
const c = canvas.getContext('2d');
const background = document.createElement('img');
const key = [];
canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor(x, y, width, height, color, keys){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.keys = keys;
    }
    draw(){
        c.beginPath();
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.width, this.height);
    }
    move(){
        this.y = key[this.keys.up] ? this.y < 15 ? this.y : this.y - 15 : key[this.keys.down] ? this.y > canvas.height - 215 ? this.y : this.y + 15 : this.y;
    }
    update(){
        ball.velocity = ball.x - this.x;
    }

}

class Ball {
    constructor(x, y, radius, color, velocity, speed, angel){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.speed = speed;
        this.angel = angel;
    }
    draw(){
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fill();
    }
    update(){
        this.x = this.x + this.velocity.x*this.speed;
        this.y = this.y + this.velocity.y*this.speed;
        this.velocity.y = this.y - this.radius < 1 || this.y + this.radius > canvas.height - 1 ? -this.velocity.y : this.velocity.y;

    }
    speedup(){
        this.speed = this.speed + 0.2;
    }
    hit(){
        this.velocity.x = -this.velocity.x;
        console.log({x : ball.x, y: ball.y});
    }
    reset(){
        this.angel = Math.atan2(canvas.height/2 - (Math.random() < 0.5 ? (Math.random() * (canvas.height/2-10)) : (Math.random() * ((canvas.height) - canvas.height/2+10)) + (canvas.height/2+10)), canvas.width/2 - (Math.random() < 0.5 ? 0 : canvas.width));
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.velocity = {x : Math.cos(this.angel), y : Math.sin(this.angel)};
        this.speed = 5;
    }
}

class score{
    constructor(x, y, score1, score2){
        this.x = x;
        this.y = y;
        this.score1 = score1;
        this.score2 = score2;
    }
    draw(){
        c.font = '30px Arial';
        c.fillStyle = "white";
        c.textAlign = "center"; 
        c.fillText(this.score1 +' : '+ this.score2, this.x, this.y);
    }
    player1scoreup(){
        this.score1 = this.score1 + 1;
    }
    player2scoreup(){
        this.score2 = this.score2 + 1;
    }
}

let angel = Math.atan2(canvas.height/2 - (Math.random() < 0.5 ? (Math.random() * (canvas.height/2-10)) : (Math.random() * ((canvas.height) - canvas.height/2+10)) + (canvas.height/2+10)), canvas.width/2-(Math.random() < 0.5 ? 0 : canvas.width));
let player1 = new Player(10, canvas.height/2-100, 20, 200, 'purple', {up : 87 , down : 83});
let player2 = new Player(canvas.width-30, canvas.height/2-100, 20, 200, 'blue', {up : 73, down : 75});
let ball = new Ball(canvas.width/2, canvas.height/2, 20, 'pink', {x : Math.cos(angel), y : Math.sin(angel)}, 5, angel);
let scoreboard = new score(canvas.width/2, 50, 0, 0);
let animation;

function init(){
    angel = Math.atan2(canvas.height/2 - (Math.random() < 0.5 ? (Math.random() * (canvas.height/2-10)) : (Math.random() * ((canvas.height) - canvas.height/2+10)) + (canvas.height/2+10)), canvas.width/2-(Math.random() < 0.5 ? 0 : canvas.width));
    player1 = new Player(10, canvas.height/2-100, 20, 200, 'purple', {up : 87 , down : 83});
    player2 = new Player(canvas.width-30, canvas.height/2-100, 20, 200, 'blue', {up : 73, down : 75});
    ball = new Ball(canvas.width/2, canvas.height/2, 20, 'pink', {x : Math.cos(angel), y : Math.sin(angel)}, 5, angel);
    scoreboard = new score(canvas.width/2, 50, 0, 0);
    addEventListener('keydown', function (e) {
        key[e.keyCode] = true;
    });
    addEventListener('keyup', function (e) {
        key[e.keyCode] = false;
    });
    canvas.onclick = null;
    animate();
    increasespeed();
    
}

function gamereset(){
    gamedes();
    cancelAnimationFrame(animation)
}

function animate(){
    animation = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(background, 0, 0, canvas.width,  canvas.height);
    ball.draw();
    ball.update();
    player1.draw();
    player2.draw(); 
    player1.move();
    player2.move();
    scoreboard.draw();
    scoreboard.score2 > 6 ? gamereset() : null;
    scoreboard.score1 > 6 ? gamereset() : null;
    //For the collsion system https://stackoverflow.com/questions/20885297/collision-detection-in-html5-canvas
    const distX1 = Math.abs(ball.x - player1.x - player1.width/2);
    const distY1 = Math.abs(ball.y - player1.y - player1.height/2);
    const distX2 = Math.abs(ball.x - player2.x - player2.width/2);
    const distY2 = Math.abs(ball.y - player2.y - player2.height/2);
    if(player1.width/2 + ball.radius > distX1 && player1.height/2 + ball.radius > distY1){
        ball.hit();
    }
    if(player2.width/2 + ball.radius > distX2 && player2.height/2 + ball.radius > distY2){
        ball.hit();
    }
    if(ball.x - ball.radius < 0){
        scoreboard.player2scoreup();
        scoreboard.score2 == 7 ? null : ball.reset();
    }
    if(ball.x + ball.radius > canvas.width){
        scoreboard.player1scoreup();
        scoreboard.score1 == 7 ? null : ball.reset();
    }
}

function increasespeed(){
    setInterval(() => {ball.speedup()} , 500);
}

function gamedes(){
    c.font = '50px Calibri';
    c.fillStyle = "white";
    c.textAlign = "center"; 
    c.fillText('Click the Screen to Start the Game', canvas.width/2, canvas.height/2-50);
    c.fillText('First to Seven Win', canvas.width/2, canvas.height/2);
    c.fillText('Controls',canvas.width/2, canvas.height/2+50);
    c.fillText('Player 1 UP : \' W \' DOWN \' S \'', canvas.width/2, canvas.height/2+100);
    c.fillText('Player 2 UP : \' I \' Down : \' K \'', canvas.width/2, canvas.height/2+150);
    console.log('test');
    canvas.onclick = init;
}

background.src = 'background.jpg';
background.onload = () => {
    c.drawImage(background, 0, 0, canvas.width,  canvas.height);
    gamedes();
}
