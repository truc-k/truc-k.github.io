//Hier wird zwischen der Eingabe der Spielernamen und Spieleranzahl gewählt und entsprechend werden die Test- bzw. Zahlfelder angepasst.
window.onload = function () {

    //wenn ein Turnier gespeichert ist, wird dieses im Einstellungsfenster hinterlegt
    if (localStorage.getItem("turniereinstellungen")) {
        //Abruf des Turnierarrays aus local storage
        let turniereinstellungenArray = JSON.parse(localStorage.getItem("turniereinstellungen"));

        //Abruf der Einstellungen
        let spieleranzahl = turniereinstellungenArray[0];
        let teamgroeße = turniereinstellungenArray[1];
        let teamanzahl = turniereinstellungenArray[2];
        let leistungsspieleranzahl = turniereinstellungenArray[3];
        let pausenspieleranzahl = turniereinstellungenArray[4];
        let spielfeldAnzahl = turniereinstellungenArray[5];

        //Eintrag der Einstellungen aus Turnierarray
        let teamgroeßeZahlfeld = document.getElementById("teamgroeße");
        teamgroeßeZahlfeld.value = teamgroeße; //Eintrag der Spieler pro Team
        teamgroeßeZahlfeld.readOnly = true;

        let teamanzahlZahlfeld = document.getElementById("teamanzahl");
        teamanzahlZahlfeld.value = teamanzahl; //Eintrag der Teams pro Spielfeld
        teamanzahlZahlfeld.readOnly = true;

        let spielfeldAnzahlZahlfeld = document.getElementById("spielfeld-anzahl");
        spielfeldAnzahlZahlfeld.value = spielfeldAnzahl; //Eintrag der (für die Spielerzahl) maximalen Spieleranzahl
        spielfeldAnzahlZahlfeld.readOnly = true;

        //Überprüfen, ob es ein Turnier mit Spielernamen oder ohne ist (= Zahlen für alle Spieler)
        let auswahlMitNamen = document.getElementById("mit-namen");
        let auswahlOhneName = document.getElementById("ohne-namen");

        if (isNaN(turniereinstellungenArray[6])) {
            //es sind Spielernamen eingetragen
            //Auswahl des Feldes für Nameneintrag und Deaktivierung beider Auswahlknöpfe
            auswahlMitNamen.click();
            auswahlMitNamen.disabled = true;
            auswahlOhneName.disabled = true;

            //Eintrag der Namen der Spieler und Leistungsspieler
            let namenSpielerArray;

            if (leistungsspieleranzahl > 0) {
                let namenLeistungsspielerArray = turniereinstellungenArray.slice(6, 6 + leistungsspieleranzahl);
                namenSpielerArray = turniereinstellungenArray.slice(6 + leistungsspieleranzahl, turniereinstellungenArray.length);

                let namenLeistungsspielerTextfeld = document.getElementById("namen-leistungsspieler");
                namenLeistungsspielerTextfeld.value = namenLeistungsspielerArray.toString().replace(/,/g, "\n");
                namenLeistungsspielerTextfeld.innerHTML.readOnly = true;
            } else {
                namenSpielerArray = turniereinstellungenArray.slice(6, turniereinstellungenArray.length);
            }

            let namenSpielerTextfeld = document.getElementById("namen-spieler");
            namenSpielerTextfeld.innerHTML = namenSpielerArray.toString().replace(/,/g, "\n");
            namenSpielerTextfeld.readOnly = true;

        } else {
            //es sind Spielerzahlen eingetragen
            //Auswahl des Feldes für Spieleranzahleintrag und Deaktivierung beider Auswahlknöpfe
            auswahlOhneName.click();
            auswahlOhneName.disabled = true;
            auswahlMitNamen.disabled = true;

            //Eintrag der Spieler- und Leistungsspieleranzahl
            let spieleranzahlZahlfeld = document.getElementById("anzahl-spieler-ohne-namen");
            spieleranzahlZahlfeld.value = spieleranzahl;
            spieleranzahlZahlfeld.readOnly = true;

            let leistungsspieleranzahlZahlfeld = document.getElementById("anzahl-leistungsspieler");
            leistungsspieleranzahlZahlfeld.value = leistungsspieleranzahl;
            leistungsspieleranzahlZahlfeld.readOnly = true;
        }

        //einfügen der Bestenlisten
        spielerergebnisBestenliste();

        //einblenden des Buttons für eine Turnieränderung (ausblenden des Speicher-Buttons)
        document.getElementById("button-initialisierung-speichern").style.display = "none";
        document.getElementById("button-initialisierung-aendern").style.display = "block";

        //Einblenden des Buttons für ein neues Turnier
        document.getElementById("button-neues-turnier").style.display = "block";

        //Einblenden des Buttons für den Turnierexport (ausblenden Importbutton)
        document.getElementById("button-turnier-export").style.display = "block";
        document.getElementById("button-turnier-import").style.display = "none";
    }

    //wenn die Seite neu geladen werden sollte, werden hier zunächst alle bereits vorhanden Runden wieder durch einfügen des zugehörigen Buttons dargestellt
    if (localStorage.spielrunden) {

        //Abruf der Spielrundenmap aus local storage
        spielrundenMap = new Map(JSON.parse(localStorage.spielrunden));

        //Abruf der Anzahl der gespeicherten Runden
        let rundenanzahl = Number(spielrundenMap.size);

        //Hinzufügen der Buttons für jede gespeicherte Runde
        for (let i = 1; i <= rundenanzahl; i++) {

            //Hier werden die Buttons für jede einzelne Runde auf der HTML-Seite hinzugefügt.
            let container = document.getElementById("spielrunden");
            let newElement = document.createElement("button");
            newElement.innerText = "Runde " + i;
            newElement.id = "button-runde-" + i;
            container.appendChild(newElement);
        }
    }

    //wenn Spielfelder bereits eingetragen wurden, werden diese wieder mit eingefügt
    if (localStorage.getItem("anzeige-spielfelder")) {
        document.getElementById("anzeige-spielfelder").value = JSON.parse(localStorage.getItem("anzeige-spielfelder")).join(" ");
    }
}

//Event-Listener für Wahl mit oder ohne Namen
document.getElementById("mit-namen").addEventListener("click", spielernamenWahl);
document.getElementById("ohne-namen").addEventListener("click", spielernamenWahl);

