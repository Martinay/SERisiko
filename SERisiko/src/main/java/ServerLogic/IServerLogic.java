package ServerLogic;

import ServerLogic.Messages.*;

import java.util.List;

public interface IServerLogic {

    //InGame
    MapChangedMessage PlaceUnits(int playerID, String countryID, int units);
    MapChangedMessage Attack(int playerID, String countryFromID, String countryToID, int units);
    void EndAttack(int playerID);
    MapChangedMessage Move(int playerID, String countryFromID, String countryToID, int units);
    EndTurnMessage EndTurn(int playerID);

    //Lobby
    void CreatePlayer(int playerID, String playerName);
    AddNewPlayerToLobbyMessage JoinLobby(int playerID);
    PlayerLeftLobbyMessage LeaveLobby(int playerID);
    List<Game> GetGamesInLobby();
    List<Player> GetPlayersInLobby();

    NewPlayerJoinedMessage JoinGame(int playerID, int GameID);
    PlayerLeftMessage LeaveGame(int playerID, int GameID);
    GameCreatedMessage CreateGame(int playerID, String GameName, int maxPlayer);
    GameStartedMessage StartGame(int playerID);
    List<Player> GetPlayersInGame(int playerID);

    ReadyStateChangedMessage ChangeReadyStatus(int playerID, boolean state);

}
