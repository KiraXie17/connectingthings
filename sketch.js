var face = [];
var position = {x:0, y:0};
var scale = 0;
var orientation = {x:0, y:0, z:0};
var mouthWidth = 0;
var mouthHeight = 0;
var eyebrowLeft = 0;
var eyebrowRight = 0;
var eyeLeft = 0;
var eyeRight = 0;
var jaw = 0;
var nostrils = 0;
var ellip = [];
var numellipes = 50;
var cir;

function setup() {
  	createCanvas(1000, 400);
	setupOsc(8338, 3334);
	for (i = 0;i<numellipes;i++){
		r = new EllipObj(random(width),random(height), 50, 50);
		ellip.push(r);
	}
	cir = new circleObj(position.x,position.y, 20);
	
	console.log(ellip);
}

function draw() {
	  //background(255);
	  //rectMode(CENTER);
	  //noStroke();
	  //var mouth = map(mouthHeight,1,3,0,255);
	  //fill(mouth, mouth,100);
	  //ellipse(position.x, position.y,20,20);
	  //for (i = 0;i)
	  //img()

	// FACE_OUTLINE : 0 - 16
	// LEFT_EYEBROW : 17 - 21
	// RIGHT_EYEBROW : 22 - 26
	// NOSE_BRIDGE : 27 - 30
	// NOSE_BOTTOM : 31 - 35
	// LEFT_EYE : 36 - 41
	// RIGHT_EYE : 42 - 47
	// INNER_MOUTH : 48 - 59
	// OUTER_MOUTH : 60 - 65	
	background(255);
	for (i = 0; i<numellipes;i++){
		ellip[i].display();
		ellip[i].collide(cir);	
	}
	cir.disp(position.x,position.y);
	//cir = ellipse(position.x,position.y,20,20);
	
}
class EllipObj{
	constructor(tempX, tempY, tempWidth,tempHeight){
		this.x = tempX;
		this.y = tempY;
		this.w = tempWidth;
		this.h = tempHeight;
		this.color = color(random(255),random(255),random(255));
		this.hit = false;

	}
	display(){
		noStroke();
		fill(this.color);
		this.x += 3;
		if (this.x > windowWidth){
			this.x = -this.w;
		}
		ellipse(this.x,this.y,this.w,this.h);
		

	}
	collide(obj){
		this.hit = collideRectCircle(this.x, this.y, this.w, this.h, obj.x, obj.y, obj.dia)
		
		if(this.hit){
			this.color = color(0)
		}

	}
}
class circleObj{
	constructor(dia){
		this.dia = dia;
		this.color = color(random(255),random(255),random(255));
		this.x;
		this.y;

	}
	disp(tempX, tempY){
		this.x = tempX;
		this.y = tempY;
		noStroke();
		fill(this.color);
		ellipse(this.x,this.y,this.dia,this.dia);
	}
	
}

function receiveOsc(address, value) {
	if (address == '/raw') {
		face = [];
		for (var i=0; i<value.length; i+=2) {
			face.push({x:value[i], y:value[i+1]});
		}
	}
	else if (address == '/pose/position') {
		position = {x:value[0], y:value[1]};
		
	}
	else if (address == '/pose/scale') {
		scale = value[0];
	}
	else if (address == '/pose/orientation') {
		orientation = {x:value[0], y:value[1], z:value[2]};
	}
	else if (address == '/gesture/mouth/width') {
		mouthWidth = value[0];
	}
	else if (address == '/gesture/mouth/height') {
		mouthHeight = value[0];
		//print(mouthHeight);
	}
	else if (address == '/gesture/eyebrow/left') {
		eyebrowLeft = value[0];
	}
	else if (address == '/gesture/eyebrow/right') {
		eyebrowRight = value[0];
	}
	else if (address == '/gesture/eye/left') {
		eyeLeft = value[0];
	}
	else if (address == '/gesture/eye/right') {
		eyeRight = value[0];
	}
	else if (address == '/gesture/jaw') {
		jaw = value[0];
	}
	else if (address == '/gesture/nostrils') {
		nostrils = value[0];
	}
}

function setupOsc(oscPortIn, oscPortOut) {
	var socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
	socket.on('connect', function() {
		socket.emit('config', {	
			server: { port: oscPortIn,  host: '127.0.0.1'},
			client: { port: oscPortOut, host: '127.0.0.1'}
		});
	});
	socket.on('message', function(msg) {
		if (msg[0] == '#bundle') {
			for (var i=2; i<msg.length; i++) {
				receiveOsc(msg[i][0], msg[i].splice(1));
			}
		} else {
			receiveOsc(msg[0], msg.splice(1));
		}
	});
}