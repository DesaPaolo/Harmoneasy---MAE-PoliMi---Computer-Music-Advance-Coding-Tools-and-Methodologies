
// table of diatonic tonalities
tonalMat = [
//[C,#,D,#,E,F,#,G,#,A,#,B] C
  [1,0,1,0,1,1,0,1,0,1,0,1],
//[C,#,D,#,E,F,#,G,#,A,#,B] G
  [1,0,1,0,1,0,1,1,0,1,0,1],
//[C,#,D,#,E,F,#,G,#,A,#,B] D
  [0,1,1,0,1,0,1,1,0,1,0,1],
//[C,#,D,#,E,F,#,G,#,A,#,B] A
  [0,1,1,0,1,0,1,0,1,1,0,1],
//[C,#,D,#,E,F,#,G,#,A,#,B] E
  [0,1,0,1,1,0,1,0,1,1,0,1],
//[C,#,D,#,E,F,#,G,#,A,#,B] B
  [0,1,0,1,1,0,1,0,1,0,1,1],
//[C,#,D,#,E,F,#,G,#,A,#,B] F#
  [0,1,0,1,0,1,1,0,1,0,1,1],
//[C,#,D,#,E,F,#,G,#,A,#,B] C#
  [1,1,0,1,0,1,1,0,1,0,1,0],
//[C,#,D,#,E,F,#,G,#,A,#,B] Ab
  [1,1,0,1,0,1,0,1,1,0,1,0],
//[C,#,D,#,E,F,#,G,#,A,#,B] Eb
  [1,0,1,1,0,1,0,1,1,0,1,0],
//[C,#,D,#,E,F,#,G,#,A,#,B] Bb
  [1,0,1,1,0,1,0,1,0,1,1,0],
//[C,#,D,#,E,F,#,G,#,A,#,B] F
  [1,0,1,0,1,1,0,1,0,1,1,0]
];

tonalName = ['c', 'g', 'd', 'a', 'e', 'b', 'f#', 'c#', 'g#', 'd#', 'a#', 'f'];

var tonality ="";
var tonalityIndex;
var major = true;
var alteredNotes = [];
var fifthAlteration=false;

function isSameTonality(tonalMatIndex){
  alteredNotes = [];
  for (let i=0; i<tempChord.length; i++ ){
    let note = midiToNote(tempChord[i]);
    note = note.toString();
    note=note.slice(0, note.indexOf('/')); // remove reference to the octave 'c/5' -> 'c'
    if (tonalMat[tonalMatIndex][names.indexOf(note)]!=1){ //the tempChord note isn't in the tonality(veramente fiero di questa linea di codice)
      alteredNotes.push(names.indexOf(note));
      return false;
    }
  }
  return true;
}

function isLeadingTone(note){ //note -> index of the note in names
  note = midiToNote(note);
  note= note.toString();
  note = note.slice(0,note.indexOf("/"));
  note = names.indexOf(note);
  var leadingToneIndex = names.indexOf(tonality) - 1;
  if(leadingToneIndex<0) //c major / c minor
    leadingToneIndex = 11 // b
  if(note == leadingToneIndex)
    return true;
  else
    return false;
}

function isRelativeMajorDominant(chord){

  if(chord.includes("/")) {
    chord = chord.slice(0,chord.indexOf("/"));
  }

  var dominantIndex = tonalityIndex + 1;

  if(dominantIndex==12) {
    dominantIndex = 0;
  }
  console.log(dominantIndex);
  if((chord.includes("major ") || chord.includes("dominant")) &&
      chord.charAt(0).toLowerCase()==tonalName[dominantIndex]) {
    return true;
  } else {
    return false;
  }
}

function plotTonality(){

  var tonalityStr = "";

  if(tonality.length>0){
    tonalityStr = tonality;
  } else {
      tonalityStr = msg[lang][IDXTONALITY2];
      console.log(tonalityStr);
  }

  div = document.getElementById("tonaldiv");

  if(div.innerHTML === ""){
    div.append(tonalityStr);
  } else {
    div.innerHTML = "";
    div.append(tonalityStr);
  }
}

function tonalityShift(n){
  tonalityIndex = (tonalName.indexOf(tonality) + n) % 12;
}

function notewiseDetection(){
  console.log("notewise identification of tonality");

  fifthAlteration = false;
  let sharp=1;
  let flat = 1;
  let temp=0;

  for (var i=0; i<6; i++){

    if((tonalityIndex-flat)<0)
      temp = 12 + (tonalityIndex-flat);
    else
      temp = tonalityIndex-flat;


    if(isSameTonality((tonalityIndex + sharp)%12)){ //clockwise lookup on the circle of the fifths
      tonalityIndex = (tonalityIndex + sharp)%12;
      tonality = tonalName[tonalityIndex];
      break;
    } else if(isSameTonality(temp)){ //counterclockwise lookup on the circle of the fifths
      tonalityIndex = temp;
      tonality = tonalName[tonalityIndex];
      break;
    }
    sharp++;
    flat++;
  } // end cycle

  tonality = tonality + " major";
  return;
}
