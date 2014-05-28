package ServerLogic;

import ServerLogic.Responses.*;

import java.util.List;
import java.util.UUID;

public class ServerLogic implements IServerLogic {

    private Lobby _lobby = new Lobby();

    @Override
    public MapChangeResponse Attack(int playerID, int countryFromID, int countryToID, int units) {
        return null;
    }

    @Override
    public MapChangeResponse Move(int playerID, int countryFromID, int countryToID, int units) {
        return null;
    }

    @Override
    public MapChangeResponse PlaceUnits(int playerID, int countryID, int units) {
        return null;
    }

    @Override
    public EndTurnResponse EndTurn(int playerID) {
        return null;
    }

    @Override
    public void CreatePlayer(int playerID, String playerName) {

    }

    @Override
    public AddNewPlayerToLobbyResponse JoinLobby(int playerID) {
        return null;
    }

    @Override
    public PlayerLeftLobbyResponse LeaveLobby(int playerID) {
        return null;
    }

    @Override
    public NewPlayerJoinedResponse JoinGame(int playerID, UUID GameID) {
        return null;
    }

    @Override
    public PlayerLeftResponse LeaveGame(int playerID, UUID GameID) {
        return null;
    }

    @Override
    public GameCreatedResponse CreateGame(int playerID, String GameName) {
        return null;
    }

    @Override
    public GameStartedResponse StartGame(int playerID) {
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
