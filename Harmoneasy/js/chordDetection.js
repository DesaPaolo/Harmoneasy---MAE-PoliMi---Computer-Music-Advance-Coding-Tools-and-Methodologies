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
  //console.log("tempChordInterval = " + tempChordInterval);
  var stringTemp = JSON.stringify(tempChordInterval)

  switch (stringTemp) {
    //BICHORD
    case JSON.stringify(fifth):
      nameChord = notes[(chord[0]%12)] + " 5";
      break;
    case JSON.stringify(majorThird):
      nameChord = notes[(chord[0]%12)] + " 3M";
      break;
    case JSON.stringify(minorThird):
      nameChord = notes[(chord[0]%12)] + " 3m";
      break;
    case JSON.stringify(fourth):
      nameChord = notes[(chord[0]%12)] + " 4";
      break;
    //TRIAD
    case JSON.stringify(majorTriadRoot):
      nameChord = notes[(chord[0]%12)] + " major triad root";
      break;
    case JSON.stringify(majorTriadFirst):
      nameChord = (notes[(chord[2]%12)] + " major triad first riv");
      break;
    case JSON.stringify(majorTriadSecond):
      nameChord = (notes[(chord[1]%12)] + " major triad second riv");
      break;
    case JSON.stringify(minorTriadRoot):
      nameChord = ( notes[(chord[0]%12)] + " minor triad root /" +
                  notes[(chord[1]%12)] + " major 6 no 5 second riv");
      break;
    case JSON.stringify(minorTriadFirst):
      nameChord = (notes[(chord[2]%12)] + " minor triad first riv /" +
                  notes[(chord[0]%12)] + " major 6 no 5 root");
      break;
    case JSON.stringify(minorTriadSecond):
      nameChord = (notes[(chord[1]%12)] + " minor triad second riv /" +
                  notes[(chord[2]%12)] + " major 6 no 5 first riv");
      break;
    case JSON.stringify(minor5bTriadRoot):
      nameChord = (notes[(chord[0]%12)] + " minor5b triad root/" +
                  notes[(chord[1]%12)] + " minor 6 no 5 second riv");
      break;
    case JSON.stringify(minor5bTriadFirst):
      nameChord = (notes[(chord[2]%12)] + " minor5b triad first riv /"+
                  notes[(chord[0]%12)] + " minor 6 no 5 root");
      break;
    case JSON.stringify(minor5bTriadSecond):
      nameChord = (notes[(chord[1]%12)] + " minor5b triad second riv /"+
                  notes[(chord[2]%12)] + " minor 6 no 5 first riv");
      break;
    case JSON.stringify(major5eccTriad):
      nameChord = (notes[(chord[0]%12)] + " major5# triad");
      break;
    case JSON.stringify(sus4TriadRoot):
      nameChord = (notes[(chord[0]%12)] + " sus4 triad root/"+
                  notes[(chord[1]%12)] + " sus2 second riv");
      break;
    case JSON.stringify(sus4TriadFirst):
      nameChord = (notes[(chord[2]%12)] + " sus4 triad first riv /"+
                  notes[(chord[0]%12)] + " sus2 triad root");
      break;
    case JSON.stringify(sus4TriadSecond):
      nameChord = (notes[(chord[1]%12)] + " sus4 triad second riv /"+
                  notes[(chord[2]%12)] + " sus2 first riv");
      break;
    case JSON.stringify(minor7TriadRoot):
      nameChord = (notes[(chord[0]%12)] + " minor 7 triad root");
      break;
    case JSON.stringify(minor7TriadFirst):
      nameChord = (notes[(chord[2]%12)] + " minor 7 triad first riv");
      break;
    case JSON.stringify(minor7TriadSecond):
      nameChord = (notes[(chord[1]%12)] + " minor 7 triad second riv");
      break;
    case JSON.stringify(minor7majTriadRoot):
      nameChord = (notes[(chord[0]%12)] + " minor 7maj triad root");
      break;
    case JSON.stringify(minor7majTriadFirst):
      nameChord = (notes[(chord[2]%12)] + " minor 7maj triad first riv");
      break;
    case JSON.stringify(minor7majTriadSecond):
      nameChord = (notes[(chord[1]%12)] + " minor 7maj triad second riv");
      break;
    case JSON.stringify(major7majTriadRoot):
      nameChord = (notes[(chord[0]%12)] + " major 7maj triad root");
      break;
    case JSON.stringify(major7majTriadFirst):
      nameChord = (notes[(chord[2]%12)] + " major 7maj triad first riv");
      break;
    case JSON.stringify(major7majTriadSecond):
      nameChord = (notes[(chord[1]%12)] + " major 7maj triad second riv");
      break;
    case JSON.stringify(major7TriadRoot):
      nameChord = (notes[(chord[0]%12)] + " dominant 7 triad root");
      break;
    case JSON.stringify(major7TriadFirst):
      nameChord = (notes[(chord[2]%12)] + " dominant 7 triad first riv");
      break;
    case JSON.stringify(major7TriadSecond):
      nameChord = (notes[(chord[1]%12)] + " dominant 7 triad second riv");
      break;
    //TETRACHORD
    case JSON.stringify(minor7Root):
      nameChord = (notes[(chord[0]%12)] + " minor 7 root");
      break;
    case JSON.stringify(minor7First):
      nameChord = (notes[(chord[3]%12)] + " minor 7 first riv");
      break;
    case JSON.stringify(minor7Second):
      nameChord = (notes[(chord[2]%12)] + " minor 7 second riv");
      break;
    case JSON.stringify(minor7Third):
      nameChord = (notes[(chord[1]%12)] + " minor 7 third riv");
      break;
    case JSON.stringify(major7majRoot):
      nameChord = (notes[(chord[0]%12)] + " major 7maj root");
      break;
    case JSON.stringify(major7majFirst):
      nameChord = (notes[(chord[3]%12)] + " major 7maj first riv");
      break;
    case JSON.stringify(major7majSecond):
      nameChord = (notes[(chord[2]%12)] + " major 7maj second riv");
      break;
    case JSON.stringify(major7majThird):
      nameChord = (notes[(chord[1]%12)] + " major 7maj third riv");
      break;
    case JSON.stringify(major7Root):
      nameChord = (notes[(chord[0]%12)] + " dominant 7 root");
      break;
    case JSON.stringify(major7First):
      nameChord = (notes[(chord[3]%12)] + " dominant 7 first riv");
      break;
    case JSON.stringify(major7Second):
      nameChord = (notes[(chord[2]%12)] + " dominant 7 second riv");
      break;
    case JSON.stringify(major7Third):
      nameChord = (notes[(chord[1]%12)] + " dominant 7 third riv");
      break;
    case JSON.stringify(minor7majRoot):
      nameChord = (notes[(chord[0]%12)] + " minor 7maj root");
      break;
    case JSON.stringify(minor7majFirst):
      nameChord = (notes[(chord[3]%12)] + " minor 7maj first riv");
      break;
    case JSON.stringify(minor7majSecond):
      nameChord = (notes[(chord[2]%12)] + " minor 7maj second riv");
      break;
    case JSON.stringify(minor7majThird):
      nameChord = (notes[(chord[1]%12)] + " minor 7maj third riv");
      break;
    case JSON.stringify(diminished):
      nameChord = (notes[(chord[0]%12)] + " diminished");
      break;
    case JSON.stringify(semiDiminishedRoot):
      nameChord = (notes[(chord[0]%12)] + " semi-diminished root");
      break;
    case JSON.stringify(semiDiminishedFirst):
      nameChord = (notes[(chord[3]%12)] + " semi-diminished first riv");
      break;
    case JSON.stringify(semiDiminishedSecond):
      nameChord = (notes[(chord[2]%12)] + "semi-diminished second riv");
      break;
    case JSON.stringify(semiDiminishedThird):
      nameChord = (notes[(chord[1]%12)] + " semi-diminished third riv");
      break;
    default:
     nameChord = (""); //it is not a chord
     break;
    }
    plotNameChord(nameChord);
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
