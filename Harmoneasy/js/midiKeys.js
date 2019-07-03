
var keysNotes= [60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79];
var bassNotes= [36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55];
//var keyboard = ["q","2","w","3","e","r","5","t","6","y","7","u","i","9","o","0","p","è"];
//var keys= "awsedftgyhujkolpòà+ù"
var keys= "q2w3er5t6y7ui9o0pèì"
var basskeys= "<azsxcfvgbhnmk,l.-à"

var buttonPressed = [];

//onkeydown
document.addEventListener("keydown", function(e){
  if(buttonPressed.indexOf(e.key) == -1){ //keydown of a key not pressed
    if(!e.repeat){
      var i = 0;
      var bass = false;
      var treble = false;

      if(keys.includes(e.key)){
        i = keys.indexOf(e.key);
        treble = true;
      }
      if(basskeys.includes(e.key)){
        i = basskeys.indexOf(e.key);
        bass = true;
      }
     if(renderChord.length > 0 && (treble && renderChord.indexOf(keysNotes[i])!=-1) || (bass && renderChord.indexOf(bassNotes[i])!=-1 )){
        //fix bug about onkeydown event
        console.log("errore");
      } else if(e.key==" "){
        detectTonality();
        plotTonality();
        add(renderChord);
      } else {
        buttonPressed.push(e.key);
        //console.log(buttonPressed);
        if(bass)
          noteOn(bassNotes[i]);
        if(treble)
          noteOn(keysNotes[i]);
      }
    }
  }
});

//onkeyup
document.addEventListener("keyup", function(e){

  var i = keys.indexOf(e.key);
  var x = basskeys.indexOf(e.key);
  if(i!=-1){
    noteOff(keysNotes[i]);
  } else {
    if(x!=-1){
      noteOff(bassNotes[x]);
    } else {
      console.log("keyup of a button not pressed...what!?")
    }
  }

  var j = buttonPressed.indexOf(e.key);
  if (j > -1) {
    buttonPressed.splice(j, 1);
  }
  //console.log(buttonPressed);
});
