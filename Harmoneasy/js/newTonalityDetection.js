function newTonalityDetection(){

  if(tempChord.length < 2)
    return;

  var tempChordInterval = [];
  for(var i = 1; i<tempChord.length; i++){
    tempChordInterval.push(tempChord[i] - tempChord[i-1]); //[60, 64, 63] -> [4, 3]
  }
  intervals = JSON.stringify(tempChordInterval);

  console.log("inter: "+tempChordInterval);

  let diatonic = false;

  if (arr.length==0 || tonality == ""){ //first chord (or tonality still not detected)
    if(Chords.isDiatonic(intervals)){

      // minor chord has two interpretations (see Chords.js)
      if(Chords.isMinor(intervals)){
        // as a first chord, we assume the minor is naming the tonality over the 6th chord
        rootPos = Chords.chordTable[intervals][0][0];
        tonality = midiToNote(tempChord[rootPos])[0];
        tonality = tonality.slice(0, tonality.indexOf('/')); // remove reference to the octave 'c/5' -> 'c'
        tonality = tonality + " minor";
        major = false;
      }
      // all other diatonic chords have a clear root, except the suspended for which we don't make assumptions about tonality
      else
      {
        rootPos = Chords.chordTable[intervals][0];
        if(Chords.isDominant(intervals))
          tonality = midiToNote(tempChord[rootPos]-7)[0];  // resolving one fifth below root
        else if(Chords.isSemidim(intervals))
          tonality = midiToNote(tempChord[rootPos]+1)[0];  // resolving a semitone above root
        else
          tonality = midiToNote(tempChord[rootPos])[0];    // major tonality
        tonality = tonality.slice(0, tonality.indexOf('/')); // remove reference to the octave 'c/5' -> 'c'
      }
    }
    else if(Chords.isMinorMaj7(intervals))
    {
      major = false;
      rootPos = Chords.chordTable[intervals][0];
      tonality = midiToNote(tempChord[rootPos][0]);
      tonality=tonality.slice(0, tonality.indexOf('/')); // remove reference to the octave 'c/5' -> 'c'
      tonality = tonality + " minor (harmonic/melodic)";
    }
    else if(Chords.isAugmented(intervals))
    {
      major = false;
      rootPos = Chords.chordTable[intervals][0];
      tonality = midiToNote(tempChord[rootPos]-3)[0];
      tonality=tonality.slice(0, tonality.indexOf('/')); // remove reference to the octave 'c/5' -> 'c'
      tonality = tonality + " minor (harmonic/melodic)";
    }

    if(tonality.length!=0) {
      if(tonality.length == 1) {
        tonalityIndex = tonalName.indexOf(tonality);
      } else {
          if(tonalName.indexOf(tonality[0])-3 < 0){
            tonalityIndex = tonalName.indexOf(tonality[0]) - 3 + 12;
          } else {
            tonalityIndex = tonalName.indexOf(tonality[0]) - 3;
          }
      }
    } else {
      tonality = "";
    }

  } else { // not first chord
    if (!(isSameTonality(tonalityIndex))){ // new chord has a note out of tonality

      // Minor cadence
      // e.g. C-E-Aminor => A minor, not A major
      // avoid minor 7 (II) but allow minor 7maj
      if(isModulating && Chords.isMinor(intervals) && Chords.getRoot(tempChordInterval, tempChord)==tonality){ 
        major = false;
        rootPos = Chords.chordTable[intervals][0];
        tonality = midiToNote(tempChord[rootPos])[0];    // minor or major tonality
        tonality = tonality.slice(0, tonality.indexOf('/')); // remove reference to the octave 'c/5' -> 'c'
        tonality = tonality + " minor";

        if(tonalName.indexOf(tonality[0])-3 < 0){
          tonalityIndex = tonalName.indexOf(tonality) - 3 + 12;
        } else {
          tonalityIndex = tonalName.indexOf(tonality) - 3;
        }
        isModulating=false;
      } else {
        if(Chords.isAugmented(intervals)){ // third grade of melodic minor scale -> modulation major-minor
                                           // not included in tonalMat
          major = false;
          rootPos = Chords.chordTable[intervals][0];
          tonality = midiToNote(tempChord[rootPos]-3)[0];
          tonality=tonality.slice(0, tonality.indexOf('/')); // remove reference to the octave 'c/5' -> 'c'
          tonality = tonality + " minor (harmonic/melodic)";

        } else if(Chords.isDiminished(intervals)) {
          tonality = "diminished";
          major = false;
        } else { // notewise identification of tonality
          console.log("notewise identification of tonality");
          isModulating = true;
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
          }
        }
      }

    } else { // no notes out of tonality

      if(!major && isRelativeMajorDominant(tempChord, intervals)){ // a - G (7) - C -> C major not A minor
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

      //C - E - A -> A major not A major/minor (tonic of the new tonality)
      if(isModulating && Chords.getRoot(tempChordInterval, tempChord)==tonality)
        isModulating=false;

    }
  }
}

function isRelativeMajorDominant(tempChord, intervals){
  var dominantIndex = tonalityIndex + 1;

  if(dominantIndex==12) {
    dominantIndex = 0;
  }
  console.log(dominantIndex);
  try{
    rootPos = Chords.chordTable[intervals][0];
  }catch(err){
    console.log("Intervals giving error: "+intervals)
  }
  root = midiToNote(tempChord[rootPos]);    // minor or major tonality
  if((Chords.isMajor(intervals) || Chords.isDominant(intervals)) &&
      root==tonalName[dominantIndex]) {
    return true;
  } else {
    return false;
  }
}