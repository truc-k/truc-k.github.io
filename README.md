# Website für Spielplangeneratoren

# Zufallsspielplan

## Turniereinstellungen
Die Idee des Zufallsspielplan ist, Spieler jede Spielrunde in neue zufällig generierte Teams aufzuteilen.
Dafür werden die Spieleranzahl pro Team und die Teamanzahl pro Spielfeld festgelegt. Optional kann auch die Spielfeldanzahl festgelegt werden, ansonsten wird diese automatisch bestimmt, so dass möglichst viele Spiele spielen können. Anschließend muss festgelegt werden, ob das Turnier mit oder ohne Spielernamen erstellt werden soll. Dies kann nachträglich nicht mehr geändert werden. Einziger Unterschied zwischen beiden Optionen ist der Umgang mit Änderungen: Bei beiden Optionen können beliebig Spieler hinzugefügt werden, Spieler entfernen ist auch möglich, jedoch mit dem Unterschied, dass die Ergebnisspeicherung bei Namen für jeden eindeutigen Namen ein Ergebnisspeicher angelegt wird, ohne Namen wird für jede Zahl ein Speicher angelegt. Die Zahlen sind im Gegenteil zu den Namen nicht einzigartig und werden weiter beschrieben, wenn "die Zahl" wieder am Turnier teilnimmt.
Egal ob mit oder ohne Namen, werden nun alle Spieler eingegeben, entweder einzeln mit Name (jeder Name darf nur einmal vorkommen, die Namensgebung ist völlig frei) oder einfach nur die Gesamtspieleranzahl. Optional können auch Leistungsspieler bestimmt werden, dies soll ausgeglichenere Teams ermöglichen. Auch hier werden entweder die Namen einzeln eingegeben oder die Gesamtzahl der Leistungsspieler.

Die Teamaufteilung erfolgt so, dass zunächst alle Leistungsspieler (wenn vorhanden) gleichmäßig auf die Teams verteilt werden und anschließend alle restlichen Spieler auf die Teams verteilt werden. Hierbei werden auch Pausenspieler bestimmt (wenn notwendig), diese nehmen nicht an der Spielrunde teil. Alle Spieler haben nach Möglichkeit gleich oft Pause, wenn sie alle gleichmäßig an den Spielrunden teilnehmen.

## Spielrunden
Sind die Einstellungen gespeichert können Spielrunden mit den aktuellen Einstellungen erstellt werden. Die Erstellung einer Spielrunde beruht auf den aktuell gespeicherten Einstellungen. Die Einstellungen können jederzeit geändert werden, bereits erstellte Spielrunden sind von diesen Änderungen nicht betroffen.

## Ergebniseintrag und -auswertung
Die Ergebniseintragung ist für jede Spielrunde möglich. Gespeicherte Teamergebnisse werden direkt für jeden Spieler einzeln übernommen und anschließend auch in der Bestenliste entsprechend angezeigt. Hovert man mit der Maus über einen Spielernamen in der Bestenliste werden die Ergebnisse des Spielers angezeigt.

## Anzeige
Es ist möglich, ein zweites Fenster zu öffnen, indem die Teams und Pausenspieler einer Spielrunde angezeigt werden. Dazu einfach die gewünschte Spielrunde bei "Anzeige für Runde" sowie die Namen der Spielfelder (freie Namenswahl) eintragen, das Anzeigefenster wird automatisch geöffnet und kann beliebig verschoben werden. Bei Änderung der anzuzeigende Runde aktualisiert sich die Anzeige automatisch.