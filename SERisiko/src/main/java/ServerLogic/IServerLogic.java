package ServerLogic;

import ServerLogic.Responses.*;

import java.util.List;
import java.util.UUID;

public interface IServerLogic {

    //InGame
    MapChangeResponse Attack(int playerID, int countryFromID, int countryToID, int units);
    MapChangeResponse Move(int playerID, int countryFromID, int countryToID, int units);
    MapChangeResponse PlaceUnits(int playerID, int countryID, int units);
    EndTurnResponse EndTurn(int playerID);

    //Lobby
    void CreatePlayer(int playerID, String playerName);
    AddNewPlayerToLobbyResponse JoinLobby(int playerID);
    PlayerLeftLobbyResponse LeaveLobby(int playerID);

    NewPlayerJoinedResponse JoinGame(int playerID, UUID GameID);
    PlayerLeftResponse LeaveGame(int playerID, UUID GameID);
    GameCreatedResponse CreateGame(int playerID, String GameName);
    GameStartedResponse StartGame(int playerID);

    void ChangeReadyStates(int playerID, boolean state);

    List<Game> GetGames(Player player, String GameName);
    List<Player> GetPlayersInLobby();
    List<Player> GetPlayersInGame(UUID GameID);
}
