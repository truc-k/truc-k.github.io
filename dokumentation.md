# Dokumentation Website für Spielplangeneratoren

# Zufallsspielplan

## local-Storage Daten
### Turniereinstellungen (`turniereinstellungen`)
Array, in welchem die aktuellen Turnierdaten, die zur Erstellung neuer Turnierrunden gebraucht werden, gespeichert werden. Das Array setzt sich wie folgt zusammen:
|Arraystelle|Inhalt|
|:-:|-|
|0|Spieleranzahl|
|1|Teamgröße (Spieler pro Team)|
|2|Teamanzahl (Teams pro Spielfeld)|
|3|Leistungsspieleranzahl|
|4|Pausenspieleranzahl|
|5|Spielfeldanzahl|
|*|Namen aller Leistungsspieler|
|*|Namen aller sonstigen Spieler|

### Spielrunden (`spielrunden`)
Map, welche die Spielrunden des Turniers speichert. Spielrunden werden mit Name `runde-X` gespeichert. Das Spielrundenarray setzt sich wie folgt zusammen:
|Arraystelle|Inhalt|
|:-:|-|
|0|Spieleranzahl|
|1|Teamgröße (Spieler pro Team)|
|2|Teamanzahl (Teams pro Spielfeld)|
|3|Leistungsspieleranzahl|
|4|Pausenspieleranzahl|
|5|Spielfeldanzahl|
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