function spielernamenWahl() {

    //Deklaration der Variablen
    //Variablen Turnier mit Spielernamen
    let auswahlMitName = document.getElementById("mit-namen"); //Auswahlpunkt für Turnier mit Spielernamen
    let textfeldNamenSpieler = document.getElementById("namen-spieler"); //Abfragefeld für Spielernamen
    let textfeldNamenLeistungsspieler = document.getElementById("namen-leistungsspieler"); //Abfragefeld für Leistungsspielernamen

    //Variablen Turnier ohne Spielernamen
    let auswahlOhneName = document.getElementById("ohne-namen"); //Auswahlpunkt für Turnier ohne Spielernamen
    let zahlfeldAnzahlSpieler = document.getElementById("anzahl-spieler-ohne-namen"); //Abfragefeld für Spieleranzahl
    let zahlfeldAnzahlLeistungsspieler = document.getElementById("anzahl-leistungsspieler"); //Abfragefeld für Leistungsspieleranzahl

    //if-Bedingung prüft, ob Auswahlfeld ausgewählt wird und ob die Felder für die Anzahl der Spieler und Leistungsspieler beschrieben sind
    if (auswahlMitName.checked == true && zahlfeldAnzahlSpieler.value == "" && zahlfeldAnzahlLeistungsspieler.value == "") { //Einstellung für Turnier mit Namen
        //Spieler- und Leistungsspielernamen können eingetragen werden, Zahlfelder sind nicht sichtbar
        textfeldNamenSpieler.style.display = "block";
        textfeldNamenLeistungsspieler.style.display = "block";
        zahlfeldAnzahlSpieler.style.display = "none";
        zahlfeldAnzahlLeistungsspieler.style.display = "none";

        //else-if-Bedingung prüft, ob Auswahlfeld ausgewählt wird und ob die Felder für die Spieler- und Leistungsspielernamen beschrieben sind
    } else if (auswahlOhneName.checked == true && textfeldNamenSpieler.value == "" && textfeldNamenLeistungsspieler.value == "") { //Einstellungen für ein Turnier ohne Namen
        //Zahlfelder für Spieler- und Leistungsspieleranzahl können eingetragen werden, Namensfelder sind nicht sichtbar
        textfeldNamenSpieler.style.display = "none";
        textfeldNamenLeistungsspieler.style.display = "none";
        zahlfeldAnzahlSpieler.style.display = "block";
        zahlfeldAnzahlLeistungsspieler.style.display = "block";

    } else if (zahlfeldAnzahlSpieler.value != "" || zahlfeldAnzahlLeistungsspieler.value != "") {
        //wenn eteas in einem Feld steht, wird die Auswahl nicht geändert
        auswahlOhneName.checked = true;
    } else if (textfeldNamenSpieler.value != "" || textfeldNamenLeistungsspieler.value != "") {
        //wenn eteas in einem Feld steht, wird die Auswahl nicht geändert
        auswahlMitName.checked = true;
    }
}

//Event-Listener für Erstellung eines neues Turniers
document.getElementById("button-neues-turnier").addEventListener("click", neuesTurnier);

//Hier wird ein eventuell bereits vorhandenes Turnier gelöscht und es kann ein neues erstellt werden
function neuesTurnier() {
    if (confirm("Das bisherige Turnier wird gelöscht. \nFortfahren?") == true) {
        localStorage.clear();
    } else {
        return;
    }
    location.reload();
}

//Event-Listener für Turnieränderung
document.getElementById("button-initialisierung-aendern").addEventListener("click", turnierAendern);

function turnierAendern() {

    //es werden alle Einstellungsfenster für das Turnier "freigeschaltet"
    document.getElementById("teamgroeße").readOnly = false;
    document.getElementById("teamanzahl").readOnly = false;
    document.getElementById("spielfeld-anzahl").readOnly = false;
    document.getElementById("mit-namen").disabled = false;
    document.getElementById("ohne-namen").disabled = false;

    //Turnier mit Spielernamen
    document.getElementById("namen-spieler").readOnly = false;
    document.getElementById("namen-leistungsspieler").readOnly = false;

    //Turnier ohne Spielernamen
    document.getElementById("anzahl-spieler-ohne-namen").readOnly = false;
    document.getElementById("anzahl-leistungsspieler").readOnly = false;

    //einfügen des Speicher-Buttons und Ändern-Button verschwindet
    document.getElementById("button-initialisierung-speichern").style.display = "block";
    document.getElementById("button-initialisierung-aendern").style.display = "none";
    document.getElementById("button-neues-turnier").style.display = "block";
}

//Event-Listener für die Turnierspeicherung
document.getElementById("button-initialisierung-speichern").addEventListener("click", turnierSpeichern);

