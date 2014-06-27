package ServerLogic;

import ServerLogic.Messages.*;
import ServerLogic.Model.ClientMapChange;
import ServerLogic.Model.Game;
import ServerLogic.Model.Player;

import java.util.List;

public interface IServerLogic {

    //InGame
    MapChangedMessage PlaceUnits(int playerID, String countryID, int units);
    MapChangedMessage Attack(int playerID, String countryFromID, String countryToID, int units);
    void EndAttack(int playerID);
    MapChangedMessage Move(int playerID, String countryFromID, String countryToID, int units);
    EndTurnMessage EndTurn(int playerID);
    EndFirstUnitPlacementMessage EndFirstUnitPlacement(int playerID, List<ClientMapChange> clientMapChanges );

    //Lobby
    PlayerCreatedMessage CreatePlayer(int playerID, String playerName);
    AddNewPlayerToLobbyMessage JoinLobby(int playerID);
    PlayerLeftMessage LeaveServer(int playerID);
    List<Game> GetGamesInLobby();
    List<Player> GetPlayersInLobby();

    //LobbyGame
    NewPlayerJoinedGameMessage JoinGame(int playerID, int GameID);
    PlayerLeftGameMessage LeaveGame(int playerID);
    GameCreatedMessage CreateGame(int playerID, String GameName, int maxPlayer);
    GameStartedMessage StartGame(int playerID);
    List<Player> GetPlayersInGame(int playerID);
    ReadyStateChangedMessage ChangeReadyStatus(int playerID, boolean state);

}
