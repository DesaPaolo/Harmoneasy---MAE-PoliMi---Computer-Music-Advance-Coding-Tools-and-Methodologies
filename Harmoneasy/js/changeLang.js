
IDXTITLE = 1;
IDXNAMECHORD = 2;
IDXTONALITY = 3;
IDXUNDO = 4;
IDXPAR1 = 5;
IDXPAR2 = 6;
IDXTRI1 = 7;
IDXTRI2 = 8;
IDXTONALITY2 = 9;
IDXTIMER = 10;
IDXCHORD2 = 11;
IDXBTNLBLS = 12;
IDXLEAD = 13;
IDXSVN = 14;
IDXMAJ = 15;
IDXMIN = 16;
IDXCFMSG = 17;
IDXSWCAP = 18;

IDXCF1 = 19; // dissonant interval
IDXCF2 = 20; // repeated note
IDXCF3 = 21; // prohibited leap

IDXTABHOME = 22;
IDXTABPLAY = 23;
IDXTITLEHOMEDESCR = 24;
IDXTITLEUSERMANUAL = 25;
IIDXHOMEDESCR = 26;
IDXUSERMANUAL = 27;




msg = [
  [
    "",
    "connect your MIDI keyboard, hold on chords to plot them and check harmony errors of your sequence",
    "it is not a chord",
    "Tonality: ",
    "undo",
    "parallels",
    "voices",
    "tritone between voice ",
    "and past voice ",
    "Cannot detect tonality",
    "Timer: ",
    "Detected chord: ",
    "Tritones <br><br> Parallels <br><br> Leading Tone <br><br> Seventh <br><br> Cantus Firmus",
    "Leading tone didn't resolve",
    "Dominant seventh didn't resolve correctly",
    "major",
    "minor",
    "cantus firmus alert",
    "Check if a note is a tritone distant from any note of past chord  <br><br> Check consecutives and hidden fifths/octaves  <br><br> Check if leading tone doesn't resolve  <br><br> Check if seventh of a dominant chord doesn't resolve  <br><br> Check if soprano voice respects the rules of Cantus Firmus ",
    "CF: dissonant interval",
    "CF: repeated note",
    "CF: hard leap",
    "Home",
    "Play",
    "What's HARMONEASY",
    "User Manual",
    "HARMONEASY is an user friendly and intuitive web application finalized to the music learning growth of the harmony student.<br> Through the implementation of the WebMIDI API - so the possibility to improve playing and touching with hand - HARMONEASY is able to help the student who is approaching to the study of the harmony (classic or not) in many ways:<br> - dynamic detection of the played chord (bichord, triad, tetrachord)<br> - tonality detection <br> - detection of the classic harmony errors (hidden/parallel fifth, octaves, tritones, resolution of the leading tone and sevenths) <br> - for the bravest, detection of the melody errors based on the Cantus Firmus rules",
    "1) Connect your MIDI keyboard to the usb port of your computer<br>2) Choose wich harmonic errors you want the application has to detect through the on/off of the red switch (initially off) <br>3) For each played chord HARMONEASY plots the notes on the right staff dynamically and shows the chord name <br> 4) Hold the chord on until the timer expires to plot it on the left staff<br> 5) Harmony errors of the chords sequence will be shown in the form of coloured note and captioned in the below section<br> 6) Your chords sequence will determine dinamically the tonality detection or, eventually, the modulation one<br> Click on 'Play' tab on the navigation bar to start!"
  ],
  [
    "",
    "connetti la tua tastiera MIDI, visualizza quello che suoni e controlla gli errori armonici della tua sequenza di accordi",
    "accordo non riconosciuto",
    "Tonalità: ",
    "annulla",
    "voci ",
    " formano 5° o 8° per moto retto",
    "tritono tra la voce ",
    " e la precedente ",
    "tonalità non riconosciuta",
    "Tempo: ",
    "Accordo rilevato: ",
    "Tritoni <br><br> Parallele <br><br> Sensibile <br><br> Settima <br><br> Cantus Firmus",
    "La sensibile non ha risolto sulla fondamentale",
    "La settima di dominante non ha risolto correttamente",
    "maggiore",
    "minore",
    "cantus firmus attenzione",
    "Controlla se una nota è a distanza di tritono con una qualsiasi dell'accordo precedente <br><br> Controlla quinte/ottave parallele e nascoste  <br><br> Controlla se la sensibile risolve <br><br> Controlla se la settima di un accordo di dominante risolve  <br><br> Controlla se il soprano rispetta le regole del Cantus Firmus",
    "CF: intervallo dissonante",
    "CF: nota ripetuta",
    "CF: salto duro",
    "Home",
    "Suona",
    "Cos'è HARMONEASY",
    "Manuale d'uso",
    "HARMONEASY è un applicazione web funzionale ed intuitiva finalizzata alla crescita dell'apprendimento musicale dello studente di armonia.<br> HARMONEASY, tramite l'implementazione dell'API WebMIDI,  e quindi la possibilità di esercitarsi suonando e toccando con mano, è in grado di aiutare lo studente che si approccia allo studio dell'armonia (classica e non) in vari aspetti della materia: <br> - riconoscimento dinamico degli accordi (bicordi, triadi e quadriadi) <br> - riconoscimento della tonalità <br> - rilevazione di errori armonici classici ( quinte ed ottave parallele/nascoste, introduzione di tritoni tra le voci, risoluzioni errate di sensibili e settime) <br> - per i più curiosi, rilevazione di errori melodici basate sulle regole del Cantus Firmus",
    "1) Collega la tua tastiera MIDI all porta usb del tuo computer<br>2) Scegli quali errori armonici desideri che l'applicazione rilevi tramite l'accensione degli switch<br>3) Di ogni accordo suonato verranno tracciate le note sul pentagramma dinamico a destra e mostrato la sigla rappresentante il nome <br>4) Tieni premuto l'accordo finchè non scade il timer per tracciarlo sul pentagramma a sinistra <br> 5) Gli errori armonici della tua sequenza di accordi verranno segnalati sotto forma di nota colorata ed inerente descrizione nella sezione sottostante ai pentagrammi <br>6) La tua sequanza di accordi determinerà dinamicamente la rilevazione e segnalazione della tonalità e di una eventuale modulazione <br> Clicca la tab 'Suona' sulla barra di navigazione per iniziare!"
  ]
]




