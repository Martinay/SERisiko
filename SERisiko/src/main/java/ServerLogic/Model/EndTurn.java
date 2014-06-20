package ServerLogic.Model;

import GameLogic.Spieler;

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
