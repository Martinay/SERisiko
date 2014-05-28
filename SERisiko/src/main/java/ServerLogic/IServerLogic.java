package ServerLogic;

import ServerLogic.Messages.Game;
import ServerLogic.Messages.Player;
import ServerLogic.Messages.PlayerLeftMessage;
import ServerLogic.Messages.NewPlayerJoinedMessage;
import ServerLogic.Messages.EndTurnMessage;
import ServerLogic.Messages.PlayerLeftLobbyMessage;
import ServerLogic.Messages.GameCreatedMessage;
import ServerLogic.Messages.MapChangeMessage;
import ServerLogic.Messages.GameStartedMessage;
import ServerLogic.Messages.AddNewPlayerToLobbyMessage;

import java.util.List;

public interface IServerLogic {

    //InGame
    MapChangeMessage Attack(int playerID, int countryFromID, int countryToID, int units);
    MapChangeMessage Move(int playerID, int countryFromID, int countryToID, int units);
    MapChangeMessage PlaceUnits(int playerID, int countryID, int units);
    EndTurnMessage EndTurn(int playerID);

    //Lobby
    void CreatePlayer(int playerID, String playerName);
    AddNewPlayerToLobbyMessage JoinLobby(int playerID);
    PlayerLeftLobbyMessage LeaveLobby(int playerID);

    NewPlayerJoinedMessage JoinGame(int playerID, int GameID);
    PlayerLeftMessage LeaveGame(int playerID, int GameID);
    GameCreatedMessage CreateGame(int playerID, String GameName);
    GameStartedMessage StartGame(int playerID);

    void ChangeReadyStates(int playerID, boolean state);

    List<Game> GetGames(Player player, String GameName);
    List<Player> GetPlayersInLobby();
    List<Player> GetPlayersInGame(int GameID);
}
