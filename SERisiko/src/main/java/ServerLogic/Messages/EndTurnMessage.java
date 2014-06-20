package ServerLogic.Messages;

import ServerLogic.Model.Player;

import java.util.List;

public class EndTurnMessage extends MessageBase {
    public Player NewActivePlayer;
    public boolean EndGame;
    public List<Player> DefeatedPlayer;
    public int UnitsToPlaceNextPlayer;
}