//Hier werden die Turniereinstellungen gespeichert, um später wieder abgerufen werden zu können.
function turnierSpeichern() {

    //überprüfen, ob alle erforderlichen Angaben eingetragen wurden
    //allgemeine Variablen
    let teamgroeße = document.getElementById("teamgroeße").value; //Spieler pro Team
    let teamanzahl = document.getElementById("teamanzahl").value; //Teams pro Spielfeld

    //Felder für Turniereinstellungen mit oder ohne Namen
    let auswahlMitName = document.getElementById("mit-namen"); //Auswahlpunkt für Turnier mit Spielernamen
    let textfeldNamenSpieler = document.getElementById("namen-spieler"); //Abfragefeld für Spielernamen

    let auswahlOhneName = document.getElementById("ohne-namen"); //Auswahlpunkt für Turnier ohne Spielernamen
    let zahlfeldAnzahlSpieler = document.getElementById("anzahl-spieler-ohne-namen"); //Abfragefeld für Spieleranzahl

    if (!(teamgroeße > 0 && teamanzahl > 0 && ((auswahlMitName.checked == true && textfeldNamenSpieler.value !== "") || (auswahlOhneName.checked == true && zahlfeldAnzahlSpieler.value !== "")))) {
        alert("Nicht alle erforderlichen Angaben wurden getätigt.")
        return (false);
    }

    //erstellen des Turniereinstellungsarrays
    /*Aufbau Einstellungsarray: [0] - Spieleranzahl
                                [1] - Teamgröße / Spieler pro Team
                                [2] - Teamanzahl / Teams pro Spielfeld
                                [3] - Leistungsspieleranzahl
                                [4] - Pausenspieleranzahl
                                [5] - Spielfeldanzahl
                                [*] - Namen aller Leistungsspieler
                                [*] - Namen aller (restlichen) Spieler*/

    //Deklarierung Einstellungsvariablen
    let spieleranzahl; //Anzahl der Spieler bestimmt sich entweder aus der Anzahl der eingetragenen Namen der Spieler und Leistungsspieler (Turnier mit Namen) oder direkt aus der eingetragenen Spieleranzahl (Turnier ohne Namen)
    let leistungsspieleranzahl = 0; //Anzahl der Leistungsspieler

    //Arrays für Spielernamen
    let namenSpielerArray = [];
    let namenLeistungsspielerArray = [];

    if (auswahlMitName.checked == true) {
        //Eintrag aller Spielernamen in ein Array (leere Zeilen werden herausgefiltert)
        namenSpielerArray = textfeldNamenSpieler.value.replace(/\r\n/g, "\n").split("\n").filter(line => line);
        //Eintrag aller Leistungsspielernamen, wenn vorhanden (leere Zeilen werden herausgefiltert)
        let textfeldNamenLeistungsspieler = document.getElementById("namen-leistungsspieler"); //Textfeld für Eintragung der Namen der Leistungsspieler
        if (textfeldNamenLeistungsspieler.value !== "") {
            namenLeistungsspielerArray = textfeldNamenLeistungsspieler.value.replace(/\r\n/g, "\n").split("\n").filter(line => line);
            leistungsspieleranzahl = namenLeistungsspielerArray.length;
        }
        spieleranzahl = namenSpielerArray.length + leistungsspieleranzahl;

        //Überprüfen, ob jeder Spielername nur einmal vorkommt (sonst Fehler mit Spielerergebnisspeicher)
        let namenAlleSpielerArray = namenLeistungsspielerArray.concat(namenSpielerArray);
        let namenAlleSpielerArrayOhneDopplung = [];
        let dopplungNamenAlleSpielerArray = [];

        for (let spielerzahl = 0; spielerzahl < namenAlleSpielerArray.length; spielerzahl++) {
            //Überprüfung, ob Name bereits in Spielerarray ohne Dopplung enthalten ist
            if (namenAlleSpielerArrayOhneDopplung.indexOf(namenAlleSpielerArray[spielerzahl]) > -1 && dopplungNamenAlleSpielerArray.indexOf(namenAlleSpielerArray[spielerzahl]) == -1) {
                //Eintrag in Spielerarray für doppelte Namen
                dopplungNamenAlleSpielerArray.push(namenAlleSpielerArray[spielerzahl]);
            }
            namenAlleSpielerArrayOhneDopplung.push(namenAlleSpielerArray[spielerzahl]);
        }
        //Ausgabe der doppelten Namen, wenn vorhanden
        if (dopplungNamenAlleSpielerArray.length > 0) {
            alert("Es wurden Spielernamen doppelt eingegeben.\nFür eine korrekte Speicherung der Spielerergebnisse darf jeder Name nur einmal vorhanden sein. Folgende Namen sind doppelt vergeben:\n" + dopplungNamenAlleSpielerArray);
            return (false);
        }

    } else if (auswahlOhneName.checked == true) {
        //Bestimmung der Spieleranzahl aus eingetragener Zahl aus Abfragefeld
        spieleranzahl = zahlfeldAnzahlSpieler.value;

        //Eintrag der Spieler in Namenarray
        for (let spielerzahl = 1; spielerzahl <= spieleranzahl; spielerzahl++) {
            namenSpielerArray.push(spielerzahl);
        }

        //Bestimmung der Leistungsspieleranzahl, wenn diese eingetragen wurden
        let zahlfeldAnzahlLeistungsspieler = document.getElementById("anzahl-leistungsspieler"); //Abfragefeld für Leistungsspieleranzahl
        if (zahlfeldAnzahlLeistungsspieler.value !== "") {
            leistungsspieleranzahl = zahlfeldAnzahlLeistungsspieler.value;

            //Eintrag der Leistungsspieler in Leistungsspielerarray
            namenLeistungsspielerArray = namenSpielerArray.splice(0, leistungsspieleranzahl);
        }

    } else {
        //Fehlerausgabe
        alert("Fehler bei Bestimmung der Spieler- und Leistungsspieleranzahl");
        return (false);
    }

    //überprüfen, ob Spieleranzahl ausreichend groß ist für gewünschtes Turnier
    if (spieleranzahl < teamgroeße * teamanzahl) {
        alert("Spieleranzahl (aktuell " + spieleranzahl + ") für angegebene Einstellungen nicht ausreichend. \nEs werden mindestens " + teamgroeße * teamanzahl + " Spieler benötigt.");
        return (false);
    }
    //Bestimmung der Anzahl der Pausenspieler
    let pausenspieleranzahl = spieleranzahl % (teamgroeße * teamanzahl);

    let spielfeldanzahl;
    //wenn die Spielfeldanzahl manuell eingetragen wurde, wird diese hier übernommen, ansonsten wird sie berechnet
    let zahlfeldSpielfeldanzahl = document.getElementById("spielfeld-anzahl").value; //Abfragefeld für optionale Beschränkung der Spielfeldanzahl
    if (zahlfeldSpielfeldanzahl !== "") {
        spielfeldanzahl = zahlfeldSpielfeldanzahl;

        //wenn die Spielfeldanzahl begrenzt wurde, gibt es eventuell Pausenspieler, obwohl eigentlich alle spielen könnten
        if (teamgroeße * teamanzahl * spielfeldanzahl < spieleranzahl) {
            pausenspieleranzahl = spieleranzahl - (teamgroeße * teamanzahl * spielfeldanzahl);
        }
    } else {
        spielfeldanzahl = (spieleranzahl - pausenspieleranzahl) / (teamgroeße * teamanzahl);
    }

    //Eintragen der Grundeinstellungen für das Turnier
    let turniereinstellungenArray = [spieleranzahl, teamgroeße, teamanzahl, leistungsspieleranzahl, pausenspieleranzahl, spielfeldanzahl];

    //Eintragen aller Spielernamen (bzw. -nummern) in Turniereinstellungsarray und Spielerergebnismap
    let spielerergebnisseMap;
    //Abruf der Spielerergebnisse-Map, wenn bereits gespeichert
    if (localStorage.spielerergebnisse) {
        spielerergebnisseMap = new Map(JSON.parse(localStorage.spielerergebnisse))
    } else {
        spielerergebnisseMap = new Map();
    }

    if (leistungsspieleranzahl > 0) {
        for (let spielerzahl = 0; spielerzahl < leistungsspieleranzahl; spielerzahl++) {
            turniereinstellungenArray.push(namenLeistungsspielerArray[spielerzahl]);

            //wenn Spieler bereits in der Spielerergebnismap vorhanden ist, wird dieser nicht neu gespeichert
            if (!spielerergebnisseMap.get(namenLeistungsspielerArray[spielerzahl])) {
                spielerergebnisseMap.set(namenLeistungsspielerArray[spielerzahl], JSON.stringify([0, 0, 0, 0, 0]));
            }
        }
    }

    for (let spielerzahl = 0; spielerzahl < spieleranzahl - leistungsspieleranzahl; spielerzahl++) {
        turniereinstellungenArray.push(namenSpielerArray[spielerzahl]);

        //wenn Spieler bereits in der Spielerergebnismap vorhanden ist, wird dieser nicht neu gespeichert
        if (!spielerergebnisseMap.get(namenSpielerArray[spielerzahl])) {
            spielerergebnisseMap.set(namenSpielerArray[spielerzahl], JSON.stringify([0, 0, 0, 0, 0]));
        }
    }

    //Speichern des Turniereinstellungsarrays und der Spielerergebnismap im local storage
    localStorage.setItem("turniereinstellungen", JSON.stringify(turniereinstellungenArray));
    localStorage.spielerergebnisse = JSON.stringify(Array.from(spielerergebnisseMap.entries()));

    //Seite wird neu geladen, damit alle Felder gesperrt werden
    location.reload();
}

