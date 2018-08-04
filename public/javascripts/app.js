
		//////////------------------------    Beat Hero    --------------------//////////////

		//-------------------------------- Global Variables --------------------------------//


// global score value to carry through the whole song (saved and updated round-by-round)
const score = 0;

// store Web Audio audioBuffer objects converted from HTML 'data-sound' file
const bufSoundObj = {};
// key = sound description (ex: kick)
// value = audioBuffer object

let kick = bufSoundObj.kick
let snare = bufSoundObj.snare
let hihat = bufSoundObj.hihat
let clap = bufSoundObj.clap

// global audio context that the Web Audio API outputs through
const context = new AudioContext();

let now = context.currentTime;

// stated by the begining of the last round to be started. (used to calculate the targetHitTimes)
let roundStart = 0;

		//--------------------------------  Arrays  --------------------------------//
 
const kickHits1 = [
	
];

const snareHits1 = [

];

const hihatHits2 = [

];

const clapHits2 = [

];

		//-------------------------------- Event Listeners --------------------------------//

// run through the pads and link audio to audiocontext (on-load)
$(function() {
	$('.pad-container div').each(function() {
        addAudioProperties(this);
    });

// initiate event listener to play sample and display pad animation
    $('.pad-container div').on('mousedown', function() {
        this.play();
        console.log(this);

        // glow animation
        $(this).children('.pad-glow').remove()
        let glowDiv = $('<div class="pad-glow">')
        $(this).append(glowDiv)
        glowDiv.fadeOut('50')
        $(this).addClass('padHit');

        hitCheck(this.id, roundStart)
    });
});

// initiate event listener for play-round-one
$('#play-round-one').on('click', function(){
	roundOne.play()
})

// initiate event listener for preview of round one 
$('#round-one-preview').on('click', function(){
	roundOneSample.play()
})

// initiate event listener for full beat...
	//could wait to show beat at the end...???ff
$('#full-preview').on('click', function(){
	fullRhythmSample.play()
})

// Map out the pads on the keys

$(document).keypress(function(e) {
	// kick
    if(e.which == 90) {
        console.log("z triggered pad1: kick");
        padGlow('#pad1');
        playPad(bufSoundObj.kick, '#pad1')
    } else if(e.which == 88){
    	console.log("x triggered pad2: snare");
        padGlow('#pad2');
        playPad(bufSoundObj.snare, '#pad2')
    } else if(e.which == 67){
    	console.log("c triggered pad3: hihat");
        padGlow('#pad3');
        playPad(bufSoundObj.hihat, '#pad3')
    } else if(e.which == 86){
    	console.log("v triggered pad4: clap");
        padGlow('#pad4');
        playPad(bufSoundObj.clap, '#pad4')
    } 
});




		//-------------------------------- Functions --------------------------------//

// Pad class change animation
const fadeClass = (pad) => {
	console.log(pad, 'pad from fadeClass');
	$(pad).switchClass('pads', 'padHit'/*, 1000, 'swing'*/)
	// resetClass(pad);

}

const resetClass = (pad) => {
	console.log(pad);
	$(pad).switchClass('padHit', 'pads'/*, 1000, 'swing'*/)
}

// Web Audio API load audio from HTML 'data-sound'
const loadAudio = (object, audioLink) => {

    let request = new XMLHttpRequest();
    request.open('GET', audioLink, true);
    request.responseType = 'arraybuffer';

// buffer and convert 'data-sound' into usable audioBuffer object
    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
            object.buffer = buffer;
            //add audioBuffer to bufSoundObj with HTML 'data-soundname' as key and converted HTML 'data-sound' as value
            soundName = $(object).data('soundname');
            bufSoundObj[soundName] = object.buffer;
        });
    }
    request.send();
}



// function to run on load that calls loadAudio and sets up play functionality to the audioBuffers connected to the pads
const addAudioProperties = (object) => {
    object.name = object.id;
    object.source = $(object).data('sound');
    soundName = $(object).data('soundname');
    loadAudio(object, object.source);
    object.play = () => {
        var s = context.createBufferSource();
        s.buffer = object.buffer;
        s.connect(context.destination);
        s.start(0);
        object.s = s;
    }
}

// function to trigger pad glow
const padGlow = (pad) => {
	console.log(pad);
	$(pad).children('.pad-glow').remove()
    let glowDiv = $('<div class="pad-glow">')
    $(pad).append(glowDiv)
    glowDiv.fadeOut('50')
    $(pad).addClass('padHit');
    // console.log(context.currentTime + ' --- This is when(padGlow ran');
}

