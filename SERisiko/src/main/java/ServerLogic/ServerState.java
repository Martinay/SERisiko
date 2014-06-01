package ServerLogic;

import ServerLogic.Messages.Player;

import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author Martin
 */
class ServerState {
    List<Player> Players = new LinkedList<Player>();
    Lobby Lobby = new Lobby();
    List<ServerGame> ActiveGames = new LinkedList<ServerGame>();
    
    public Player GetPlayer(int playerID)
    {
        for (Player player : Players) {
            if (player.ID == playerID) {
                return player;
            }
        }
        
        throw new RuntimeException("PlayerID not Found");
    }

    public ServerGame GetActiveGameByPlayerId(int playerID)
    {
        for (ServerGame game : ActiveGames) {
                    for (Player player : game.Players)
                    {
                        if (player.ID == playerID)
                            return game;
            }
        }

        throw new RuntimeException("Game not Found");
    }
    
}
