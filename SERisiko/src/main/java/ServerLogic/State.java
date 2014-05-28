package ServerLogic;

import ServerLogic.Messages.Player;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author Martin
 */
class State {
    List<Player> Players = new LinkedList<Player>();
    Lobby Lobby = new Lobby();
    
    public Player GetPlayer(int playerID)
    {
        for (Player player : Players) {
            if (player.ID == playerID) {
                return player;
            }
        }
        
        throw new RuntimeException("PlayerID Not Found");
    }
    
}