// hitCheck function to constantly check pad hits against roundStart and 

const hitCheck = (pad, roundStart) => {
	if(roundStart === 0){
		console.log("The round hasn't started");
	}else if(now - roundStart > 25){
		console.log("The round has concluded");
	}
}

// functions to play each pad (to trigger on keypress)
const playPad = (buffer, pad) => {
	let source = context.createBufferSource();
    source.buffer = buffer;
    let kick = bufSoundObj.kick;
    source.connect(context.destination);
    if (!source.start)
    source.start = source.noteOn;
    source.start(0);
    console.log("playPad ran " + buffer);
}

		//-------------------------------- Objects --------------------------------//

// Audio sequence of the completed song
const fullRhythmSample = {
	play: (buffer, time, pad) => {

		playSound = (buffer, time, pad) => {
		    let source = context.createBufferSource();
		    source.buffer = buffer;
		    source.connect(context.destination);
		    if (!source.start)
		    source.start = source.noteOn;
		    source.start(time);

		    // set global roundStart variable and calculate target timing.
		    roundStart = context.currentTime;
		    console.log("roundStart: " + roundStart);
		    console.log(time + " : " + pad + " was hit");
		    console.log("calculated targetHit = " + (time - roundStart));

		    // pad glow effect
		    const calculatedTime = (time - now) * 1000;
		    setTimeout(padGlow, calculatedTime, pad);
		}

	  	let kick = bufSoundObj.kick
		let snare = bufSoundObj.snare
		let hihat = bufSoundObj.hihat
		let clap = bufSoundObj.clap

		// start playing the rhythm
		let now = context.currentTime;
		let tempo = 100; // BPM (beats per minute)
	   	let eighthNoteTime = (60 / tempo) / 2;
	   	let sixteenthNoteTime = (60/ tempo) / 4;

		// Play 2 bars of the following:
		for (let bar = 0; bar < 4; bar++) {
		   	let time = now + bar * 32 * sixteenthNoteTime;
		    
		    // Play the kick drum on beats 1, 5, 15, 17, 21, 31 
		    playSound(kick, time, '#pad1');
		    playSound(kick, time + 4 * sixteenthNoteTime, '#pad1');
		    playSound(kick, time + 14 * sixteenthNoteTime, '#pad1');
		    playSound(kick, time + 16 * sixteenthNoteTime, '#pad1');
		    playSound(kick, time + 20 * sixteenthNoteTime, '#pad1');
		    playSound(kick, time + 30 * sixteenthNoteTime, '#pad1');

		    // Play the snare drum on beats 9, 19, 25, 28
		    playSound(snare, time + 8 * sixteenthNoteTime, '#pad2');
		    playSound(snare, time + 18 * sixteenthNoteTime, '#pad2');
		    playSound(snare, time + 24 * sixteenthNoteTime, '#pad2');
		    playSound(snare, time + 27 * sixteenthNoteTime, '#pad2');

		    // Play the hihat on beats 3, 7, 13, 19, 22, 29
		    playSound(hihat, time + 2 * sixteenthNoteTime, '#pad3');
		    playSound(hihat, time + 6 * sixteenthNoteTime, '#pad3');
		    playSound(hihat, time + 12 * sixteenthNoteTime, '#pad3');
		    playSound(hihat, time + 18 * sixteenthNoteTime, '#pad3');
		    playSound(hihat, time + 21 * sixteenthNoteTime, '#pad3');
		    playSound(hihat, time + 28 * sixteenthNoteTime, '#pad3');

		    // Play the clap on beats 9, 11, 27
		    playSound(clap, time + 8 * sixteenthNoteTime, '#pad4');
		    playSound(clap, time + 10 * sixteenthNoteTime, '#pad4');
		    playSound(clap, time + 26 * sixteenthNoteTime, '#pad4');
		}
	}
};

