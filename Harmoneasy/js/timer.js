

function startTimer(){
  var millisec = 500; //500
  var timer = setInterval(function(){
    document.getElementById("meter").value = millisec;
    millisec--;
    if(tempChord.length==0 || renderChord.length==0)
      stopTimer(timer);
    else if (millisec < 0) {
//      console.log("TIME OUT");
      detectTonality();
      plotTonality();

      if(renderChord.length!=0)
        add(renderChord);

      stopTimer(timer);

    }
  }, 1);
}

function stopTimer(timer){
  clearInterval(timer);
  document.getElementById("meter").value = 500;
}
