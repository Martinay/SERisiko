package ServerLogic.Model.Server;

import ServerLogic.Model.Game;
import ServerLogic.Model.Player;
import ServerLogic.Model.PlayerStatus;
import net.hydromatic.linq4j.Linq4j;

import java.util.LinkedList;
import java.util.List;
import java.util.function.Consumer;

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
        player.PlayerStatus = PlayerStatus.InLobby;
    }
    
    public void RemovePlayer(Player player)
    {
        _players.remove(player);
    }

    public void RemovePlayer(List<Player> player)
    {
        Linq4j.asEnumerable(player)
                .forEach(new Consumer<Player>() {
                    @Override
                    public void accept(Player player) {
                        RemovePlayer(player);
                    }
                });
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

    public ServerGame TryGetGameById(int gameId)
    {
        try {
            return GetGameById(gameId);
        }
        catch (RuntimeException ex)
        {
            return null;
        }
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
