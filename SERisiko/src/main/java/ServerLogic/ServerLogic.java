package ServerLogic;

import ServerLogic.Messages.Game;
import ServerLogic.Messages.PlayerLeftMessage;
import ServerLogic.Messages.Player;
import ServerLogic.Messages.NewPlayerJoinedMessage;
import ServerLogic.Messages.EndTurnMessage;
import ServerLogic.Messages.PlayerLeftLobbyMessage;
import ServerLogic.Messages.GameCreatedMessage;
import ServerLogic.Messages.MapChangeMessage;
import ServerLogic.Messages.GameStartedMessage;
import ServerLogic.Messages.AddNewPlayerToLobbyMessage;

import java.util.List;
import java.util.UUID;

public class ServerLogic implements IServerLogic {

    private State _state = new State();

    @Override
    public MapChangeMessage Attack(int playerID, int countryFromID, int countryToID, int units) {
        return null;
    }

    @Override
    public MapChangeMessage Move(int playerID, int countryFromID, int countryToID, int units) {
        return null;
    }

    @Override
    public MapChangeMessage PlaceUnits(int playerID, int countryID, int units) {
        return null;
    }

    @Override
    public EndTurnMessage EndTurn(int playerID) {
        return null;
    }

    @Override
    public void CreatePlayer(int playerID, String playerName) {
        _state.Players.add(new Player(playerID,playerName));
    }

    @Override
    public AddNewPlayerToLobbyMessage JoinLobby(int playerID) {
        
        Player player = _state.GetPlayer(playerID);
        _state.Lobby.AddPlayer(player);
        
        AddNewPlayerToLobbyMessage message = new AddNewPlayerToLobbyMessage();
        message.Player = player;
        message.PlayerIDsToUpdate.addAll(_state.Lobby.GetPlayerIDs());
        return message;
    }

    @Override
    public PlayerLeftLobbyMessage LeaveLobby(int playerID) {
        Player player = _state.GetPlayer(playerID);
        _state.Lobby.DeletePlayer(player);
        
        PlayerLeftLobbyMessage message = new PlayerLeftLobbyMessage();
        message.PlayerIDsToUpdate = _state.Lobby.GetPlayerIDs();
        message.PlayerID = playerID;
        
        return message;
    }

    @Override
    public NewPlayerJoinedMessage JoinGame(int playerID, UUID GameID) {
        return null;
    }

    @Override
    public PlayerLeftMessage LeaveGame(int playerID, UUID GameID) {
        return null;
    }

    @Override
    public GameCreatedMessage CreateGame(int playerID, String GameName) {
        return null;
    }

    @Override
    public GameStartedMessage StartGame(int playerID) {
        return null;
    }

    @Override
    public void ChangeReadyStates(int playerID, boolean state) {

    }

    @Override
    public List<Player> GetPlayersInLobby() {
        return null;
    }

    @Override
    public List<Player> GetPlayersInGame(UUID GameID) {
        return null;
    }

    @Override
    public List<Game> GetGames(Player player, String GameName) {
        return null;
    }
}
