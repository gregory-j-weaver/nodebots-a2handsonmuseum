var five = require("johnny-five");
var Particle = require("particle-io");
var board = new five.Board({
  io: new Particle({
    token: "private token here",
    deviceId: "device id here"
  })
});

board.on("ready", function() {
  //speed may need to be tweaked per motor, and per bot
  var speed = 255;
  
  //need to test different turning rates to see what works best for speed and control
  var speed_turning = 200; 
  var rightWheel = new five.Motor({
	  pins: {
		  pwm: "D0",
      		  dir: "D4"
	  },
      invertPWM: true
  });
  var leftWheel = new five.Motor({
	  pins: {
		  pwm: "D1",
      		  dir: "D5"
	  },
      invertPWM: true
  });

  var led_red = new five.Led("D7");
  var led_blue = new five.Led("D6");

  var weapon_servo= new five.Servo("A4");




// needs maybe a command line param to specify red or blue? or even better maybe pick it up from the file name
// thus if the file was red.js it would light red, etc.
  led_red.off();
  led_blue.off();
  led_red.on();
 


  function forward() {
	  leftWheel.fwd(speed);
	  rightWheel.fwd(speed);
  }

  
  function reverse() {
	  leftWheel.rev(speed);
	  rightWheel.rev(speed);
  }


  function stop() {
	  leftWheel.stop();
	  rightWheel.stop();
  }

  function left() {
  	  leftWheel.rev(speed_turning);
	  rightWheel.fwd(speed_turning);
  }

  function right() {
  	  leftWheel.fwd(speed_turning);
	  rightWheel.rev(speed_turning);
  }

  function quit() {
    weapon_servo.stop();
    leftWheel.stop();
    rightWheel.stop();
    led_red.off();
    led_blue.off();
    process.exit();
  }

  var weapon_toggle = true;
  function weapon() {
  
  
  //need to fix the weapon toggle....I was thinking it should have a weapon_extend and a weapon_extract that gets called in alternation
    /*if (weapon_toggle) {
      weapon_servo.to(90);
      }
    else {
      weapon_servo.to(0);
      }
*/
weapon_servo.sweep();
    }

  var stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();

  var keyMap = {
	  'w': forward,
	  's': reverse,
	  'a': left,
	  'd': right,
	  'x': stop,
	  'space': weapon,
	  'escape': quit
  }

  stdin.on("keypress", function(chunk, key) {
	  console.log(key);
	  if (!key || !keyMap[key.name]) return;
	  console.log(keyMap[key.name]);
	  keyMap[key.name]();


  });


});
