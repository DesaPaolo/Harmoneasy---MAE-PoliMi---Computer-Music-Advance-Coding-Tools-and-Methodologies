
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
          //isModulating = true;
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
        isModulating = true; // to relative major
        if(names.indexOf(tonality)+3>=12){
          tonality = names[names.indexOf(tonality) -9];
        } else {
          tonality = names[names.indexOf(tonality)+3];
        }
        //tonalityIndex is the same!!!
      }
      if(isModulating && nameChord.charAt(0).toLowerCase()==tonality){ //C - E - A -> A major not A major/minor (tonic of the new tonality)
        isModulating=false; // resolved
      }
      //tonality = tonality;
    }
  }
}
