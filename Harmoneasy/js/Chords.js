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
    '[4,6]' : [0, 'm maj7', 'm maj7'],
    '[6,2]' : [2, 'm maj7 1st inv', 'm maj7 1° riv'],
    '[2,4]' : [1, 'm maj7 2nd inv', 'm maj7 2° riv'],
    '[4,7]' : [0, 'maj7', 'maj7'],
    '[7,1]' : [2, 'maj7 1st inv', 'maj7 1° riv'],
    '[1,4]' : [1, 'maj7 2nd inv', 'maj7 2° riv'],
    '[3,8]' : [0, '7', '7'],
    '[8,1]' : [2, '7 1st inv', '7 1° riv'],
    '[1,3]' : [1, '7 2nd inv', '7 2° riv'],

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
    let lang = 1;
    let chordName = '_';
    //console.log(chord);
    if(typeof(chordField[0]) == 'number'){
      chordName = notes[chord[chordField[0]]%12] + chordField[lang];
    }
    else if(typeof(chordField[0]) == 'object'){
      chordName = notes[chord[chordField[0][0]]%12] + chordField[0][lang]
       + ' / ' +  notes[chord[chordField[1][0]]%12] + chordField[1][lang];
    }else{
      // errore
    }

    return chordName;
  }
}