//Hier werden die Spielrunden generiert und auf der Seite dargestellt.
//Zunächst wird die Knopfaktion ausgewertet (addEventListener).
document.getElementById("button-neue-runde").addEventListener("click", neueRundeGenerieren);

//Hier wird eine neue Spielrunde generiert.
function neueRundeGenerieren() {
    //Es wird überprüft, ob ein Turnierarray vorliegt.
    if (!localStorage.getItem("turniereinstellungen")) {
        alert("Kein Turnier angelegt");
        return;
    }
    //Es wird überprüft, ob der local Storage bereits einen Rundenzähler hat, wenn nicht wird dieser erstellt und die zu erstellende Runde wird definiert ("runde").
    let runde; //Zahl der zu erstellende Runde
    let spielrundenMap; //Map für Spielrundenspeicherung

    //Abfrage, ob bereits ein Spielrundenspeicher vorhanden ist
    if (localStorage.spielrunden) {
        //Spielrundenspeicher vorhanden - Abruf der vorhandenen Map
        spielrundenMap = new Map(JSON.parse(localStorage.spielrunden));
    } else {
        //erstellen einer neuen Map
        spielrundenMap = new Map();
    }

    runde = Number(spielrundenMap.size) + 1;

    //Speichern der Turnierdaten aus dem Turniereinstellungsarray.
    let turniereinstellungenArray = JSON.parse(localStorage.getItem("turniereinstellungen")); //Array der Turniereinstellungen aus local storage

    let spieleranzahl = turniereinstellungenArray[0]; //Anzahl der Spieler des Turniers (inklusive Leistungsspieler)
    let teamgroeße = turniereinstellungenArray[1]; //Teamgröße / Spieler pro Team
    let teamanzahl = turniereinstellungenArray[2]; //Teamanzahl / Teams pro Spielfeld
    let leistungsspieleranzahl = turniereinstellungenArray[3]; //Anzahl der Leistungsspieler
    let pausenspieleranzahl = turniereinstellungenArray[4]; //Anzahl der Pausenspieler
    let spielfeldAnzahl = turniereinstellungenArray[5]; //Anzahl der möglichen (maximalen) Spielfelder

    let namenAlleSpielerArray = turniereinstellungenArray.slice(6, turniereinstellungenArray.length); //Namen aller Spieler (inklusive Leistungsspieler)
    let namenSpielerArray = turniereinstellungenArray.slice(6 + leistungsspieleranzahl, turniereinstellungenArray.length); //Namen aller Spieler (ohne Leistungsspieler)
    let namenLeistungsspielerArray = turniereinstellungenArray.slice(6, 6 + leistungsspieleranzahl); //Namen aller Leistungsspieler

    //Die Zuordnung der Pausenspieler ist noch fehlerhaft, da ein Problem entsteht, wenn der letzte Pausenspieler der letzten Runde nicht mehr mitgespielt.
    //der folgenden Abschnitt kann vereinfacht geschrieben werden und das wird in Zukunft noch passieren

    //Bestimmung der Pausenspieler, wenn nötig
    let pausenspielerArray = []; //Namen aller Pausenspieler
    if (pausenspieleranzahl > 0) {
        let spielerergebnisseMap = new Map(JSON.parse(localStorage.spielerergebnisse)); //Abruf der Spielerergebnisse-Map
        let namenAlleSpielerTurnierArray = Array.from(spielerergebnisseMap.keys()); //Abruf aller Spielernamen, die irgendwann mal am Turnier teilgenommen haben

        let namenAlleSpielerTurnierNeuArray; //Auflistung aller Spieler, die jemals an Turnier teilgenommen haben
        //Es werden der Reihe nach alle Spieler des Turniers als Pausenspieler deklariert.
        if (spielrundenMap.get("runde-" + (runde - 1))) {
            let vorherigeSpielrundeArray = JSON.parse(spielrundenMap.get("runde-" + (runde - 1))); //Array der vorherigen Spielrunde

            //bestimmen des Arrays zur Bestimmung der Pausenspieler
            if (vorherigeSpielrundeArray[4] == 0) {
                //wenn es in der vorherigen Spielrunde keine Pausenspieler gab, beginnt die Zählung mit dem ersten Spieler im Array
                namenAlleSpielerTurnierNeuArray = namenAlleSpielerTurnierArray;
            } else {
                //wenn es Pausenspieler gab, wird die Stelle des letzten Pausenspielers bestimmt und an der Stelle das Array neu zusammengesetzt
                let zahlLetzterPausenspieler = namenAlleSpielerTurnierArray.indexOf(vorherigeSpielrundeArray[5 + vorherigeSpielrundeArray[4]]); //es wird die Stelle des letzten Pausenspielers aus dem Gesamtturnierspielerarray gesucht

                //nun wird das Gesamtturnierspielerarray umgestellt, damit die Spieler die bereits Pause hatten, in der Reihenfolge weiter hinten sind
                let spielerBereitsPauseArray = namenAlleSpielerTurnierArray.splice(0, zahlLetzterPausenspieler + 1);
                namenAlleSpielerTurnierNeuArray = namenAlleSpielerTurnierArray.concat(spielerBereitsPauseArray);
            }

        } else {
            //wenn es keine vorherige Spielrunde gibt, beginnt die Zählung mit dem ersten Spieler im Array
            namenAlleSpielerTurnierNeuArray = namenAlleSpielerTurnierArray;
        }

        //suchen des nächsten Pausenspielers, der an der aktuellen Spielrunde teilnimmt
        let zahlNaechsterPausenspieler;
        for (let spielerzahl = 0; spielerzahl < namenAlleSpielerTurnierNeuArray.length; spielerzahl++) {
            if (namenAlleSpielerArray.indexOf(namenAlleSpielerTurnierNeuArray[spielerzahl]) > -1) {
                zahlNaechsterPausenspieler = namenAlleSpielerTurnierNeuArray.indexOf(namenAlleSpielerTurnierNeuArray[spielerzahl]);
                break;
            }
        }

        //bestimmen der Pausenspieler
        for (let spielerzahl = zahlNaechsterPausenspieler; spielerzahl < pausenspieleranzahl + zahlNaechsterPausenspieler; spielerzahl++) {
            if (namenAlleSpielerArray.indexOf(namenAlleSpielerTurnierNeuArray[spielerzahl]) > -1) {
                pausenspielerArray.push(namenAlleSpielerTurnierNeuArray[spielerzahl]);
            }
        }

        //Nun werden aus den Einzelarrays, die für die Teamzuordnung nötig sind, die Pausenspieler entfernt.
        for (let i = 0; i <= pausenspieleranzahl - 1; i++) {
            if (namenSpielerArray.indexOf(pausenspielerArray[i]) > -1) {
                namenSpielerArray.splice(namenSpielerArray.indexOf(pausenspielerArray[i]), 1);
            } else if (namenLeistungsspielerArray.indexOf(pausenspielerArray[i]) > -1) {
                namenLeistungsspielerArray.splice(namenLeistungsspielerArray.indexOf(pausenspielerArray[i]), 1);
            }
        }
    }

    //jetzt werden beide Spielernamenarrays gemischt
    for (var i = namenLeistungsspielerArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [namenLeistungsspielerArray[i], namenLeistungsspielerArray[j]] = [namenLeistungsspielerArray[j], namenLeistungsspielerArray[i]];
    }

    for (var i = namenSpielerArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [namenSpielerArray[i], namenSpielerArray[j]] = [namenSpielerArray[j], namenSpielerArray[i]];
    }

    //Speichern der Spielrunde in einem Array
    /*Aufbau Spielrundenarray:  [0] - Spieleranzahl
                                [1] - Teamgröße / Spieler pro Team
                                [2] - Teamanzahl / Teams pro Spielfeld
                                [3] - Leistungsspieleranzahl
                                [4] - Pausenspieleranzahl
                                [5] - Spielfeldanzahl
                                [*] - Namen aller Pausenspieler
                                [*] - Namen der restlichen Spieler (zuerst Leistungs-, dann alle anderen Spieler)
    */

    //Nun wird das Spielrundenarray mit den Initialeinstellungen, den Pausenspielern und der Spielermischung erstellt.
    let spielrunde;
    if (pausenspieleranzahl < 1) {
        //wenn es keine Pausenspieler gibt, wird das Pausenspielerarray nicht mit eingefügt
        spielrunde = [spieleranzahl, teamgroeße, teamanzahl, leistungsspieleranzahl, pausenspieleranzahl, spielfeldAnzahl].concat(namenLeistungsspielerArray.concat(namenSpielerArray));
    } else {
        spielrunde = [spieleranzahl, teamgroeße, teamanzahl, leistungsspieleranzahl, pausenspieleranzahl, spielfeldAnzahl].concat(pausenspielerArray.concat(namenLeistungsspielerArray.concat(namenSpielerArray)));
    }

    //Speichern der erstellen Spielrunde in der Map
    spielrundenMap.set("runde-" + runde, JSON.stringify(spielrunde));

    //Speichern der Map im local storage
    localStorage.spielrunden = JSON.stringify(Array.from(spielrundenMap.entries()));

    //Hier werden die Buttons für jede einzelne Runde auf der HTML-Seite hinzugefügt.
    let container = document.getElementById("spielrunden");
    let newElement = document.createElement("button");
    newElement.innerText = "Runde " + runde;
    newElement.id = "button-runde-" + runde;
    container.appendChild(newElement);
}

