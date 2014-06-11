package ServerLogic.Model;

import java.util.LinkedList;
import java.util.List;

public class Lobby {
    private List<Player> _players = new LinkedList<>();
    private List<ServerGame> _openGames = new LinkedList<ServerGame>();

    public void AddGame(ServerGame game)
    {
        _openGames.add(game);
    }

    public void RemoveGame(ServerGame game)
    {
        _openGames.remove(game);
    }

    public void AddPlayer(Player player) {
        _players.add(player);
    }
    
    public void DeletePlayer(Player player)
    {
        _players.remove(player);
    }

    public ServerGame GetGameByPlayerId(int playerId)
    {
        for (ServerGame game : _openGames)
        {
            for (Player player : game.Players)
            {
                if (player.ID == playerId)
                    return game;
            }
        }
        throw new RuntimeException("Game not found");
    }

    public ServerGame GetGameById(int gameId)
    {
        for (ServerGame game : _openGames)
            if (game.ID == gameId)
                return game;

        throw new RuntimeException("Game not found");
    }

    public List<Game> GetOpenGames()
    {
        return new LinkedList<Game>(_openGames);
    }

    public List<Player> GetPlayer()
    {
        return _players;
    }
    
    public List<Integer> GetPlayerIDs()
    {
        List<Integer> IDs = new LinkedList<>();
        
        for (Player player : _players) {
            IDs.add(player.ID);
        }
        return IDs;
    }
}
