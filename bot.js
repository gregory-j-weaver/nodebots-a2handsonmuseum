var five = require("johnny-five");
var Particle = require("particle-io");
var board = new five.Board({
  io: new Particle({
    token: "",
    deviceId: ""
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

  var led_red = new five.Led("D6");
  var led_blue = new five.Led("D7");

  var weapon_servo= new five.Servo({
      pin: "A4",
      startAt: 90 
    });

  var botOptions = {
    ledToLight: ""
  };

  var commandLineArgs = process.argv.slice(2);
  commandLineArgs.forEach(function (val, index, array) {
    if (val.startsWith("led="))
    {
        botOptions.ledToLight = val.substring(4);
        console.log("led color specified");
    }
  });
  console.log(botOptions);



// needs maybe a command line param to specify red or blue? or even better maybe pick it up from the file name
// thus if the file was red.js it would light red, etc.
  led_red.off();
  led_blue.off();
 
  if (botOptions.ledToLight === "blue") {
    led_blue.on();
  } else if (botOptions.ledToLight === "red") {
    led_red.on();
  } else if (botOptions.ledToLight === "both") {
    led_blue.on();
    led_red.on();
  }

  var forward = function() {
	  leftWheel.fwd(speed);
	  rightWheel.fwd(speed);
  }
  
  var reverse = function() {
	  leftWheel.rev(speed);
	  rightWheel.rev(speed);
  }


  var stop = function() {
	  leftWheel.stop();
	  rightWheel.stop();
  }

  var left = function() {
  	  leftWheel.rev(speed_turning);
	  rightWheel.fwd(speed_turning);
  }

  var right = function() {
  	  leftWheel.fwd(speed_turning);
	  rightWheel.rev(speed_turning);
  }

  var quit = function() {
    weapon_servo.stop();
    leftWheel.stop();
    rightWheel.stop();
    led_red.off();
    led_blue.off();
    process.exit();
  }

  var weapon_toggle = true;
  var weapon = function() {
    if (weapon_toggle) {
      weapon_servo.to(180);
      }
    else {
      weapon_servo.to(0);
      }
    weapon_toggle = !weapon_toggle;
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
