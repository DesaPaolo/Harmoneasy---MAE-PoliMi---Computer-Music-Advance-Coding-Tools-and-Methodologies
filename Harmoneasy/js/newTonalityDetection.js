function detectTonality(){

  // ignore bichords
  if(tempChord.length < 2){
    console.log("TD: ignored "+tempChord+" input");
    return;
  }

  // convert MIDI-notes to intervallic structure
  var tempChordInterval = [];
  for(var i = 1; i<tempChord.length; i++){
    tempChordInterval.push(tempChord[i] - tempChord[i-1]); //[60, 64, 63] -> [4, 3]
  }
  intervals = JSON.stringify(tempChordInterval);

  console.log("inter: "+tempChordInterval);

  let diatonic = false;

  if(Chords.isDominant(intervals))
  {
    console.log("TD: Dominant chord");

    rootPos = Chords.chordTable[intervals][0];
          if(Array.isArray(rootPos))
            rootPos = rootPos[0];

    tonality = midiToNote(tempChord[rootPos]-7)[0];  // resolving one fifth below root
    tonality = tonality.slice(0, tonality.indexOf('/')); // remove reference to the octave 'c/5' -> 'c'
    tonality = tonality + " major/minor";
    tonalityIndex = undefined;
    return;
  }
  else if (Chords.isMinorMaj7(intervals) || Chords.isAugmented(intervals) || Chords.isDiminished(intervals))
  {
    console.log("TD: Minor tonality chord");
    tonality = "unknown";
    tonalityIndex = undefined;
    return;
  }
  else if (arr.length!=0 && tonalityIndex!=undefined)  // not first chord, and not undefined tonality
  {

    console.log("\tTD: Not first chord");

    // cadence from dominant chord
    if(isSameTonality(tonalityIndex) && tonality.indexOf("major/minor") && Chords.getRoot(tempChordInterval, tempChord)==tonality[0] && (Chords.isMinor(intervals) || Chords.isMajor(intervals)))
    {
      console.log("\t\tTD: Cadence from dominant chord");
      tonality = tonality.slice(0, tonality.indexOf(" "));
      if(Chords.isMajor(intervals))
      {
        tonalityIndex = tonalName.indexOf(tonality);
        tonality = tonality + "major";
      }
      else if(Chords.isMinor(intervals))
      {
        tonalityIndex = tonalName.indexOf(tonality);
        tonalityShift(-3); // relative major scale
        tonality = tonality + "minor";
      }
      return;
    }
    // new chord has a note out of tonality
    else if ( !(isSameTonality(tonalityIndex)) && tonalityIndex!=undefined && Chords.isChord(intervals))
    { 

      console.log("\t\tTD: New tonality");

      rootPos = Chords.chordTable[intervals][0];
          if(Array.isArray(rootPos))
            rootPos = rootPos[0];

      let rootNote = Chords.getRoot(tempChordInterval, tempChord);
      rootNote = rootNote.slice(0, rootNote[0].indexOf("/"));

      // index of the root of the chord in the tonalNames array
      let chordIdx = tonalName.indexOf(rootNote[0].slice(0, rootNote[0].indexOf('/')));
      // if the chord corresponds to the fifth degree of the current relative minor tonality
      let isMinorFifth = ((chordIdx - tonalityIndex) == 4  || (chordIdx - tonalityIndex) == -8);

      // Dominant function
      // e.g. [Am]->E
      if(tonality.indexOf("minor") && Chords.isMajor(intervals) && !Chords.isMajorMaj7(intervals) && isMinorFifth){ 

        console.log("\t\t\tTD: Dominant function");

        let newTonic = midiToNote(tempChord[rootPos]-7);
        tonality = newTonic[0].slice(0, newTonic[0].indexOf('/'));  // remove reference to the octave 'c/5' -> 'c'

        tonalityIndex = undefined;
        
        tonality = tonality + " major/minor";
        return;
      } 
      else
      {
        // notewise identification of tonality
        notewiseDetection();
        return;
      }

    }
    else if(!isSameTonality(tonalityIndex))
    {
      notewiseDetection();
      return;
    }
    else
    { // no notes out of tonality

      console.log("\tTD: same tonality");
      return;
    }
  }
  
  if (Chords.isChord(intervals) && (arr.length==0 || tonalityIndex==undefined))
  { //first chord (or tonality still not detected by previous cases)

    console.log("TD: First chord");

    rootPos = Chords.chordTable[intervals][0];
          if(Array.isArray(rootPos))
            rootPos = rootPos[0];

    if(Chords.isMinor(intervals))
    {
      tonality = midiToNote(tempChord[rootPos])[0];
      tonality = tonality.slice(0, tonality.indexOf('/')); // remove reference to the octave 'c/5' -> 'c'
      tonalityIndex = tonalName.indexOf(tonality);
      tonalityShift(-3); // relative major
      tonality = tonality + " minor";
      return;
    }
    else if(Chords.isMajor(intervals))
    {
      tonality = midiToNote(tempChord[rootPos])[0];
      tonality = tonality.slice(0, tonality.indexOf('/')); // remove reference to the octave 'c/5' -> 'c'
      tonalityIndex = tonalName.indexOf(tonality);
      tonality = tonality + " major";
      return;
    }
    else if(Chords.isMinorSharp6(intervals)) // dorian chord
    {
      tonality = midiToNote(tempChord[rootPos] - 2)[0];
      tonality = tonality.slice(0, tonality.indexOf('/')); // remove reference to the octave 'c/5' -> 'c'
      tonalityIndex = tonalName.indexOf(tonality);
      tonalityShift(-2);
      tonality = tonality + " major";
      return;
    }
    else if(Chords.isMinorFlat2(intervals)) // phrygian chord
    {
      tonality = midiToNote(tempChord[rootPos] - 4)[0];
      tonality = tonality.slice(0, tonality.indexOf('/')); // remove reference to the octave 'c/5' -> 'c'
      tonalityIndex = tonalName.indexOf(tonality);
      tonalityShift(-4);
      tonality = tonality + " major";
      return;
    }
    else if(Chords.isMajorSharp4(intervals)) // lydian chord
    {
      tonality = midiToNote(tempChord[rootPos] - 5)[0];
      tonality = tonality.slice(0, tonality.indexOf('/')); // remove reference to the octave 'c/5' -> 'c'
      tonalityIndex = tonalName.indexOf(tonality);
      tonalityShift(1);
      tonality = tonality + " major";
      return;
    }
  }

  tonality = "";
  
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