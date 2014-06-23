package ServerLogic.Messages;

import ServerLogic.Model.Player;

import java.util.List;

public class EndTurnMessage extends MessageBase {
    public Player NewActivePlayer; //zum Gameobjekt adden (activePlayer)
    public boolean EndGame; //zum Gameobjekt adden (finished)
    public List<Player> DefeatedPlayer; //zum PLayerobjekt adden (killed)
    public int UnitsToPlaceNextPlayer; //zum PLayerobjekt adden (freeSupply)
}
