function motionAnalysis(newChord, oldChord, tonality, oldNameChord){

  var dissonances = [6,10,11]; // tritone and seventh leap aren't accepted in cantus firmus

  var newlen = newChord.length;
  var oldlen = oldChord.length;
  var errors = new Array(newlen);
  var txt = document.getElementById('logarea');
  errors.fill(0);


  // MOTION
  var motion = new Array(newlen);      // TODO: creare motion anche quando oldlen != newlen: capire quale voce è raddopiata all'unisono
  if( oldlen == newlen)
    for(var i=0; i<newlen; i++){
      motion[i] = (newChord[i]-oldChord[i]);
      //console.log("---> motion "+i+": "+newChord[i]+" - "+oldChord[i]);
    }

  var cantusMotion = newChord[newChord.length-1] - oldChord[oldChord.length-1];


  //  TRITONE ERROR
  for(var i=0; i<newlen; i++)
    for(var j=0; j<oldlen; j++)
      if( Math.abs(newChord[i]-oldChord[j]) == 6)     // if a note is a tritone distant from a past note
        if( newChord[i] != oldChord[i] ){               // if the tritone wasn't already present in oldChord
          errors[i] = TRI;
          //console.log("---xxx---> tritone");
          if(toggles[0].checked)
          	txt.innerHTML = "<p style=\"color: blue\">"+" ["+nameChord+"]: "+msg[lang][IDXTRI1]+(i)+msg[lang][IDXTRI2]+(j)+"</p>"+txt.innerHTML;
        }

  // HIDDEN PARALLEL INTERVALS
  var check;
  if( oldlen == newlen)
    for(var i=1; i<newlen; i++)
      for(var j=0; j<i; j++){
        check = (newChord[i]-newChord[j])%12;
        if(check==0 || check%7==0) // if the interval is fifth or octave
          if(Math.sign(motion[i]) == Math.sign(motion[j])){ // and it's reached by moto recto
            errors[i]=PAR;
            errors[j]=PAR;
            if(toggles[1].checked)
            	txt.innerHTML = "<p style=\"color: brown\">"+" ["+nameChord+"]: "+msg[lang][IDXPAR1]+i+" & "+j+" "+msg[lang][IDXPAR2]+"</p>"+txt.innerHTML;
          }
      }

  //RESOLUTION OF LEADING TONE
  for (var i=0; i<oldlen; i++) {
    if(isLeadingTone(oldChord[i])){
      if(motion[i] != 1){
        errors[i]=RES;
        if(toggles[2].checked)
        	txt.innerHTML = "<p style=\"color: red\">"+" ["+nameChord+"]: "+msg[lang][IDXLEAD]+"</p>"+txt.innerHTML;
      }
    }
  }

  //RESOLUTION OF SEVENTH
  if(oldNameChord.includes("dominant")){
    var seventhIndex =0;
    if(oldNameChord.includes("triad")){
      if(oldNameChord.includes("root")){
        i=2;
      } else if(oldNameChord.includes("first")){
        i=1;
      } else { //second riv
        i=0;
      }
    } else {
      if(oldNameChord.includes("root")){
        i=3;
      } else if(oldNameChord.includes("first")){
        i=2;
      } else if(oldNameChord.includes("second")){
        i=1;
      } else { //third riv
        i=0;
      }
    }
    if(motion[i] != -1){ //seventh does not resolve 1 half step below
      //errore
      errors[i] = SEV;
      if(toggles[3].checked)
      	txt.innerHTML = "<p style=\"color: red\">"+" ["+nameChord+"]: "+msg[lang][IDXSVN]+"</p>"+txt.innerHTML;
    }
  }

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



  	Leaps -> abs(j)>tone
  		if(abs(j)/j == abs(j_old)/j_old) error();

  		if j>fifth
  			if(! ((j == octave || j == min_sixth) && abs(j_old)/j_old == -1) )
  				error();
  		if j<-fifth
  			if(! (j == -octave && abs(j_old)/j_old == 1 ) )
  				error();

  		if abs(j_old)>tone
  			if(! (abs(j_old)<fourth && abs(j)<fifth) )
				error();
  			if j_old+j == octave
  				if(! (j_old==fifth && j==fourth )
  					error();
  			if j_old+j == -octave
  				if(! (j_old==-fourth && j == -fifth) )
  			if abs(j_old) == maj3 && abs(j) == maj3
  				error();
  			if abs(j_old) == min3 && abs(j) == min3
  				error();
  */

  // non-diatonic chromaticism

  // no dissonant intervals (aug-dim, seventh)
  if (dissonances.includes(cantusMotion)){
    errors[errors.length-1] = CF;
    if(toggles[4].checked)
      txt.innerHTML = "<p style=\"color: green\">"+" ["+nameChord+"]: "+msg[lang][IDXCF1]+"</p>"+txt.innerHTML;
  }

  // no repeated notes
  if(cantusMotion==0)                       {
    errors[errors.length-1] = CF;
    if(toggles[4].checked)
      txt.innerHTML = "<p style=\"color: green\">"+" ["+nameChord+"]: "+msg[lang][IDXCF2]+"</p>"+txt.innerHTML;
  }


  return errors;
}
