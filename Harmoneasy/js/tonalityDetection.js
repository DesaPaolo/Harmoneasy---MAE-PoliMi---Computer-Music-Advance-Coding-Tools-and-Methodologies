/*                 C D E F G A B
Cmajor				    [0,0,0,0,0,0,0, //sharp
Gmajor				     0,0,0,1,0,0,0,
D						       1,0,0,1,0,0,0,
A						       1,0,0,1,1,0,0,
E						       1,1,0,1,1,0,0,
B/Cb					     1,1,0,1,1,1,0, // 1,1,1,1,1,1,1 (flat)
F#/Gb					     1,1,1,1,1,1,0, // 1,1,1,0,1,1,1
C#major/DbMajor		 1,1,1,1,1,1,1, // 0,1,1,0,1,1,1
Ab						     0,1,1,0,0,1,1, //flat
Eb						     0,0,1,0,0,1,1,
Bb					       0,0,1,0,0,0,1,
F						       0,0,0,0,0,0,1,]
major scale [2,2,1,2,2,2,1]*/

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
var isModulating=false;

function detectTonality(){

  var tempChordInterval = [];
  for(var i = 1; i<tempChord.length; i++){
    tempChordInterval.push(tempChord[i] - tempChord[i-1]); //[60, 64, 63] -> [4, 3]
  }

  console.log("inter: "+tempChordInterval);

  if (arr.length==0 || tonality == ""){ //first chord (or tonality still not detected)

    if(nameChord.includes("major ") && !nameChord.includes("6")){ // avoid major6 chords
                                                                  // (avoid the only ambiguity major triad with 6/minor triad)
                                                                  // avoid major5# chord (space after "major"!)
      if(nameChord.includes("root")){
        tonality = midiToNote(tempChord[0]);
      } else if(nameChord.includes("first riv")){
          if(nameChord.includes("triad")) {       //if(tempChord.length==3)
            tonality = midiToNote(tempChord[2]);
          } else {
            tonality = midiToNote(tempChord[3]);
          }
      } else if(nameChord.includes("second riv")){
          if(nameChord.includes("triad")) {
            tonality = midiToNote(tempChord[1]);
          } else {
            tonality = midiToNote(tempChord[2]);
          }
      } else if(nameChord.includes("third riv")){
          tonality = midiToNote(tempChord[1]);
      } else {
        tonality = "";
      }
    } else if(nameChord.includes("dominant 7 ")){ // tonal reference a fifth below the root
        if(nameChord.includes("root")){
          tonality = midiToNote(tempChord[0]-7);
        } else if(nameChord.includes("first riv")){
            if(nameChord.includes("triad")) {
              tonality = midiToNote(tempChord[2]-7);
          } else {
              tonality = midiToNote(tempChord[3]-7);
          }
        } else if(nameChord.includes("second riv")){
            if(nameChord.includes("triad")) {
              tonality = midiToNote(tempChord[1]-7);
          } else {
              tonality = midiToNote(tempChord[2]-7);
          }
        } else if(nameChord.includes("third riv")){
            tonality = midiToNote(tempChord[1]-7);
        } else {
            tonality = "";
        }
    } else if(nameChord.includes("minor ") && !nameChord.includes("minor5b")){ //also minor 7 and minor 7maj // TODO: minor 7 ->????? II or VI of major or I of minor(but not harmonic!)
                                                                               //avoid minor with 6 and relative ambiguity with minor5b
        major=false;

        let temp ="";       // to resolve the superposition of root and second riv in minor triad/major 6 no 5
        if (nameChord.includes("/"))
          temp = nameChord.slice(0, nameChord.indexOf('/'));
        else
          temp=nameChord;

        if(temp.includes("root")){
          tonality = midiToNote(tempChord[0]);
        } else if(temp.includes("first riv")){
            if(nameChord.includes("triad")) {       //if(tempChord.length==3)
              tonality = midiToNote(tempChord[2]);
          } else {
              tonality = midiToNote(tempChord[3]);
          }
        } else if(temp.includes("second riv")){
            if(nameChord.includes("triad")) {
              tonality = midiToNote(tempChord[1]);
          } else {
              tonality = midiToNote(tempChord[2]);
          }
        } else if(nameChord.includes("third riv")){
            tonality = midiToNote(tempChord[1]);
        } else {
            tonality = "";
        }
    } else { //5# 5b sus4 sus2 sus4 6chords
        tonality = "";
    }

    //tonailtyIndex
    tonality = tonality.toString();
    if (tonality.length!=0) {
    tonality=tonality.slice(0, tonality.indexOf('/')); // remove reference to the octave 'c/5' -> 'c'
      if(major) {
        tonalityIndex = tonalName.indexOf(tonality);
      } else {
          if(tonalName.indexOf(tonality)-3 < 0){
            tonalityIndex = tonalName.indexOf(tonality) - 3 + 12;
          } else {
            tonalityIndex = tonalName.indexOf(tonality) - 3;
          }
      }
    } else {
      tonality = "";
    }

  } else { // not first chord
    if (!(isSameTonality(tonalityIndex))){ // new chord has a note out of tonality

      let chord = "";      //discard the ambiguities
      if (nameChord.includes("/"))
        chord = nameChord.slice(0, nameChord.indexOf('/'));
      else
        chord=nameChord;
      //ogni modulazione presuppone la una modulazione ad una tonalità maggiore tranne:
      if(isModulating && chord.includes("minor ") && !chord.includes("7 ") && chord.charAt(0).toLowerCase()==tonality){ // C-E-Aminor = A minor not A major
                                                                                                                        //avoid minor 7 (II) but allow minor 7maj
        major=false;
        if(chord.includes("root")){
          tonality = midiToNote(tempChord[0]);
        } else if(chord.includes("first riv")){
            if(nameChord.includes("triad")) {       //if(tempChord.length==3)
              tonality = midiToNote(tempChord[2]);
          } else {
              tonality = midiToNote(tempChord[3]);
          }
        } else if(chord.includes("second riv")){
            if(nameChord.includes("triad")) {
              tonality = midiToNote(tempChord[1]);
          } else {
              tonality = midiToNote(tempChord[2]);
          }
        } else if(chord.includes("third riv")){
            tonality = midiToNote(tempChord[1]);
        } else {
            tonality = "";
        }
        //tonalityIndex
        tonality = tonality.toString();
        if (tonality.length!=0) {
          tonality=tonality.slice(0, tonality.indexOf('/')); // remove reference to the octave 'c/5' -> 'c'
          if(tonalName.indexOf(tonality)-3 < 0){
            tonalityIndex = tonalName.indexOf(tonality) - 3 + 12;
          } else {
            tonalityIndex = tonalName.indexOf(tonality) - 3;
          }
        }
        isModulating=false;
      } else {
        if(nameChord.includes("major5#")){ // third grade of melodic minor scale -> modulation major-minor
                                           // not included in tonalMat!!
          major = false;
          tonality = midiToNote(tempChord[0]-3); //third grade
          tonality = tonality.toString();
          tonality=tonality.slice(0, tonality.indexOf('/'));
          if(tonalName.indexOf(tonality)-3 < 0){
            tonalityIndex = tonalName.indexOf(tonality) - 3 + 12;
          } else {
            tonalityIndex = tonalName.indexOf(tonality) - 3;
          }

        } else if(nameChord.includes("diminished")) {
          // TODO:
        } else {

          major=true;
          isModulating = true;
          let sharp=1;
          let flat = 1;
          let temp=0;

          for (var i=0; i<6; i++){

            if((tonalityIndex-flat)<0)
              temp = 12 + (tonalityIndex-flat);
            else
              temp = tonalityIndex-flat;

            if(isSameTonality((tonalityIndex + sharp)%12)){ //clockwise on the circle of the fifths
              tonalityIndex = (tonalityIndex + sharp)%12;
              tonality = tonalName[tonalityIndex];
              break;
            } else if(isSameTonality(temp)){ //counterclockwise on the circle of the fifths
              tonalityIndex = temp;
              tonality = tonalName[tonalityIndex];
              break;
            }
            sharp++;
            flat++;
          }
        }
      }

    } else { // no altered notes (not always same tonality)

      if(!major && isRelativeMajorDominant(nameChord)){ // a - G (7) - C -> C major not A minor  & a-G-cminor ->cminor tonality
        //tonality = relative major
        major = true;
        isModulating = true;
        if(names.indexOf(tonality)+3>=12){
          tonality = names[names.indexOf(tonality) -9];
        } else {
          tonality = names[names.indexOf(tonality)+3];
        }
        //tonalityIndex is the same!!!
      }
      if(isModulating && nameChord.charAt(0).toLowerCase()==tonality){ //C - E - A -> A major not A major/minor (tonic of the new tonality)
        isModulating=false;
      }
      //tonality = tonality;
    }
  }
}

function isSameTonality(tonalMatIndex){
  alteredNotes = [];
  var isAltered = false;
  for (let i=0; i<tempChord.length; i++ ){
    let note = midiToNote(tempChord[i]);
    note = note.toString();
    note=note.slice(0, note.indexOf('/')); // remove reference to the octave 'c/5' -> 'c'
    if (tonalMat[tonalMatIndex][names.indexOf(note)]!=1){ //the tempChord note isn't in the tonality(veramente fiero di questa linea di codice)
      alteredNotes.push(names.indexOf(note));
      isAltered = true;
      break;
    }
  }

  if (isAltered)
    return false;
  else
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
    if(isModulating){
      tonalityStr = tonality + " major/minor";
    } else {
      if (major){
        tonalityStr = tonality + " major";
        console.log(msg[lang][IDXTONALITY]+" " + tonalityStr);
      } else{
        tonalityStr = tonality + " minor";
        console.log(msg[lang][IDXTONALITY]+" " + tonalityStr);
      }
    }

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
