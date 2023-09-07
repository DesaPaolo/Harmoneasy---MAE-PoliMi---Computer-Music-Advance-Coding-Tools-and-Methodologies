class Chords{

  static chordTable = {
    // bichords
    '7': [0, '5', '5'],
    '4': [0, '3M', '3M'],
    '3': [0, '3m', '3m'],
    '5': [0, '4', '4'],

    // triads
    '[4,3]' : [0, ' major', ' maggiore'],
    '[3,5]' : [2, ' 1st inv', ' 1° riv'],
    '[5,4]' : [1, ' 2nd inv', ' 2° riv'],
    '[3,4]' : [[0, 'm', 'm'],
              [1, ' maj 6 2nd inv', ' magg 6 2° riv']],
    '[4,5]' : [[2, 'm 1st inv', 'm 1° riv'],
              [0, '6', '6']],
    '[5,3]' : [[1, 'm 2nd inv', 'm 2° riv'],
              [2, '6 1st inv', '6 1° riv']],
    '[3,3]' : [[0, 'm b5', 'm b5'],
              [1, 'm6 2nd inv', 'm6 2° riv']],
    '[3,6]' : [[2, 'm b5 1st inv', 'm b5 1° riv'],
              [0, 'm6', 'm6']],
    '[6,3]' : [[1, 'm b5 2nd inv', 'm b5 2° riv'],
              [2, 'm6 1st inv', 'm6 1° riv']],
    '[4,4]' : [0, '+', '+'],
    '[5,2]' : [[0, 'sus4', 'sus4'],
              [1, 'sus2 2nd inv', 'sus2 2° riv']],
    '[2,5]' : [[2, 'sus4 1st inv', 'sus4 1° riv'],
              [0, 'sus2', 'sus2']],
    '[5,5]' : [[1, 'sus4 2nd inv', 'sus4 2° riv'],
              [2, 'sus2 1st inv', 'sus2 1°riv']],
    '[3,7]' : [0, 'm7', 'm7'],
    '[7,2]' : [2, 'm7 1st inv', 'm7 1° riv'],
    '[2,3]' : [1, 'm7 2nd inv', 'm7 2° riv'],
    '[4,6]' : [0, '7', '7'],
    '[6,2]' : [2, '7 1st inv', '7 1° riv'],
    '[2,4]' : [1, '7 2nd inv', '7 2° riv'],
    '[4,7]' : [0, 'maj7', 'maj7'],
    '[7,1]' : [2, 'maj7 1st inv', 'maj7 1° riv'],
    '[1,4]' : [1, 'maj7 2nd inv', 'maj7 2° riv'],
    '[3,8]' : [0, 'm maj7', 'm 7 magg'],
    '[8,1]' : [2, 'm maj7 1st inv', 'm 7 magg 1° riv'],
    '[1,3]' : [1, 'm maj7 2nd inv', 'm 7 magg 2° riv'],

    // tetrachords
    '[3,4,3]' : [0, 'm7', 'm7'],
    '[4,3,2]' : [3, 'm7 1st inv', 'm7 1° riv'],
    '[3,2,3]' : [2, 'm7 2nd inv', 'm7 2° riv'],
    '[2,3,4]' : [1, 'm7 3rd inv', 'm7 3° riv'],
    '[4,3,4]' : [0, 'm7', 'm7'],
    '[3,4,1]' : [3, ' maj7 1st inv', ' maj7 1° riv'],
    '[4,1,4]' : [2, ' maj7 2nd inv', ' maj7 2° riv'],
    '[1,4,3]' : [1, ' maj7 3rd inv', ' maj7 3° riv'],
    '[4,3,3]' : [0, '7', '7'],
    '[3,3,2]' : [3, '7 1st inv', '7 1° riv'],
    '[3,2,4]' : [2, '7 2nd inv', '7 2° riv'],
    '[2,4,3]' : [1, '7 3nd inv', '7 3° riv'],
    '[3,4,4]' : [0, 'm maj7', 'm maj7'],
    '[4,4,1]' : [3, 'm maj7 1st inv', 'm maj7 1° riv'],
    '[4,1,3]' : [3, 'm maj7 2st inv', 'm maj7 2° riv'],
    '[1,3,4]' : [3, 'm maj7 3st inv', 'm maj7 3° riv'],
    '[3,3,3]' : [0, ' dim', ' dim'],
    '[3,3,4]' : [0, ' half dim', ' semidim'],
    '[3,4,2]' : [3, ' half dim 1st inv', ' semidim 1° riv'],
    '[4,2,3]' : [2, ' half dim 2st inv', ' semidim 2° riv'],
    '[2,3,3]' : [1, ' half dim 3st inv', ' semidim 3° riv']
  }

  static notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  static getName(chordIntervals, chord){
    let chordField = Chords.chordTable[chordIntervals];
    if(chordField == undefined)
      return '';
    //let lang = 1;
    let chordName = '_';
    //console.log(chord);
    if(typeof(chordField[0]) == 'number'){
      chordName = Chords.notes[chord[chordField[0]]%12] + chordField[lang+1];
    }
    else if(typeof(chordField[0]) == 'object'){
      chordName = Chords.notes[chord[chordField[0][0]]%12] + chordField[0][lang+1]
       + ' / ' +  Chords.notes[chord[chordField[1][0]]%12] + chordField[1][lang+1];
    }else{
      // errore
    }

    return chordName;
  }

  static isChord(chord){
    // chord = JSON.stringify(chord);
    if(Chords.chordTable[chord])
      return true;
    else
      return false;
  }

  // chord = interval array (e.g. [4,3])
  static isSus(chord){

    if(!Chords.isChord(chord))
      return false;

    // chord = JSON.stringify(chord);
    if( chord === "[5,2]" || chord === "[5,5]" || chord === "[2,5]")
      return true;
    else
      return false;
  }

  static hasRoot(chord){

    if(!Chords.isChord(chord))
      return false;

    // chord = JSON.stringify(chord);
    if(Chords.chordTable[chord].length == 2)
      return false;
    else
      return true;
  }

 static isMinorMaj7(chord){
    
    if(!Chords.isChord(chord))
      return false;

    // chord = JSON.stringify(chord);
    if(chord === '[3,8]' ||
      chord === '[8,1]' ||
      chord === '[1,3]' ||
      chord === '[3,3,3]' || 
      chord === '[3,4,4]' || 
      chord === '[4,4,1]' || 
      chord === '[4,1,3]' || 
      chord === '[1,3,4]')
      return true;
    else
      return false;
  }

  static isAugmented(chord){

    if(!Chords.isChord(chord))
      return false;

    // chord = JSON.stringify(chord);
    if(chord === '[4,4]')
      return true;
    else
      return false;
  }

  static isDiatonic(chord){
    
    if(!Chords.isChord(chord) || Chords.isMinorMaj7(chord) || Chords.isDiminished(chord))
      return false;

    // chord = JSON.stringify(chord);
    if(chord === '[4,4]')
      return false;
    else
      return true;
  }

  static isMajor(chord){

    if(!Chords.isDiatonic(chord))
      return false;

    if(Chords.isSemidim(chord) || Chords.isDiminished(chord) || Chords.isAugmented(chord) || Chords.isMinor(chord))
      return false;

    return true;
  }

  static isDominant(chord){
      if(chord === '[4,6]'
        || chord === '[6,2]'
        || chord === '[2,4]'
        || chord === '[4,3,3]'
        || chord === '[3,3,2]'
        || chord === '[3,2,4]'
        || chord === '[2,4,3]')
        return true;
    return false;
  }

  static isDiminished(chord){
    // chord = JSON.stringify(chord);
    if(chord === '[3,3,3]')
      return true;
    else
      return false;
  }

  static isMinor(chord){

    if(!Chords.isDiatonic(chord))
      return false;

    // chord = JSON.stringify(chord);
    if(Chords.chordTable[chord][0][1] == 'm')
      return true;
    return false;
  }

  static isSemidim(chord){

    if(!Chords.isChord(chord))
      return false;

    // chord = JSON.stringify(chord);
    if(  chord === '[3,3]'
      || chord === '[3,6]'
      || chord === '[6,3]'
      || chord === '[3,3,4]'
      || chord === '[3,4,2]'
      || chord === '[4,2,3]'
      || chord === '[2,3,3]'
      )
      return true;
    else
      return false;
  }

  static getRoot(intervals, chord){
    i = Chords.chordTable[JSON.stringify(intervals)][0]
    if(Array.isArray(i))
      i = i[0];
    return midiToNote(chord[i]);
  }

}
