package ServerLogic;

import ServerLogic.Messages.*;

import java.util.Arrays;
import java.util.List;
public class ServerLogic implements IServerLogic {

    private ServerState _state = new ServerState();

    @Override
    public MapChangedMessage Attack(int playerID, int countryFromID, int countryToID, int units) {
        return null;
    }

    @Override
    public MapChangedMessage Move(int playerID, int countryFromID, int countryToID, int units) {
        return null;
    }

    @Override
    public MapChangedMessage PlaceUnits(int playerID, int countryID, int units) {
        return null;
    }

    @Override
    public EndTurnMessage EndTurn(int playerID) {
        return null;
    }

    @Override
    public void CreatePlayer(int playerID, String playerName) {
        _state.Players.add(new Player(playerID, playerName));
    }

    @Override
    public AddNewPlayerToLobbyMessage JoinLobby(int playerID) {
        
        Player player = _state.GetPlayer(playerID);
        _state.Lobby.AddPlayer(player);
        
    return MessageCreator.CreateAddNewPlayerToLobbyMessage(_state.Lobby.GetPlayerIDs(),player);
    }

    @Override
    public PlayerLeftLobbyMessage LeaveLobby(int playerID) {
        Player player = _state.GetPlayer(playerID);
        _state.Lobby.DeletePlayer(player);
        _state.Players.remove(player);
        
        return MessageCreator.CreatePlayerLeftLobbyMessage(_state.Lobby.GetPlayerIDs(), player);
    }

    @Override
    public NewPlayerJoinedMessage JoinGame(int playerID, int gameId) {
        Player player = _state.GetPlayer(playerID);
        ServerGame game = _state.Lobby.GetGameById(gameId);

        game.Players.add(player);

        return MessageCreator.CreateNewPlayerJoinedMessage(game.GetPlayerIds(),game.Players);
    }

    @Override
    public PlayerLeftMessage LeaveGame(int playerID, int gameId) {
        Player player = _state.GetPlayer(playerID);
        ServerGame game = _state.Lobby.GetGameById(gameId);

        game.Players.remove(player);

        if (game.Players.size()== 0)
        {
            _state.Lobby.RemoveGame(game);
            return MessageCreator.CreatePlayerLeftMessage(game.GetPlayerIds(),player, _state.Lobby.GetPlayerIDs(),game);
        }

        return MessageCreator.CreatePlayerLeftMessage(game.GetPlayerIds(),player);
    }

    @Override
    public GameCreatedMessage CreateGame(int playerID, String gameName) {
        Player player = _state.GetPlayer(playerID);
        ServerGame game = GameCreator.Create(player, gameName);

        _state.Lobby.AddGame(game);

    return MessageCreator.CreateGameCreatedMessage(_state.Lobby.GetPlayerIDs(),game);
    }

    @Override
    public GameStartedMessage StartGame(int playerID) {
        ServerGame game = _state.Lobby.GetGameByPlayerId(playerID);
        if (!game.AreAllPlayerReady())
            return MessageCreator.CreateGameStartedMessage(Arrays.asList(playerID));

        _state.Lobby.RemoveGame(game);
        _state.ActiveGames.add(game);
        game.Start();

        return MessageCreator.CreateGameStartedMessage(game.GetPlayerIds(), _state.Lobby.GetPlayerIDs(),game);
    }

    @Override
    public ReadyStateChangedMessage ChangeReadyStatus(int playerID, boolean state) {
        Player player = _state.GetPlayer(playerID);
        player.Ready = state;

        return MessageCreator.CreateReadyStateChangedMessage(
                _state.Lobby.GetGameByPlayerId(playerID).GetPlayerIds(),
                player,
                state);
    }

    @Override
    public List<Player> GetPlayersInLobby() {
        return _state.Lobby.GetPlayer();
    }

    @Override
    public List<Player> GetPlayersInGame(int gameId) {
        return _state.Lobby.GetGameById(gameId).Players;
    }

    @Override
    public List<Game> GetGamesInLobby() {
        return _state.Lobby.GetOpenGames();
    }
}
