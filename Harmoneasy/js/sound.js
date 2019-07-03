//SOUND

 var audio_context = window.AudioContext || window.webkitAudioContext;
 var con = new audio_context
 var oscillators = [];
 var gains = [];


function attack(midiNote) {
  var freq  = frequencyFromNoteNumber(midiNote);
  var osc = con.createOscillator();
  var gain_node = con.createGain();
  gain_node.connect(con.destination);
  osc.connect(gain_node);
  osc.frequency.value = freq;
  gain_node.gain.value = 0.20;
  osc.start();
  oscillators.push(osc);
  gains.push(gain_node);
}

function release() {
  for (var i = 0; i<oscillators.length; i++){

      var osc = oscillators[i]
      var gain = gains[i];
      osc.stop();
      gain.disconnect();
      osc.disconnect();
      delete gain;
      delete osc;

    }
    gains = [];
    oscillators = [];
  }



function frequencyFromNoteNumber(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
}