//Hier wird geprüft, ob ein Klick im div für die Rundenknöpfe erfolgt.
document.getElementById("spielrunden").addEventListener("click", rundeOeffnen);

function rundeOeffnen(event) {
    //da der eventlistener nur nach einem Klick im div sucht, müssen nur die Klicks beachtet werden, bei denen die ID nicht "spielrunden" (also alle IDs mit "runde X")
    if (event.target.id === "spielrunden") { return };

    //Variablen für beide Buttons, die für das Ergebnis speichern oder abbrechen benötigt werden
    let ergebnisSpeichernButton = document.getElementById("button-ergebnisse-speichern");
    let ergebnisAbbrechenButton = document.getElementById("button-ergebnisse-abbrechen");

    //definieren der Sichtbarkeit des Ergebnisspeichern-Buttons 
    let ergebnisbuttonSichtbarkeit = window.getComputedStyle(ergebnisSpeichernButton);

    //wenn die Buttons für die Ergebnisverarbeitung bereits sichtbar sind, wird bereits eine Runde angezeigt, dann wird erst die alte Runde gelöscht
    if (ergebnisbuttonSichtbarkeit.display === "block") {
        document.getElementById("ergebnisfenster").innerHTML = "";
    }

    //Schrift des geklickten Buttons fett machen
    // document.getElementById(event.target.id).style.fontWeight = "bold";
    // leider keine Möglichkeit gefunden, den bold Tag wieder zurück zu nehmen, wenn andere Button gedrückt wird

    //abrufen der aktuellen Runde
    let runde = event.target.id.toString().slice(13);

    //abrufen der benötigten Spielrunde aus local storage
    let spielrundenMap = new Map(JSON.parse(localStorage.spielrunden));
    let aufgerufeneSpielrunde = JSON.parse(spielrundenMap.get("runde-" + runde));

    //Turniereinstellungen aus Rundenarray abrufen
    let spieleranzahl = Number(aufgerufeneSpielrunde[0]);
    let teamgroeße = aufgerufeneSpielrunde[1];
    let pausenspieleranzahl = aufgerufeneSpielrunde[4];

    let teamanzahl = (spieleranzahl - pausenspieleranzahl) / teamgroeße; //Anzahl der Teams für die Spielrunde
    let teamzuordnung = aufgerufeneSpielrunde.slice(6 + pausenspieleranzahl, aufgerufeneSpielrunde.length); //Array mit allen aktiven Spielern (also ohne Pausenspieler)

    //Bereich, in den Teams und Ergebnisfenster eingefügt werden
    let container = document.getElementById("ergebnisfenster");

    //einfügen der aktuellen Runde
    let rundeZahlErgebnisfenster = document.createElement("p");
    rundeZahlErgebnisfenster.innerText = "Runde " + runde;
    rundeZahlErgebnisfenster.id = "ergebnis-runde-" + runde;
    container.appendChild(rundeZahlErgebnisfenster);

    //zusammenfügen der Spieler zu Teams aus Rundenarray
    for (let i = 0; i < teamanzahl; i++) { //Durchführen für Teamanzahl

        let team; //String, der Spielernamen eines Teams beinhaltet
        //zusammenfügen aller Spieler, die in ein Team gehören
        for (let t = 0; t < spieleranzahl - pausenspieleranzahl; t += teamanzahl) {
            if (t < 1) {
                team = teamzuordnung[i + t];
            } else {
                team += ", " + teamzuordnung[i + t];
            }
        }

        //einfügen des Labels für die Inputbox mit dem team-String
        let spielernamenAbschnitt = document.createElement("label");
        spielernamenAbschnitt.innerText = team;
        spielernamenAbschnitt.htmlFor = "ergebnis-team-" + (i + 1);
        spielernamenAbschnitt.id = "label-ergebnis-team-" + (i + 1);
        container.appendChild(spielernamenAbschnitt);

        //einfügen der Inputbox für das Ergebnis für das Team
        let ergebnisbox = document.createElement("input");
        ergebnisbox.id = "ergebnis-team-" + (i + 1);
        ergebnisbox.type = "number";

        //falls bereits Ergebnisse für diese Runde eingetragen wurden, werden diese jetzt angezeigt (statt des placeholders)
        if (aufgerufeneSpielrunde[6 + spieleranzahl + i] === undefined) {
            ergebnisbox.placeholder = "Ergebnis Team " + (i + 1);
        } else {
            ergebnisbox.value = aufgerufeneSpielrunde[6 + spieleranzahl + i];
            ergebnisbox.readOnly = true;
        }

        container.appendChild(ergebnisbox);
    }

    //anzeigen der Buttons, die für Ergebnisverarbeitung notwendig sind
    ergebnisSpeichernButton.style.display = "block";
    ergebnisAbbrechenButton.style.display = "block";

}

