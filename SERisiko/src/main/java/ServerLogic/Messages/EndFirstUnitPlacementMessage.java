package ServerLogic.Messages;

import ServerLogic.Model.Game;
import ServerLogic.Model.MapChange;
import ServerLogic.Model.Player;

import java.util.List;

/**
 * Created by Martin on 6/24/2014.
 */
public class EndFirstUnitPlacementMessage {
    List<MapChange> CurrentMap; // Komplette Karte, wenn alle Spieler fertig sind
    Game Game;// wenn alle Spieler fertig sind
    Player Player;//  Spieler der gerade alle Einheiten platziert hat
}
