# Dokumentation Website für Spielplangeneratoren

# Zufallsspielplan

## Code

### onload-function (in `zufallspielplan.js`)
Mit Neuladen der Seite wird, wenn vorhanden, das Turniereinstellungsarray aus dem local Storage abgerufen. Alle Einstellungsparameter werden dann entsprechend angezeigt und alle Einstellungsfenster auf "read-only" gestellt. Außerdem wird die Bestenliste wieder eingefügt, alle bereits im local Storage gespeicherten Spielrunden werden wieder eingefügt und die Spielfeldnamen der Anzeige wieder eingefügt.

### `spielernamenWahl`
Die Funktion wird mit drücken einer der Auswahl-Buttons für die Namenswahl abgerufen und überprüft mit der if-Bedingung, ob die Felder für die Spielernamen bzw. -anzahl leer sind, wenn man die Option wechseln möchte.

### `neuesTurnier`
Die Funktion fragt, ob ein neues Turnier erstellt werden soll. Wird dies bejaht, wird der komplette local Storage geleert und die Seite neu geladen.

### `turnierAendern`
Die Funktion deaktiviert "read-only" von den Einstellungsfenstern.

### `turnierSpeichern`
Die Funktion speichert die eingestellen Turniereinstellungen in einem Array und legt dieses im local Storage ab. Parallel wird überprüft, ob alle notwendigen Einstellungen getätigt wurden.

### `neueRundeGenerieren`
Die Funktion erstellt eine Spielrunde und speichert diese im local Storage. Dafür werden zunächst die Pausenspieler bestimmt, wenn benötigt, dafür wird die vorherige Spielrunde, wenn vorhanden, abgerufen und der letzte Pausenspieler abgerufen. Mit der Spielerergebnis wird ein Gesamtspielerarray erstellt, auf dessen Grundlage die Reihenfolge der Pausenzuordnung möglichst gleichmäßig erstellt wird. Gab es keine vorherige Spielrunde bzw. keine Pausenspieler in der vorherigen Spielrunde, beginnt die Pausenspielerbestimmung mit dem ersten teilnehmenden Spieler aus der Spielerergebnismap. Gibt es keine Leistungsgruppen, wird das Spielerarray mit allen aktiven Spielern der Spielrunde gemischt (Fisher-Yates-Shuffle) und anschließend dem Spielrundenarray hinzugefügt. Gibt es Leistungsgruppen, wird für jede Leistungsgruppe ein einzelnes Array erstellt, eventuelle Pausenspieler aus diesem entfernt und das Namensarray der Leistungsgruppe gemischt und dann dem Spielrundenarray hinzugefügt.

### `rundeOeffnen`
Die Funktion holt die ausgewählte (geklickte) Spielrunde aus der Spielrundenmap aus dem local Storage und führt die Teamzuordnung mit Hilfe der Einstellungsparameter durch und bildet diese in einem Fenster ab.

### `rundeErgebnisSpeichern`
Die Funktion ruft die Ergebnisse der einzelnen Teams ab, wertet dieses aus und speichert für jeden Spieler individuell dessen Ergebnisse in der Spielerergebnismap. Außerdem wird das Ergebnis im Rundenarray der jeweiligen Runde am Ende des Arrays gespeichert.

### `rundeErgebnisAbbrechen`
Die Funktion schließt das "Fenster" für den Ergebniseintrag wieder, ohne Ergebnisse zu speichern.

### `rundeLoeschen`
Die Funktion fragt den Nutzer, ob er die Runde wirklich löschen will. Wenn dies bejaht wird, wird die Spielrunde aus dem Spielrundenarray gelöscht und wenn nötig, die Spielerergebnisse korrigiert.

### `spielerergebnisKorrigieren`
Die Funktion ruft das alte Spielerergebnis der ausgewählten Spielrunde aus dem Spielrundenarray ab, korrigiert die Spielerergebnisse der beteiligten Spieler und löscht die Ergebnisse aus dem Spielrundenarray. Anschließend werden die neuen Ergebnisse abgerufen, im Spielrundenarray gespeichert, ausgewertet und für jeden Spieler in der Spielerergebnismap gespeichert.

### `spielerergebnisBestenliste`
Die Funktion erstellt auf Grundlage der Spielerergebnismap ein Ranking für jede Kategorie der Spielerergebnisse und listet diese auf der Seite auf.

