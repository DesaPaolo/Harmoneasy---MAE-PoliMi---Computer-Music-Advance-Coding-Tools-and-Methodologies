var VF =Vex.Flow;
var mc = "c/5";
var rest = "b/4";
var scorelength = 4;
var tonality = 0;
var old = -1;
var nameChord = '';
var oldNameChord = '';



var names = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];

var totscale = new Array();   // Create an array of 97 note number+names from (12; C0) to (108; B8)
for(var i=0; i<97; i++){
  totscale[i] = [i+12, names[i%12], Math.floor(i/12)];
}


// Create an SVG renderer and attach it to the DIV elements
var ext = document.getElementById("s1");    // S1 contains the main stave
var ext0 = document.getElementById("s0");   // S0 contains the preview stave
var renderer = new VF.Renderer(ext, VF.Renderer.Backends.SVG); // main
var renderer0 = new VF.Renderer(ext0, VF.Renderer.Backends.SVG); // preview

// Initalization of voice elements in the staff
var voice = new VF.Voice({num_beats: 4,  beat_value: 4});
var voice2 = new VF.Voice({num_beats: 4,  beat_value: 4});

// Initialization for notes in the preview staff
var prechord = new VF.Voice({num_beats: 1,  beat_value: 4});
var prebass = new VF.Voice({num_beats: 1,  beat_value: 4});

// Reize the svg panel:
renderer.resize(850, 280);
renderer0.resize(200,280);

// Get a drawing context:
var context = renderer.getContext();
var context0 = renderer0.getContext();

var stafflength = 700;

// main staff
var upStave = new VF.Stave(100, 50, stafflength);
var lowStave = new VF.Stave(100, 160, stafflength);

// preview staff
var upStavePreview = new VF.Stave(50, 50, 150);
var lowStavePreview = new VF.Stave(50, 160, 150);

var lineRight = new Vex.Flow.StaveConnector(upStave, lowStave).setType(1); // 1 = thin line
//var lineLeft = new Vex.Flow.StaveConnector(upStave, lowStave).setType(6); //bar end
var brace = new Vex.Flow.StaveConnector(upStave, lowStave).setType(3); // 3 = brace
brace.setContext(context).draw();

var lineRight0 = new Vex.Flow.StaveConnector(upStavePreview, lowStavePreview).setType(1); // 1 = thin line
//var lineLeft0 = new Vex.Flow.StaveConnector(upStavePreview, lowStavePreview).setType(6); //bar end
var brace0 = new Vex.Flow.StaveConnector(upStavePreview, lowStavePreview).setType(3); // 3 = brace
brace0.setContext(context0).draw();

upStave.addClef("treble");
lowStave.addClef("bass");
upStavePreview.addClef("treble");
lowStavePreview.addClef("bass");

upStave.setContext(context).draw();
lowStave.setContext(context).draw();

upStavePreview.setContext(context0).draw();
lowStavePreview.setContext(context0).draw();

lineRight.setContext(context).draw();
lineRight0.setContext(context0).draw();

// initialize toggle switches
var toggles = document.querySelectorAll('input[type="checkbox"]');

var arr = [];
/* arr is a bidimensional array of notes:
        - first dimension refers to the horizontal coordinate (related to the length of the score)
        - second dimension scans vertically the chords, giving stacked notes starting from the bass one
*/

var errarr = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];
/* errarr is a bidimensional array of color codes:
        - has a correspondance in position with arr, indicating special notes to be coloured*/

var midiarr = new Array();  // stack of old midichords for undo & cantus firmus analysis
var memidi = new Array();   // stack of old midichords for undo
var memarr = new Array();   // stack of old arr for undo operations
var memerr = new Array();   // stack of old errarr for undo operations



// remove all notes from preview staff
function cleanScore0(){
  if(prechord.getTickables().length){
    prechord.tickables[0].attrs.el.remove();
  }
  if(prebass.getTickables().length){
    prebass.tickables[0].attrs.el.remove();
  }
}

// remove all notes from main staff
function cleanScore(){
  if(voice.getTickables().length){
    try{
    voice.tickables[0].attrs.el.remove();
    voice.tickables[1].attrs.el.remove();
    voice.tickables[2].attrs.el.remove();
    voice.tickables[3].attrs.el.remove();
    }catch(err){
      console.log(err.message);
    }
  }

  if(voice2.getTickables().length){
    voice2.tickables[0].attrs.el.remove();
    voice2.tickables[1].attrs.el.remove();
    voice2.tickables[2].attrs.el.remove();
    voice2.tickables[3].attrs.el.remove();
  }
}

