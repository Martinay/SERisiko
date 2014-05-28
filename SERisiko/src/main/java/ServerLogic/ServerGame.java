
package ServerLogic;

import ServerLogic.Messages.Game;
import ServerLogic.Messages.Player;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author Martin
 */
class ServerGame extends Game {
    
    List<Player> Players = new LinkedList<Player>();
    
    @Override
    public int GetPlayerCount() {
        return Players.toArray().length;
    }

}
