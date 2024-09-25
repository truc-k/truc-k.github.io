window.onload = function () {

    //Einstellung für die Anzeige der Teams
    //mit jedem neu laden wird im local storage die anzuzeigende Runde abgerufen
    if (localStorage.getItem("anzeige")) {
        let runde = localStorage.getItem("anzeige");

        let container = document.getElementById("anzeige");

        let spielrundenMap = new Map(JSON.parse(localStorage.spielrunden));

        if (!spielrundenMap.get("runde-" + runde)) {
            let abschnittInfotext = document.createElement("p");
            abschnittInfotext.innerText = "Runde " + runde + " wurde noch nicht erstellt."
            abschnittInfotext.id = "anzeige-info";
            container.appendChild(abschnittInfotext);
            return;
        }

        let anzuzeigendeSpielrunde = JSON.parse(spielrundenMap.get("runde-" + runde));

        let spieleranzahl = anzuzeigendeSpielrunde[0];
        let teamgroeße = Number(anzuzeigendeSpielrunde[1]);
        let teamanzahl = anzuzeigendeSpielrunde[2];
        let pausenspieleranzahl = anzuzeigendeSpielrunde[4];
        let spielfeldAnzahl = anzuzeigendeSpielrunde[5];

        //Abruf der Spielfeldnamen
        let spielfelder = JSON.parse(localStorage.getItem("anzeige-spielfelder"));

        //Array mit allen aktiven Spielern (also ohne Pausenspieler)
        let teamzuordnung = anzuzeigendeSpielrunde.slice(6 + pausenspieleranzahl, anzuzeigendeSpielrunde.length);

        //Abruf der Teams und Eintrag auf Anzeige zugeordnet auf die Spielfelder in Abhängigkeit der Teams pro Spielfeld
        for (let spielfeldzahl = 0; spielfeldzahl < spielfeldAnzahl; spielfeldzahl++) {

            let spielfeldAbschnitt = document.createElement("div");
            spielfeldAbschnitt.id = "anzeige-spielfeld-" + (spielfeldzahl + 1);
            let spielfeldName = document.createElement("p");
            spielfeldName.innerText = spielfelder[spielfeldzahl];
            spielfeldAbschnitt.appendChild(spielfeldName);

            for (let teamzahl = 0; teamzahl < teamanzahl; teamzahl++) {

                let abschnittTeam = document.createElement("div");
                abschnittTeam.innerText = "Team " + (spielfeldzahl * teamanzahl + teamzahl + 1);
                abschnittTeam.id = "anzeige-team-" + (spielfeldzahl * teamanzahl + teamzahl + 1);

                //eintragen der Teammitglieder
                for (let teammitgliedzahl = teamzahl + spielfeldzahl * teamanzahl; teammitgliedzahl < spieleranzahl - pausenspieleranzahl; teammitgliedzahl += (spieleranzahl - pausenspieleranzahl) / teamgroeße) {
                    let teammitglied = document.createElement("p");
                    teammitglied.innerText = teamzuordnung[teammitgliedzahl];
                    teammitglied.id = "teammitglied-" + (teammitgliedzahl) + "-team-" + (teamzahl + 1);
                    abschnittTeam.appendChild(teammitglied);
                }

                spielfeldAbschnitt.appendChild(abschnittTeam);
            }

            container.appendChild(spielfeldAbschnitt);
        }

        //Pausenspieler, wenn vorhanden
        if (pausenspieleranzahl != 0) {
            //Array mit allen Pausenspielern
            let allePausenspieler = anzuzeigendeSpielrunde.slice(6, 6 + pausenspieleranzahl);

            let abschnittPausenspieler = document.createElement("div");
            abschnittPausenspieler.innerText = "Pausenspieler";
            abschnittPausenspieler.id = "anzeige-pausenspieler";

            //Eintrag der Pausenspieler
            for (let p = 0; p < pausenspieleranzahl; p++) {
                let pausenspieler = document.createElement("p");
                pausenspieler.innerText = allePausenspieler[p];
                pausenspieler.id = "pausenspieler-" + (p + 1);
                abschnittPausenspieler.appendChild(pausenspieler);
            }

            container.appendChild(abschnittPausenspieler);

        }
    }


}