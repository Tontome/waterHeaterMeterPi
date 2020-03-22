/*



*/

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var pulseLED = new Gpio(4, 'out'); //use GPIO pin 4 as output
var pulseWatcher = new Gpio(17, 'in', 'both');
var pulseCounter = 0;
console.log("Water Heater Meter Started  !");


function unexportOnClose() { //function to run when exiting program
  pulseLED.writeSync(0); // Turn LED off
  pulseLED.unexport(); // Unexport LED GPIO to free resources
  pulseWatcher.unexport(); // Unexport Button GPIO to free resources
};

process.on('SIGINT', unexportOnClose); //function to run when user closes using ctrl+c

pulseWatcher.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
  if (err) { //if an error
    console.error('There was an error', err); //output error message to console
  return;
  }
  LED.writeSync(value); //turn LED on or off depending on the button state (0 or 1)
  pulseCounter++;
  console.log({"timestamp": now.toISOString(), "Pulse counter" : pulseCounter});
 
});

var tick = setInterval(function( ){
  var now = new Date();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  if((minutes == 0) && (seconds == 0)){
    console.log("POST the data to the google sheet");
    insertGSheet();
  }
}, 1000);


function insertGSheet(pulsecounter) { 
  var url =  "https://script.google.com/macros/s/AKfycbzzExREGCy7__ZDAKMYoh2k__szp7ZQjvimTaa1jBo/dev?WaterHeaterMeter=" + pulseCounter ;
  
  require('https').get(url, function(res) {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
    res.on('data', function (d) {
    console.log(d);
    // pulsecounter = 0;
    });
  }).on('error', function (e) {
    console.error(e);
  });
}