### `spielerergebnisAbrufen`
Die Funktion fügt ein Textfeld an der Mausposition ein, wenn die Maus sich auf einem Spielernamen in der Bestenliste befindet. In dem Textfeld werden die Spielerergebnisse des ausgewählten Spielers gespeichert.

### `anzeigefensterOeffnen`
Die Funktion überprüft, ob der Nutzer Namen für Spielfelder eingegeben hat und wenn ja, öffnet er das Anzeigefenster als Extrafenster.

### `anzeigeNaechsteRunde`
Die Funktion ruft die bisher angezeigte Runde ab und zeigt dann die nächste Spielrunde im Fenster an. Ist keine weitere Spielrunde erstellt, besteht die Möglichkeit, direkt hier eine neue Runde zu erstellen.

### `turnierExport`
Die Funktion speichert alle relevanten local Storage Dateien in einem Textfile, welches der Nutzer dann auf seinem PC speichern kann.

### `turnierImport`
Die Funktion liest die Datei ein, überprüft sie auf Richtigkeit und speichert dann die Daten einzeln wieder aus der Textfile im local Storage.

### onload-function (in `anzeige_zufallsspielplan.js`)
Die Funktion ruft die anzuzeigene Spielrunde aus dem local Storage ab, führt die Teamzuordnung durch und zeigt sie auf der Anzeige an.

## local-Storage Daten
### Turniereinstellungen (`turniereinstellungen`)
Array, in welchem die aktuellen Turnierdaten, die zur Erstellung neuer Turnierrunden gebraucht werden, gespeichert werden. Das Array setzt sich wie folgt zusammen:
|Arraystelle|Inhalt|
|:-:|-|
|0|Spieleranzahl|
|1|Teamgröße (Spieler pro Team)|
|2|Teamanzahl (Teams pro Spielfeld)|
|3|Pausenspieleranzahl|
|4|Spielfeldanzahl|
|5|Leistungsgruppenanzahl|
|*|Anzahl der Spieler pro Leistungsgruppe|
|*|Namen aller Leistungsspieler|
|*|Namen aller sonstigen Spieler|

### Spielrunden (`spielrunden`)
Map, welche die Spielrunden des Turniers speichert. Spielrunden werden mit Name `runde-X` gespeichert. Das Spielrundenarray setzt sich wie folgt zusammen:
|Arraystelle|Inhalt|
|:-:|-|
|0|Spieleranzahl|
|1|Teamgröße (Spieler pro Team)|
|2|Teamanzahl (Teams pro Spielfeld)|
|3|Pausenspieleranzahl|
|4|Spielfeldanzahl|
|5|Leistungsgruppenanzahl|
|*|Namen aller Pausenspieler|
|*|Teamzuordnung|

Die Teamzuordnung listet alle aktiven Spieler einer Spielrunde auf. Die Zuordnung beginnt mit Spieler 1 von Team 1, es folgen die ersten Spieler der anderen Teams, anschließend kommt Spieler 2 von Team 1 usw.

>**Beispiel**\
>Teamzuordnung: Hannes, Nick, Lennart, Ulrieke, Alicia, Kristin\
>Team 1: Hannes, Lennart, Alicia\
>Team 2: Nick, Ulrieke, Kristin

### Spielerergebnisse (`spielerergebnisse`)
Map, welche die Ergebnisse jedes einzelnen Spielers speichert. Die einzelnen Speicherarrays werden mit dem Namen des Spielers gespeichert und setzen sich wie folgt zusammen:
|Arraystelle|Inhalt|
|:-:|-|
|0|Anzahl der gespielten Spielrunden|
|1|Anzahl der Siege|
|2|Punktzahl (Summe der erzielten Punkte des eigenen Teams)|
|3|Punktedifferenz (Differenz der Ergebnisse aus gespielten Spielrunden)|
|4|Punkte aus Ergebnisbewertung|

### Anzeige (`anzeige` und `anzeige-spielfelder`)
Beide Werte sind für das korrekte funktionieren der Anzeige verantwortlich. `anzeige` speichert die aktuell anzuzeigende Runde und `anzeige-spielfelder` speichert die Namen der Spielfelder, welche benutzt werden sollen.