//Hier wird geprüft, ob ein Klick für den Speicher-Button im Ergebnisfenster erfolgt
document.getElementById("button-ergebnisse-speichern").addEventListener("click", rundeErgebnisSpeichern);

function rundeErgebnisSpeichern() {

    //abrufen der aktuellen Runde
    let runde = document.querySelector('[id^="ergebnis-runde-"]').id.slice(15);

    //abrufen des Rundenarrays aus local Storage
    let spielrundenMap = new Map(JSON.parse(localStorage.spielrunden));
    let aktuelleSpielrunde = JSON.parse(spielrundenMap.get("runde-" + runde));

    //Turniereinstellungen aus Rundenarray abrufen
    let spieleranzahl = aktuelleSpielrunde[0];
    let teamgroeße = aktuelleSpielrunde[1];
    let pausenspieleranzahl = aktuelleSpielrunde[4];

    //keine Speicherung, wenn Ergebnis bereits eingetragen wurde
    if (aktuelleSpielrunde.length == 8 + spieleranzahl) {
        alert("Diese Runde wurde bereits gespeichert.")
        return;
    }

    //Anzahl der Teams für die Spielrunde
    let teamanzahl = (spieleranzahl - pausenspieleranzahl) / teamgroeße;

    for (let teamzahl = 1; teamzahl <= teamanzahl; teamzahl++) {
        let ergebnis = document.getElementById("ergebnis-team-" + teamzahl).value;
        aktuelleSpielrunde[5 + Number(spieleranzahl) + Number(teamzahl)] = ergebnis;
    }

    //speichern der Ergebnisse im Rundenarray
    spielrundenMap.set("runde-" + runde, JSON.stringify(aktuelleSpielrunde));
    localStorage.spielrunden = JSON.stringify(Array.from(spielrundenMap.entries()));

    //Array mit allen aktiven Spielern (also ohne Pausenspieler)
    let teamzuordnung = aktuelleSpielrunde.slice(6 + pausenspieleranzahl, aktuelleSpielrunde.length);

    //Map für Speicher der Spielerergebnisse
    let spielerergebnisseMap = new Map(JSON.parse(localStorage.spielerergebnisse));

    //Speichern der Ergebnisse für jeden Spieler
    for (let i = 0; i < teamanzahl; i++) { //Durchführung für Anzahl der Teams

        //bestimmen der Teammitglieder
        let team = [];
        for (let t = 0; t < spieleranzahl - pausenspieleranzahl; t += teamanzahl) {
            team.push(teamzuordnung[i + t]);
        }

        //bestimmen des Ergebnisses des Teams und des gegnerischen Ergebnisses
        let ergebnis;
        let ergebnisGegner;
        if (i % 2 == 0) {
            ergebnis = aktuelleSpielrunde[6 + Number(spieleranzahl) + Number(i)];
            ergebnisGegner = aktuelleSpielrunde[7 + Number(spieleranzahl) + Number(i)];
        } else {
            ergebnis = aktuelleSpielrunde[6 + Number(spieleranzahl) + Number(i)];
            ergebnisGegner = aktuelleSpielrunde[5 + Number(spieleranzahl) + Number(i)];
        }

        //Berechnung der Punktedifferenz
        let punktedifferenz = ergebnis - ergebnisGegner;

        //Eintrag der individuellen Ergebnisse
        /*Aufbau des individuellen Ergebnisarrays:  [0] - Anzahl gespielte Spiele / Spielrunden
                                                    [1] - Anzahl Siege
                                                    [2] - Punkte (aus gespielten Spielen des eigenen Teams)
                                                    [3] - Punktedifferenz (aus gespielten Spielen)
                                                    [4] - Punkte aus Ergebnisbewertung (TBC)*/


        for (let spielerzahl = 0; spielerzahl < teamgroeße; spielerzahl++) {
            //Abruf des Ergebnisarrays des Spielers
            let spielerergebnis = JSON.parse(spielerergebnisseMap.get(team[spielerzahl]));
            //Eintrag der gespielten Runde
            spielerergebnis[0] += 1;
            //Eintrag des Sieges, wenn Spiel gewonnen
            if (ergebnis > ergebnisGegner) { spielerergebnis[1] += 1; }
            //Eintrag der Punkte des Teams
            spielerergebnis[2] += Number(ergebnis);
            //Eintrag der Punktedifferenz
            spielerergebnis[3] += punktedifferenz;

            //Speichern des Spielerergebnisses in der Gesamtmap
            spielerergebnisseMap.set(team[spielerzahl], JSON.stringify(spielerergebnis));
        }

    }

    //Speichern der Spielergebnis-Map im local storage
    localStorage.spielerergebnisse = JSON.stringify(Array.from(spielerergebnisseMap.entries()));

    //Aktualisierung der Bestenliste
    spielerergebnisBestenliste();

    //schließen des Ergebnisfensters
    //Variablen für beide Buttons, die für das Ergebnis speichern oder abbrechen benötigt werden
    let ergebnisSpeichernButton = document.getElementById("button-ergebnisse-speichern");
    let ergebnisAbbrechenButton = document.getElementById("button-ergebnisse-abbrechen");

    //aktuell sichtbare Ergebnisfenster (Teams + Ergebnisinput) werden "gelöscht" / überschrieben
    document.getElementById("ergebnisfenster").innerHTML = "";

    //Buttons für Ergebnisverarbeitung werden nicht mehr angezeigt
    ergebnisSpeichernButton.style.display = "none";
    ergebnisAbbrechenButton.style.display = "none";
}