// Audio sequence of the first level
const roundOneSample = {
	play: () => {
	  	playSound = (buffer, time, pad) => {
		    let source = context.createBufferSource();
		    source.buffer = buffer;
		    source.connect(context.destination);
		    if (!source.start)
		    source.start = source.noteOn;
		    source.start(time);

		    roundStart = context.currentTime;
		    console.log("roundStart: " + roundStart);
		    console.log(time + " : " + pad + " was hit");
		    console.log("calculated targetHit = " + (time - roundStart));

		    // pad glow effect
		    const calculatedTime = (time - now) * 1000;
		    setTimeout(padGlow, calculatedTime, pad);
	  	}

		let kick = bufSoundObj.kick
		let snare = bufSoundObj.snare

		// start playing the rhythm
		let now = context.currentTime;
		let tempo = 100; // BPM (beats per minute)
	   	let eighthNoteTime = (60 / tempo) / 2;
	   	let sixteenthNoteTime = (60/ tempo) / 4;

		// Play 2 bars of the following:
		for (let bar = 0; bar < 2; bar++) {
		   	let time = now + bar * 32 * sixteenthNoteTime;
		    
		    // Play the kick drum on beats 1, 5, 15, 17, 21, 31 
		    playSound(kick, time, '#pad1');
		    playSound(kick, time + 4 * sixteenthNoteTime, '#pad1');
		    playSound(kick, time + 14 * sixteenthNoteTime, '#pad1');
		    playSound(kick, time + 16 * sixteenthNoteTime, '#pad1');
		    playSound(kick, time + 20 * sixteenthNoteTime, '#pad1');
		    playSound(kick, time + 30 * sixteenthNoteTime, '#pad1');
		    // Play the snare drum on beats 9, 19, 25, 28
		    playSound(snare, time + 8 * sixteenthNoteTime, '#pad2');
		    playSound(snare, time + 18 * sixteenthNoteTime, '#pad2');
		    playSound(snare, time + 24 * sixteenthNoteTime, '#pad2');
		    playSound(snare, time + 27 * sixteenthNoteTime, '#pad2');
		}
	}
};

const roundOne = { 
	play: () => {
	  	playSound = (buffer, time, pad) => {
		    let source = context.createBufferSource();
		    source.buffer = buffer;
		    source.connect(context.destination);
		    if (!source.start)
		    source.start = source.noteOn;
		    source.start(time);

		    roundStart = context.currentTime;
		    console.log("roundStart: " + roundStart);
		    console.log(time + " : " + pad + " was hit");
		    console.log("calculated targetHit = " + (time - roundStart));
	  	}

	  	let kick = bufSoundObj.kick
		let snare = bufSoundObj.snare
		let hihat = bufSoundObj.hihat
		let clap = bufSoundObj.clap

		let now = context.currentTime;
		let tempo = 100; // BPM (beats per minute)
	   	let eighthNoteTime = (60 / tempo) / 2;
	   	let sixteenthNoteTime = (60/ tempo) / 4;

		// Play 2 bars of the following:
		for (let bar = 0; bar < 2; bar++) {
		   	let time = now + bar * 32 * sixteenthNoteTime;

		    // Play the clap on beats 1,5,9,13,17,21,25,29,33,37,41,45
		    playSound(clap, time);
		    playSound(clap, time + 4 * sixteenthNoteTime);
		    playSound(clap, time + 8 * sixteenthNoteTime);
		    playSound(clap, time + 12 * sixteenthNoteTime);
		    playSound(clap, time + 16 * sixteenthNoteTime);
		    playSound(clap, time + 20 * sixteenthNoteTime);
		    playSound(clap, time + 24 * sixteenthNoteTime);
		    playSound(clap, time + 28 * sixteenthNoteTime);
		    playSound(clap, time + 32 * sixteenthNoteTime);
		    playSound(clap, time + 36 * sixteenthNoteTime);
		    playSound(clap, time + 40 * sixteenthNoteTime);
		    playSound(clap, time + 44 * sixteenthNoteTime);
		}
	}
};

// function that initiates a round using the hitCheck function and calculating using the start time of the round

// const startRound1 = function () {
// }

// function to check against rhythmSample and upgrade score (function for each round)
	// needs to log the start of the round and subtract that time from the other hits against the standard timing

// Event Listener to check if (now) matches the correct pad and timing for any hit in a round. 
	// first sort by pad
	// then sort by any one perfect hit 
	// then score the hit 

// classes for each pad
	// serial number 
	// unique sounds (could be held in a global variable)
	// methods
		// play sound
		// check for timing
			// update score

// classes for each round
	// a sequence to replicate (triggered by Preview button)
		// a full audio sample to attempt to replicate 
		// a matching timed visual sequence that shows the correct pads to hit
	// a timer (triggered by Start button)
	// a scoreboard
	// log of pad hits with serial numbers and timestamp (to check against)

