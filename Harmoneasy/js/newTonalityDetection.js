function newTonalityDetection(){

  // ignore bichords
  if(tempChord.length < 2)
    return;

  // convert MIDI-notes to intervallic structure
  var tempChordInterval = [];
  for(var i = 1; i<tempChord.length; i++){
    tempChordInterval.push(tempChord[i] - tempChord[i-1]); //[60, 64, 63] -> [4, 3]
  }
  intervals = JSON.stringify(tempChordInterval);

  console.log("inter: "+tempChordInterval);

  let diatonic = false;

  if (arr.length==0 || tonality == ""){ //first chord (or tonality still not detected)

    console.log("TD: First chord");

    if(Chords.isDiatonic(intervals)){

      console.log("\tTD: Diatonic chord");

      // minor chord has two interpretations (see Chords.js)
      if(Chords.isMinor(intervals)){

        console.log("\t\tTD: Minor chord");

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

        console.log("\t\tTD: Non-minor chord");

        rootPos = Chords.chordTable[intervals][0];
        if(Array.isArray(rootPos))
          rootPos = rootPos[0];
        if(Chords.isDominant(intervals))
        {
          console.log("\t\t\tTD: Dominant chord");
          tonality = midiToNote(tempChord[rootPos]-7)[0];  // resolving one fifth below root
        }
        else if(Chords.isSemidim(intervals)){
          console.log("\t\t\tTD: Semidim chord");
          tonality = midiToNote(tempChord[rootPos]+1)[0];  // resolving a semitone above root
        }
        else
        {
          console.log("\t\t\tTD: By exclusion, major chord");
          tonality = midiToNote(tempChord[rootPos])[0];    // major tonality
        }
        tonality = tonality.slice(0, tonality.indexOf('/')); // remove reference to the octave 'c/5' -> 'c'
      }
    }
    // if non diatonic
    else if(Chords.isMinorMaj7(intervals))
    {
      console.log("\tTD: MinorMaj7 chord");
      major = false;
      rootPos = Chords.chordTable[intervals][0];
      tonality = midiToNote(tempChord[rootPos][0]);
      tonality=tonality.slice(0, tonality.indexOf('/')); // remove reference to the octave 'c/5' -> 'c'
      tonality = tonality + " minor (harmonic/melodic)";
    }
    else if(Chords.isAugmented(intervals))
    {
      console.log("\tTD: Augmented chord");
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

    console.log("TD: Not first chord");

    if (!(isSameTonality(tonalityIndex))){ // new chord has a note out of tonality

      console.log("\tTD: New tonality");

      // Minor cadence
      // e.g. C-E-Aminor => A minor, not A major
      // avoid minor 7 (II) but allow minor 7maj
      if(isModulating && Chords.isMinor(intervals) && Chords.getRoot(tempChordInterval, tempChord)==tonality){ 

        console.log("\t\tTD: Minor cadence");

        major = false;
        rootPos = Chords.chordTable[intervals][0][0];
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

        console.log("\t\tTD: Not minor cadence");

        if(Chords.isAugmented(intervals)){ // third grade of melodic minor scale -> modulation major-minor
                                           // not included in tonalMat
          
          console.log("\t\t\tTD: Modulating augmented");

          major = false;
          rootPos = Chords.chordTable[intervals][0];
          if(Array.isArray(rootPos))
            rootPos = rootPos[0];
          tonality = midiToNote(tempChord[rootPos]-3)[0];
          tonality=tonality.slice(0, tonality.indexOf('/')); // remove reference to the octave 'c/5' -> 'c'
          tonality = tonality + " minor (harmonic/melodic)";

        } else if(Chords.isDiminished(intervals)) {

          console.log("\t\t\tTD: Modulating diminished");

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

      console.log("\tTD: same tonality");

      if(!major && isRelativeMajorDominant(tempChord, intervals)){ // a - G (7) - C -> C major not A minor

        console.log("\t\tTD: RelativeMajorDominant");

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

      try{
      //C - E - A -> A major not A major/minor (tonic of the new tonality)
        if(isModulating && Chords.getRoot(tempChordInterval, tempChord)==tonality){
          console.log("\t\tTD: RelativeMajorModulation");
          isModulating=false;
        }
      } catch {
        console.log("ECCEZIONE");
        console.log(tempChordInterval);
        console.log(tempChord);
      }
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
    if(Array.isArray(Chords.chordTable[intervals][0]))
      rootPos = Chords.chordTable[intervals][0][0];
    else
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