//Hier wird geprüft, ob ein Klick für den Abbruch-Button im Ergebnisfenster erfolgt
document.getElementById("button-ergebnisse-abbrechen").addEventListener("click", rundeErgebnisAbbrechen);

function rundeErgebnisAbbrechen() {

    //Variablen für beide Buttons, die für das Ergebnis speichern oder abbrechen benötigt werden
    let ergebnisSpeichernButton = document.getElementById("button-ergebnisse-speichern");
    let ergebnisAbbrechenButton = document.getElementById("button-ergebnisse-abbrechen");

    //aktuell sichtbare Ergebnsifenster (Teams + Ergebnisinput) werden "gelöscht" / überschrieben
    document.getElementById("ergebnisfenster").innerHTML = "";

    //Buttons für Ergebnisverarbeitung werden nicht mehr angezeigt
    ergebnisSpeichernButton.style.display = "none";
    ergebnisAbbrechenButton.style.display = "none";

}

function spielerergebnisBestenliste() {

    let spielerergebnisseMap = new Map(JSON.parse(localStorage.spielerergebnisse));
    /*Aufbau des individuellen Ergebnisarrays:  [0] - Anzahl gespielte Spiele / Spielrunden
                                                [1] - Anzahl Siege
                                                [2] - Punkte (aus gespielten Spielen des eigenen Teams)
                                                [3] - Punktedifferenz (aus gespielten Spielen)
                                                [4] - Punkte aus Ergebnisbewertung (TBC)*/
    //Namen für die Bewertungskriterien, die auf der Seite in der Bestenliste als Titel sichtbar sind
    let ergebniskriterienArray = ["Siege", "Punkte", "Punktedifferenz", "Ergebnisbewertung"];

    let alleSpielerTurnierArray = Array.from(spielerergebnisseMap.keys());

    //clearen der Bestenliste
    document.getElementById("bestenliste").innerHTML = "";

    for (let ergebniskriterium = 0; ergebniskriterium < ergebniskriterienArray.length; ergebniskriterium++) {

        //erstellen eines Namensarrays und des dazugehörigen Wertearrays
        let listeNamenArray = [];
        let listeWerteArray = [];

        for (let spielerzahl = 0; spielerzahl < alleSpielerTurnierArray.length; spielerzahl++) {
            //Eintrag der Spielernamen und Siege
            listeNamenArray.push(alleSpielerTurnierArray[spielerzahl]);
            listeWerteArray.push(JSON.parse(spielerergebnisseMap.get(alleSpielerTurnierArray[spielerzahl]))[ergebniskriterium + 1]);
        }

        //Erstellung eines Hilfsarrays für die parallele Sortierung beider Arrays
        let indexHilfsarray = [];
        for (let index = 0; index < alleSpielerTurnierArray.length; index++) {
            indexHilfsarray.push(index);
        }

        //Sortierung des Hilfsarrays entsprechend des aktuellen Ergebniskriteriums
        indexHilfsarray.sort((a, b) => listeWerteArray[b] - listeWerteArray[a]);

        //Erstellen und Ausgabe des Rankings
        let bestenlisteNamenArray = [];
        let bestenlisteWerteArray = [];
        for (let spielerzahl = 0; spielerzahl < alleSpielerTurnierArray.length; spielerzahl++) {
            bestenlisteNamenArray.push(listeNamenArray[indexHilfsarray[spielerzahl]]);
            bestenlisteWerteArray.push(listeWerteArray[indexHilfsarray[spielerzahl]]);
        }

        //Ausgabe des Rankings auf der Seite
        let container = document.getElementById("bestenliste");

        //Eintrag der Überschrift
        let ergebnisabschnitt = document.createElement("div");
        ergebnisabschnitt.id = "bestenliste-" + ergebniskriterienArray[ergebniskriterium].toLocaleLowerCase();
        let ueberschriftErgebnisabschnitt = document.createElement("p");
        ueberschriftErgebnisabschnitt.innerText = ergebniskriterienArray[ergebniskriterium];
        ueberschriftErgebnisabschnitt.id = "bestenliste-ueberschrift-" + ergebniskriterienArray[ergebniskriterium].toLocaleLowerCase();
        ergebnisabschnitt.appendChild(ueberschriftErgebnisabschnitt);

        let ergebnisse = document.createElement("div");
        ergebnisse.id = "bestenliste-ergebnisse-" + ergebniskriterienArray[ergebniskriterium].toLocaleLowerCase();

        for (let spielerzahl = 0; spielerzahl < bestenlisteNamenArray.length; spielerzahl++) {
            let platzierungErgebnisabschnitt = document.createElement("div");
            platzierungErgebnisabschnitt.id = "bestenliste-platzierungsabschnitt-" + (spielerzahl + 1);

            let platzierung = document.createElement("p");
            //überprüfen, ob vorheriger Wert kleiner ist, um Platzierung zu bestimmen
            if (bestenlisteWerteArray[spielerzahl] < bestenlisteWerteArray[spielerzahl - 1] || bestenlisteWerteArray[spielerzahl - 1] == undefined) {
                platzierung.innerText = "(" + (spielerzahl + 1) + ")";
            }
            platzierung.id = "bestenliste-platzierung-" + (spielerzahl + 1);

            platzierungErgebnisabschnitt.appendChild(platzierung);

            let platzierungName = document.createElement("p");
            platzierungName.innerText = bestenlisteNamenArray[spielerzahl];
            platzierungName.id = "bestenliste-platzierung-name-" + spielerzahl;
            platzierungName.name = bestenlisteNamenArray[spielerzahl];
            platzierungErgebnisabschnitt.appendChild(platzierungName);

            ergebnisse.appendChild(platzierungErgebnisabschnitt);
        }

        ergebnisabschnitt.appendChild(ergebnisse);
        container.appendChild(ergebnisabschnitt);
    }

}

