package ServerLogic.Messages.GameLogicInteraction;

import ServerLogic.Model.Player;

import java.util.List;

/**
 * Created by Martin on 6/20/2014.
 */
public class EndTurn {
    public boolean EndGame;
    public int UnitsToPlaceNextPlayer;
    public Player NextPlayer;
    public List<Player> DefeatedPlayer;
}