// renderer of main staff
function render() {

      cleanScore();

      var l = arr.length;

      var notes = new Array();
      var bass = new Array();

      for(var j=l-1; j>=0; j--){ // for each chord on the sheet
          var chord = arr[l-j-1];
          var ll = chord.length-1;
          var dx = chord.slice(1,chord.length);   // right hand notes (voices 1,2,3)
          var sx = new Array(chord[0]);           // left hand notes (voice 0)

          bass[4-j-1] = new VF.StaveNote({clef: "bass", keys: sx, duration: "q" });
          if(sx[0][1]=="#")
            bass[4-j-1].addAccidental(0, new VF.Accidental('#'));

          if(errarr[4-j-1]!=undefined && errarr[4-j-1][0] != 0){ // painting errors on bass
            switch(errarr[4-j-1][0]){
              case TRI:
                if(toggles[0].checked)
                  bass[4-j-1].setKeyStyle(0,{ fillStyle: errarr[4-j-1][0], strokeStyle: errarr[4-j-1][0] });
                break;
              case PAR:
                if(toggles[1].checked)
                  bass[4-j-1].setKeyStyle(0,{ fillStyle: errarr[4-j-1][0], strokeStyle: errarr[4-j-1][0] });
                break;
              case RES:
                if(toggles[2].checked)
                  bass[4-j-1].setKeyStyle(0,{ fillStyle: errarr[4-j-1][0], strokeStyle: errarr[4-j-1][0] });
                break;
              case SEV:
                if(toggles[3].checked)
                  bass[4-j-1].setKeyStyle(0,{ fillStyle: errarr[4-j-1][0], strokeStyle: errarr[4-j-1][0] });
                break;
              case CF:
                if(toggles[4].checked)
                  bass[4-j-1].setKeyStyle(0,{ fillStyle: errarr[4-j-1][0], strokeStyle: errarr[4-j-1][0] });
            }
          }

          if(dx.length>1){
            notes[4-j-1] = new VF.StaveNote({clef: "treble", keys: dx, duration: "q" });
            for(var i=0; i<dx.length; i++){
              if(dx[i][1]=="#")
                notes[4-j-1].addAccidental(i, new VF.Accidental('#'));

              if(errarr[4-j-1]!=undefined && errarr[4-j-1][i+1] != 0){ // painting errors on high voices
                switch(errarr[4-j-1][i+1]){
                  case TRI:
                    if(toggles[0].checked)
                      notes[4-j-1].setKeyStyle(i, { fillStyle: errarr[4-j-1][i+1], strokeStyle: errarr[4-j-1][i+1] });
                    break;
                  case PAR:
                    if(toggles[1].checked)
                      notes[4-j-1].setKeyStyle(i, { fillStyle: errarr[4-j-1][i+1], strokeStyle: errarr[4-j-1][i+1] });
                    break;
                  case RES:
                    if(toggles[2].checked)
                      notes[4-j-1].setKeyStyle(i, { fillStyle: errarr[4-j-1][i+1], strokeStyle: errarr[4-j-1][i+1] });
                    break;
                  case SEV:
                    if(toggles[3].checked)
                      notes[4-j-1].setKeyStyle(i, { fillStyle: errarr[4-j-1][i+1], strokeStyle: errarr[4-j-1][i+1] });
                    break;
                  case CF:
                    if(toggles[4].checked)
                      notes[4-j-1].setKeyStyle(i, { fillStyle: errarr[4-j-1][i+1], strokeStyle: errarr[4-j-1][i+1] });
                    break;
                }
                // console.log("analysis of errarr: "+errarr[4-j-1][i+1]);
              }
            }
          }
          else{
            notes[4-j-1] = new VF.StaveNote({clef: "treble", keys: [rest], duration: "qr" });
          }

      } // for each empty space in arr, draw a rest on the main stave
      for(var j = 3-l; j>=0; j--){
          notes[j] = new VF.StaveNote({clef: "treble", keys: [rest], duration: "qr" });
          bass[j]= new VF.StaveNote({clef: "bass", keys: [rest], duration: "qr" });
      }

    voice = new VF.Voice({num_beats: 4,  beat_value: 4});
    voice2 = new VF.Voice({num_beats: 4,  beat_value: 4});

    voice.addTickables(notes);
    voice2.addTickables(bass);

    // Format and justify the notes to 400 pixels.
    var formatter = new VF.Formatter().joinVoices([voice, voice2]).format([voice, voice2], 700);

    // Render voice
    voice.draw(context, upStave);
    voice2.draw(context, lowStave);
}

