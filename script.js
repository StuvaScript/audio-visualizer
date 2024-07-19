//? **`` Creating a new audio object and setting the location of the audio file we want to play.
let audio1 = new Audio();

//? **`` This points to our audio file.
audio1.src = "audio/piano.mp3";

//? **`` Queries
const container = document.getElementById("container");
const canvas = document.getElementById("canvas");

//? **`` Setting our canvas size to always fill up the entire screen.
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

//? **`` Creating a new instance of the AudioContext object
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

//? **`` These variables will be used to create our audio source and analyzer nodes
let audioSource = null;
let analyser = null;

//? **`` This auto plays the song
audio1.play();

//? **`` These are our object nodes using our audio context
audioSource = audioCtx.createMediaElementSource(audio1);
analyser = audioCtx.createAnalyser();

//? **`` Connecting our audioSource and analyser nodes to each other and to the destination of the audio context (the speakers). This setup forms a chain of nodes that the audio will flow through.
audioSource.connect(analyser);
audioSource.connect(audioCtx.destination);

//? **`` This determines how many data points we collect from the sound. The higher the number, the more data points we get and the more bars we'll display.
analyser.fftSize = 128;

//? **`` This tells us how many data points we have based on the fftSize. frequencyBinCount is always half of the fftSize.
const bufferLength = analyser.frequencyBinCount;

//? **`` This array will hold all of the data points that we collect from the sound.
const dataArray = new Uint8Array(bufferLength);

//? **`` This determines how wide each bar in our visualizer should be. (Using division)
const barWidth = canvas.width / bufferLength;

//* **`` Function for animating the bars.

//? **`` "x" is used to keep track of where we are on the x-axis as we draw our bars.
let x = 0;
let barHeight;

function animate() {
  //? **`` Clearing the canvas so that we can start drawing from a blank slate on each frame.
  x = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //? **`` Passing in our [dataArray], this will populate our dataArray"?" (did they mean "analyser") with data from the sound in place.
  analyser.getByteFrequencyData(dataArray);

  //? **``  Looping through the [dataArray].
  for (let i = 0; i < bufferLength; i++) {
    //? **`` For each item, we set the barHeight equal to the data point.
    barHeight = dataArray[i];

    //? **``Using the fillRect method to draw a rectangle at the x, y position with the barWidth and barHeight that we set earlier.
    //? **`` fillRect(x-axis starting point, y-axis starting point, rectangle's width, rectangle's height).
    ctx.fillStyle = "white";
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

    //? **`` Incrementing the x variable by the barWidth. This ensures that each bar is drawn next to the previous one.
    x += barWidth;
  }

  //? **`` This tells the browser to call our "animate" function on every frame.
  requestAnimationFrame(animate);
}

animate();