//prüfen, ob Maus über Namen bei Bestenliste ist
document.getElementById("bestenliste").addEventListener("mouseover", spielerergebnisAbrufen);
// document.querySelector('[id^="bestenliste-platzierung-name-"]').addEventListener("mouseover", spielerergebnisAbrufen);

function spielerergebnisAbrufen(event) {

    let container = document.getElementById("spielerergebnis");

    if (!event.target.id.includes("bestenliste-platzierung-name-")) {
        container.innerHTML = "";
        return;
    }

    let spielername = event.target.name;

    //Abruf der Spielerergebnisse aus local storage
    let spielerergebnisseMap = new Map(JSON.parse(localStorage.spielerergebnisse));
    /*Aufbau des individuellen Ergebnisarrays:  [0] - Anzahl gespielte Spiele / Spielrunden
                                                [1] - Anzahl Siege
                                                [2] - Punkte (aus gespielten Spielen des eigenen Teams)
                                                [3] - Punktedifferenz (aus gespielten Spielen)
                                                [4] - Punkte aus Ergebnisbewertung (TBC)*/

    container.innerHTML = "";

    let box = document.createElement("div");
    let ergebniskriterienArray = ["Spiele", "Siege", "Punkte", "Punktedifferenz", "Ergebnisbewertung"];

    for (let ergebniskriterium = 0; ergebniskriterium < ergebniskriterienArray.length; ergebniskriterium++) {
        let textzeile = document.createElement("p");
        textzeile.innerText = ergebniskriterienArray[ergebniskriterium] + ": " + JSON.parse(spielerergebnisseMap.get(spielername))[ergebniskriterium];
        box.appendChild(textzeile);
    }

    container.appendChild(box);

}

//Prüfen, ob Wert für angezeigte Runde geändert wurde
document.getElementById("anzeige-runde").addEventListener("change", anzeigefensterOeffnen);

function anzeigefensterOeffnen() {

    let spielfelder = document.getElementById("anzeige-spielfelder").value.split(" ");
    if (spielfelder.length <= 1) {
        alert("Bitte Spielfelder angeben.");
        document.getElementById("anzeige-runde").value -= 1;
        return;
    }

    localStorage.setItem("anzeige-spielfelder", JSON.stringify(spielfelder));

    let runde = document.getElementById("anzeige-runde").value;

    localStorage.setItem("anzeige", runde);

    let anzeigefenster = window.open("./../html-seiten/anzeige_zufallsspielplan.html", "anzeigefenster", "popup");
}

//prüfen, ob Knopf zur anzeigen der nächsten Runde gedrückt wurde
document.getElementById("anzeige-naechste-runde").addEventListener("click", anzeigeNaechsteRunde);

function anzeigeNaechsteRunde() {

    //überprüfen, ob Turnier gespeichert / angelegt ist
    if (!localStorage.spielrunden) { alert("Es ist kein Turnier gespeichert."); return; }

    //Abfrage der letzten angezeigten Runde und Anzeige der nächsten Runde in Inputbox
    let alteRunde = Number(document.getElementById("anzeige-runde").value);
    document.getElementById("anzeige-runde").value = alteRunde + 1;

    //Abruf der Spielrundenmap
    let spielrundenMap = new Map(JSON.parse(localStorage.spielrunden));

    //erstellen einer neuen Spielrunde, wenn keine angelegt ist
    if (!spielrundenMap.get("runde-" + (alteRunde + 1))) {
        if (window.confirm("Es ist keine neue Runde generiert. \nSoll eine neue Runde erstellt werden?")) {
            neueRundeGenerieren();
        }
    }
    anzeigefensterOeffnen();

}

//prüfen, ob Knopf für Turnierexport gedrückt wurde
document.getElementById("button-turnier-export").addEventListener("click", turnierExport);

function turnierExport() {

    let spielerergebnisse = localStorage.spielerergebnisse;
    let spielrunden = localStorage.spielrunden;
    let turniereinstellungen = localStorage.getItem("turniereinstellungen");

    //Abruf des aktuellen Datums und Uhrzeit
    let currentdate = new Date();
    var datetime = String(currentdate.getDate()).padStart(2, '0') + String((currentdate.getMonth() + 1)).padStart(2, '0') + currentdate.getFullYear() + "-" + currentdate.getHours() + currentdate.getMinutes() + currentdate.getSeconds();

    let link = document.createElement("a");
    let file = new Blob(["Spielerergebnisse:" + spielerergebnisse, "Spielrunden:" + spielrunden, "Turniereinstellungen:" + turniereinstellungen], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = "turnierexport-" + datetime + ".txt";
    link.click();
    URL.revokeObjectURL(link.href);
}

//prüfen, ob Knopf für Turnierimport gedrückt wurde
document.getElementById("button-turnier-import").addEventListener("change", turnierImport, false);

function turnierImport() {

    //Abruf der Datei, die über Input "eingelesen" wird
    let datei = document.getElementById("button-turnier-import").files[0];

    //überprüfen, ob es sich um eine Turnierexport-Datei handelt (nicht sicher, es wird nur der Name geprüft)
    if (!datei.name.includes("turnierexport-")) {
        alert("Dies ist keine Turnierexport-Datei.");
        return;
    }

    //Array mit den drei Speichereinheiten, die für ein Turnier gebraucht werden
    let speicherarray = ["Spielerergebnisse", "Spielrunden", "Turniereinstellungen"];

    let dateiinhalt = new FileReader();
    dateiinhalt.onload = function () {

        let turnierexportString = dateiinhalt.result;

        for (let speichervariable = 0; speichervariable < speicherarray.length; speichervariable++) {

            let suchindexStart = turnierexportString.indexOf(speicherarray[speichervariable]) + speicherarray[speichervariable].length + 1;

            let localstorageDatei;
            if (speichervariable == speicherarray.length - 1) {
                localstorageDatei = turnierexportString.slice(suchindexStart, turnierexportString.length);
                localStorage.setItem("turniereinstellungen", localstorageDatei);
            } else {
                let suchindexEnde = turnierexportString.indexOf(speicherarray[speichervariable + 1]) + 1;
                localstorageDatei = turnierexportString.slice(suchindexStart, suchindexEnde - 1);

                if (speichervariable == 0) {
                    localStorage.spielerergebnisse = localstorageDatei;
                } else if (speichervariable == 1) {
                    localStorage.spielrunden = localstorageDatei;
                }
            }

        }
    }
    dateiinhalt.readAsText(this.files[0]);

    //laden aller Einstellungen auf Seite
    location.reload();
}