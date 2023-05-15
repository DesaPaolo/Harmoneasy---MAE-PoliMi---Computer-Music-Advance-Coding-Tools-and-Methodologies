//CHORD DETECTION
var tempChord =[];
var renderChord = [];
var doubledVoice = [];

function recursiveMidiNoteDetection(midiNote){
  if(tempChord.length==0){
    return midiNote;
  } else if(midiNote < Math.min.apply(null,tempChord)+12 &&
            midiNote > Math.min.apply(null,tempChord)-12) {
    return midiNote;
  } else if (midiNote > Math.min.apply(null,tempChord)) {
    return recursiveMidiNoteDetection(midiNote - 12);
  } else {
    return recursiveMidiNoteDetection(midiNote + 12);
  }
}

function noteOn(midiNote) {
  //console.log("NOTEON: " + midiNote);

  if(renderChord.length==0) {
    startTimer();
  }
  attack(midiNote);
  renderChord.push(midiNote);
  //console.log("renderChord = " + renderChord);
  render0(renderChord);

  //creation of tempChord
  tempChord.push(recursiveMidiNoteDetection(midiNote));
  //iteratively
  /*if(tempChord.length==0){
    tempChord.push(midiNote);
  } else {
    if(midiNote > Math.min.apply(null,tempChord)) {
      if(midiNote >= Math.min.apply(null,tempChord)+12){
        while(true){
          if(midiNote < Math.min.apply(null,tempChord)+12) {
            break;
          } else {
            midiNote = midiNote - 12;
          }
        }
      }
    } else {
      if(midiNote <= Math.min.apply(null,tempChord)-12){
        while(true){
          if(midiNote > Math.min.apply(null,tempChord)-12) {
            break;
          } else {
            midiNote = midiNote + 12;
          }
        }
      }
    }
    tempChord.push(midiNote);
  }*/
  //check for doubling voices!!
  for (var i = 0; i<tempChord.length; i++){
    for(var j = 0; j<tempChord.length; j++){
      if(i!=j && (tempChord[i]==tempChord[j] || Math.abs(tempChord[i] - tempChord[j])%12==0)){
        //console.log("Doubled voice!");
        if(tempChord[i]>tempChord[j]) {
          doubledVoice.push(tempChord[i]);
          tempChord.splice(i, 1); //remove the doubled voice from tempChord (higher one)
        } else if (tempChord[i]<tempChord[j]) {
          doubledVoice.push(tempChord[j]);
          tempChord.splice(j, 1);
        } else { //tempChord[i]==tempChord[j]
          doubledVoice.push(tempChord[i]);
          tempChord.splice(i, 1);
        }
      }
    }
  }
  var bass = Math.min.apply(null,tempChord);
  for (var i = 0; i < tempChord.length; i++){ // [e, c, g] -> [e, g, c]
    if(tempChord[i]-bass > 12){
      while(true){
        if(tempChord[i]-bass < 12){
          break;
        }
        tempChord[i] -= 12;
      }
    }
  }
  tempChord.sort(sortNumber);
  doubledVoice.sort(sortNumber);
  //console.log("tempChord = " + tempChord);
  //console.log("doubledVoice = " + doubledVoice);

  detectChord(tempChord);
  //console.log("nameChord: " + nameChord);


  /*var temp =0;     //check of doubling voice
  var isDoubled = false;
  for(var i = 0; i<tempChord.length; i++){
    temp = Math.abs(midiNote - tempChord[i]);
    if(temp == 12){ //if new note is a doubling
      //console.log("doubling of voice")
      isDoubled=true;
      break;
    }
  }
  if(!isDoubled){
    tempChord.push(midiNote);
    tempChord.sort(sortNumber);
  } else {
    doubledVoice.push(midiNote);
  }
  //console.log("tempChord = " + tempChord);

  detectChord(tempChord);
  //console.log("nameChord: " + nameChord);*/
}

var nameChord = ""; //global because tonalityDetaction need it

function detectChord(chord){
  var tempChordInterval=[];
  for(var i = 1; i<chord.length; i++){
    tempChordInterval.push(chord[i] - chord[i-1]); //[60, 64, 63] -> [4, 3]
  }

  if(chord.length>1)
    plotNameChord(Chords.getName(JSON.stringify(tempChordInterval), chord));

}

function plotNameChord(nameChord){
  div = document.getElementById("nameChord");
  if(div.innerHTML === ""){
    div.append(nameChord);
  } else {
    div.innerHTML = "";
    div.append(nameChord);
  }
}


function noteOff(midiNote) {

  //console.log("NOTEOFF: " + midiNote)
  if (renderChord.length == 1){
    release();
  }

  var j = renderChord.indexOf(midiNote);
  renderChord.splice(j, 1);
  //console.log("renderChord = " + renderChord);
  render0(renderChord);

  var tempChordNote = [];
  var doubledVoiceNote = [];
  var note;
  for (var i = 0; i<tempChord.length; i++) {
    note = midiToNote(tempChord[i]);
    note= note.toString();
    note = note.slice(0,note.indexOf("/"));
    tempChordNote.push(note);
  } // tempChordNote: [60, 64 ,67] -> ["c", "e", "g"]  NO DOUBLED VOICE ;) (v . noteOn)
  for (var i = 0; i<doubledVoice.length; i++) {
    note = midiToNote(doubledVoice[i]);
    note= note.toString();
    note = note.slice(0,note.indexOf("/"));
    doubledVoiceNote.push(note);
  } // doubledVoiceNote: [72, 76] -> ["c", "e"]  NO DOUBLED VOICE ;) (v . noteOn)
  note = midiToNote(midiNote);
  note= note.toString();
  note = note.slice(0,note.indexOf("/"));

  var indextempChordNote = tempChordNote.indexOf(note);
  var indexDoubledVoice = doubledVoiceNote.indexOf(note);
  if(indextempChordNote != -1){
    if( indexDoubledVoice != -1) {
      doubledVoiceNote.splice(indextempChordNote, 1);
      doubledVoice.splice(indextempChordNote, 1);
    } else {
      tempChordNote.splice(indextempChordNote, 1);
      tempChord.splice(indextempChordNote, 1);
    }
  }
  //console.log("doubledVoice = " + doubledVoice);
  //console.log("tempChord = " + tempChord);

  /*var i = tempChord.indexOf(midiNote);
  if(i !=-1){
    tempChord.splice(i, 1);
  }
  //console.log("tempChord = " + tempChord);


  var k = doubledVoice.indexOf(midiNote);
  if(k !=-1){
    doubledVoice.splice(k, 1);
  }
  //console.log("doubled voice = " + doubledVoice);

  if(doubledVoice.length>0){
    var temp=0;
    var tempDoubledVoice = [];
    for(var y = 0; y<doubledVoice.length; y++){
      for(var z = 0; z<tempChord.length; z++) {
        temp = Math.abs(doubledVoice[y] - tempChord[z]);
        if(temp == 12){ //if new note is a doubling
          tempDoubledVoice.push(doubledVoice[y]);
        }
      }
    }

    for(var x = 0; x<doubledVoice.length; x++) {
      if(tempDoubledVoice.indexOf(doubledVoice[x])==-1){
        tempChord.push(doubledVoice[x]);
      }
    }
    doubledVoice=tempDoubledVoice;
  }*/

  detectChord(tempChord);
}