// renderer of left staff
function render0() {

  cleanScore0();
  if(renderChord.length < 1)
    return;
  chord = buildChord(renderChord);

  var notes = new Array();
  var bass = new Array();

  var ll = chord.length-1;
  var dx = chord.slice(1,chord.length);
  var sx = new Array(chord[0]);

  bass[0] = new VF.StaveNote({clef: "bass", keys: sx, duration: "q" });
  if(sx[0][1]=="#")
    bass[0].addAccidental(0, new VF.Accidental('#'));

  if(dx.length){
    notes[0] = new VF.StaveNote({clef: "treble", keys: dx, duration: "q" });
    //console.log(notes);
    for(var i=0; i<dx.length; i++){
      if(dx[i][1]=="#")
        notes[0].addAccidental(i, new VF.Accidental('#'));
    }
  }
  else
  {
    notes[0] = new VF.StaveNote({clef: "treble", keys: [rest], duration: "qr" });
  }

  //notes = new VF.StaveNote({clef: "treble", keys: [rest], duration: "qr" });
  //bass = new VF.StaveNote({clef: "bass", keys: [rest], duration: "qr" });

  prechord = new VF.Voice({num_beats: 1,  beat_value: 4});
  prebass = new VF.Voice({num_beats: 1,  beat_value: 4});

  prechord.addTickables(notes);
  prebass.addTickables(bass);

  // Format and justify the notes in the stave
  var formatter = new VF.Formatter().joinVoices([prechord, prebass]).format([prechord, prebass], 700);

  // Render voice
  prechord.draw(context0, upStavePreview);
  prebass.draw(context0, lowStavePreview);
}

function add(newChord){ // b must be an array of length>0 containing midinotes
  var errnew = [0,0,0,0];
  if(midiarr.length>=scorelength)
  	midiarr.shift();
  midiarr.push([...newChord]); // push a copy of the new chord in midiarr
  if(old!=-1){  // if not the first chord
    errnew = (motionAnalysis(newChord, old, tonality, oldNameChord));   // compute motion analysis on the last two chords
  if (toggles[4].checked)   // if melodic analysis is enabled
    	errnew = cantusFirmus(errnew); // compute further analysis on the treble voice
  }

  //if(midiarr.length>=scorelength)
  errarr.shift();
  errarr.push(errnew);

  old = newChord.slice(0,newChord.length);
  oldNameChord=nameChord;

  newChord = buildChord(newChord);
	if(arr.length>=scorelength){
	  arr.shift(); // delete first chord and shift
      memarr.push(arr[0]);
      memerr.push(errarr[0]);
      memidi.push(midiarr[0]);
    }
  	arr.push(newChord); 		// push new chord
    render();
}


