package ServerLogic;

import ServerLogic.Messages.Player;

import java.util.LinkedList;
import java.util.List;

class Lobby {
    private List<Player> _players = new LinkedList<Player>();

    public void AddPlayer(Player player) {
        _players.add(player);
    }
    
    public void DeletePlayer(Player player)
    {
        _players.remove(player);
    }
    
    public List<Player> GetPlayer()
    {
        return _players;
    }
    
    public List<Integer> GetPlayerIDs()
    {
        List<Integer> IDs = new LinkedList<Integer>();
        
        for (Player player : _players) {
            IDs.add(player.ID);
        }
        return IDs;
    }
}
