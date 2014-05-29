
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

    ServerGame(Player player, String name, int id) {
        Players.add(player);
        Name = name;
        ID = id;
    }

    @Override
    public int GetPlayerCount() {
        return Players.size();
    }

    public List<Integer> GetPlayerIds()
    {
        List<Integer> IDs = new LinkedList<Integer>();

        for (Player player : Players) {
            IDs.add(player.ID);
        }

        return IDs;
    }

    public boolean AreAllPlayerReady()
    {
        for (Player player : Players) {
            if (!player.Ready)
                return false;
        }
        return true;
    }

    public void Start()
    {

    }

}