function cantusFirmus(errnew){

	const TONE=2, MAJ3=4, MIN3=3, FOURTH=5, TRITONE=6, FIFTH=7, MIN6=8, MAJ6=9, MIN7=10, MAJ7=11, OCTAVE=12;

	var cantus = new Array();
	var cfidx;
	for(var j = 0; j<midiarr.length; j++){
		cfidx = midiarr[j].length-1;
		cantus[j] = midiarr[j][cfidx];
	}

	var last = cantus.length-1;
	//console.log(cantus);

	var leaps = new Array();
	for(var j=1; j<cantus.length; j++)
		leaps[j] = cantus[j] - cantus[j-1]; // build up a differential array


  // Cantus firmus rules
  /*

	Assunzione:
		il progetto, inteso come ausilio all'analisi e allo studio dell'armonia, focalizza l'attenzione su un breve estratto (4) di accordi:
		per una trattazione rilevante di Cantus firmus e, più in generale, di melodia e contrappunto,
		sarebbe necessaria una gestione più elastica del tempo, la possibilità di inserire note di passaggio,
		e l'integrazione del concetto di cadenza, che necessiterebbero di un'applicazione strutturalmente diversa, ad hoc.
		E' quindi da considerarsi segnalazione, nel set di funzioni Cantus Firmus, un'indicazione sul moto affidato al soprano,
		non come regola, ma come segnale che suggerisce una attenzione nel renterpretare il canto in corrispondenza di
		dissonanze o salti, qualora si desiderasse sviluppare il discorso armonico in un vero e proprio estratto di brano.


  	No non-diatonic chromaticism

  */

  	// leaps
  	if(Math.abs(leaps[last])>TONE){
  		if(Math.abs(leaps[last])>FIFTH)
  			if(!  (Math.abs(leaps[last]) == OCTAVE || (leaps[last] == MIN6)) ){
  				errnew[errnew.length-1] = CF; 		// if larger than a perfect fifth, then only octave and ascending sixth permissible
          console.log("leap>5");
          }
  		if(Math.abs(leaps[last-1])>TONE){ // two successive leaps
    			if((!(Math.abs(leaps[last-1])<FOURTH && Math.abs(leaps[last])<FIFTH)) && (Math.sign(leaps[last-1])==Math.sign(leaps[last])) ) //  pattern third-fourth, third-third -> permissible
  				    {errnew[errnew.length-1] = CF; console.log("twoleaps");}

    			if(Math.abs(leaps[last-1]) == MAJ3 && leaps[last] == leaps[last-1]) // no maj3 - maj3
      				errnew[errnew.length-1] = CF;
      			if(Math.abs(leaps[last-1]) == MIN3 && leaps[last] == leaps[last-1]) // neither min3 - min3
      				errnew[errnew.length-1] = CF;


    			if(leaps[last] + leaps[last-1] == OCTAVE) // ascending pattern fifth-four -> permissible
    				if(! (leaps[last-1]==FIFTH && leaps[last]==FOURTH ))
    					errnew[errnew.length-1] = CF;
    			if(leaps[last] - leaps[last-1] == -OCTAVE)
    				if(! (leaps[last-1]==-FOURTH && leaps[last]==-FIFTH))
    					errnew[errnew.length-1] = CF;
  		}

  	}


  	if(Math.max.apply(null, cantus)-Math.min.apply(null,cantus) > 17) // range above tenth
  		errnew[errnew.length-1] = CF;

	if(	(toggles[4].checked) &&
			// two ascending leaps after ascending step
			(cantus[last]-cantus[last-1]>2 && cantus[last-1]-cantus[last-2]>2 && cantus[last-2]-cantus[last-3]>0)
			// two descending leaps after descending step
		||	(cantus[last]-cantus[last-1]<-2 && cantus[last-1]-cantus[last-2]<-2 && cantus[last-2]-cantus[last-3]<0)
			// two descending leaps before descending step
		||	(cantus[last]-cantus[last-1]<0 && cantus[last-1]-cantus[last-2]<-2 && cantus[last-2]-cantus[last-3]<-2)
			// two ascening leaps before ascending step
		||	(cantus[last]-cantus[last-1]>0 && cantus[last-1]-cantus[last-2]>2 && cantus[last-2]-cantus[last-3]>2)
		){
		errnew[errnew.length-1] = CF;

	}

	console.log(errnew[errnew.length-1]);

	if(errnew[errnew.length-1] == CF && (toggles[4].checked)){
		var txt = document.getElementById('logarea');
		txt.innerHTML = "<p style=\"color: green\">"+" ["+nameChord+"]: "+msg[lang][IDXCF3]+"</p>"+txt.innerHTML;
	}
	return errnew;
}

// MIDI note number to note name conversion
function midiToNote(n){
	return [totscale[n][1]+"/"+totscale[n][2]];
}

// sort the notes from bass to treble
function buildChord(midichord){
	midichord.sort(sortNumber);
	var out = new Array();

	for(var j=0;j<midichord.length;j++)
		out = out.concat(midiToNote(midichord[j]));

	return out;
}

// remove the last chord from staff
function undo(){
  // remove last entry of the processing array
  arr.pop();
  errarr.pop();

  var popped = memarr.pop();
  var error = memerr.pop();
  var midichord = midiarr.pop();

  if(popped!=undefined)
    arr.unshift(popped);
  else
    arr.unshift();

  errarr = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];

/*
  if(error!=undefined)
    errarr.unshift(error);
  else
    errarr.unshift([] );
*/

  if(midichord!=undefined)
  	midiarr.unshift(midichord);
  else
  	midiarr.unshift([]);

  if(midiarr.length>0){
    old = midiarr[midiarr.length-1];
  } else {
    old=-1;
  }

  render();
}

function updateNameChord(n){
  nameChord = n;
}

//document.body.addEventListener("load", function(){changeLang(true)});
document.getElementById("lang").addEventListener("click", function(){changeLang('0')});