function changeLang(isOnLoad){
  console.log(isOnLoad);
  subtitle = document.getElementById("subtitle");
  langdiv = document.getElementById("lang");
  titlediv = document.getElementById("titleh");
  undolbl = document.getElementById("undobutton");
  tonaldiv = document.getElementById("tonalitylbl");
  timer = document.getElementById("timer");
  detectedChordlbl = document.getElementById("chordlbl");
  buttonLabel = document.getElementById("buttonlabels");
  caption = document.getElementById("switch_caption");
  home = document.getElementById("home");
  play = document.getElementById("play");
  titleHomeDescription = document.getElementById("titleHomeDescription");
  titleUserManual = document.getElementById("titleUserManual");
  homeDescription = document.getElementById("homeDescription");
  userManual= document.getElementById("userManual");
  if(isOnLoad == '1'){
    if(lang == 0) {
      langdiv.innerHTML = "ENG";
    } else {
      langdiv.innerHTML = "ITA";
    }
    console.log("lang: " + lang);
  } else {
    switch(lang){
      case 0:
        lang=1;
        langdiv.innerHTML = "ITA";
        break;
      case 1:
        lang=0;
        langdiv.innerHTML = "ENG";
        break;
    }
    console.log("lang: " + lang)
  }
  if(subtitle != null)
    subtitle.innerHTML = msg[lang][IDXTITLE];
  if(undolbl != null)
    undolbl.innerHTML = "<i class=\"fa fa-undo\"></i> "+msg[lang][IDXUNDO];
  if(tonaldiv != null)
    tonaldiv.innerHTML = msg[lang][IDXTONALITY];
  if(timer != null)
    timer.innerHTML = msg[lang][IDXTIMER];
  if(detectedChordlbl != null)
    detectedChordlbl.innerHTML = msg[lang][IDXCHORD2];
  if(buttonLabel != null)
    buttonLabel.innerHTML = msg[lang][IDXBTNLBLS];
  if(caption != null)
    caption.innerHTML = msg[lang][IDXSWCAP];
  home.innerHTML = msg [lang][IDXTABHOME];
  play.innerHTML = msg [lang][IDXTABPLAY];
  if(titleHomeDescription != null)
    titleHomeDescription.innerHTML = msg [lang][IDXTITLEHOMEDESCR];
  if(titleUserManual != null)
    titleUserManual.innerHTML = msg [lang][IDXTITLEUSERMANUAL];
  if(homeDescription != null)
    homeDescription.innerHTML = msg [lang][IIDXHOMEDESCR];
  if(userManual != null)
    userManual.innerHTML = msg [lang][IDXUSERMANUAL];


}
