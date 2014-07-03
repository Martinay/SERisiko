package ServerLogic.Model.Server;

import ServerLogic.Helper.PlayerMapper;
import ServerLogic.Model.Player;

import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author Martin
 */
public class ServerState {
    public List<Player> Players = new LinkedList<>();
    public ServerLogic.Model.Server.Lobby Lobby = new Lobby();
    public List<ServerGame> ActiveGames = new LinkedList<>();
    
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

    public ServerGame GetGameByPlayerId(int playerID)  {
        ServerGame game = null;
        try {
            game = GetActiveGameByPlayerId(playerID);
        }
        catch (RuntimeException ex)
        {}

        if (game == null)
        {
            try {
                game = Lobby.GetGameByPlayerId(playerID);
            }
            catch (RuntimeException ex)
            {}
            if (game== null)
                throw new RuntimeException("No Game Found. PlayerID: " + playerID);

        }

        return game;
    }

    public ServerGame TryGetGameByPlayerId(int playerID)  {
       try {
            return GetGameByPlayerId(playerID);
        }
        catch (RuntimeException ex)
        {
            return null;
        }
    }

    public Player TryGetPlayer(int playerID) {
        try {
            return GetPlayer(playerID);
        }
        catch (RuntimeException ex)
        {
            return null;
        }
    }

    public void SetGameToActiveGame(ServerGame game) {
        Lobby.RemoveGame(game);
        Lobby.RemovePlayer(game.Players);
        ActiveGames.add(game);

    }

    public void RemoveGame(ServerGame game) {
        Lobby.RemoveGame(game);
        ActiveGames.remove(game);
    }

    public void RemovePlayer(Player player) {
        Lobby.RemovePlayer(player);
        Players.remove(player);
        PlayerMapper.Remove(player);
    }
}
