package ServerLogic.Messages;

import ServerLogic.Model.Game;
import ServerLogic.Model.MapChange;
import ServerLogic.Model.Player;

import java.util.List;

/**
 * Created by Martin on 6/24/2014.
 */
public class EndFirstUnitPlacementMessage extends MessageBase{
    public List<MapChange> CurrentMap; // Komplette Karte, wenn alle Spieler fertig sind
    public Game Game;// wenn alle Spieler fertig sind
    public Player Player;//  Spieler der gerade alle Einheiten platziert hat
}
