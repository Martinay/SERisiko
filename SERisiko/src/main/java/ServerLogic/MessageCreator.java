package ServerLogic;

import ServerLogic.Messages.*;

import java.util.List;

class MessageCreator {
    static ReadyStateChangedMessage CreateReadyStateChangedMessage(List<Integer> idsToUpdate, int playerId, boolean readyState)
    {
        ReadyStateChangedMessage message = new ReadyStateChangedMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.PlayerId = playerId;
        message.ReadyState = readyState;
        return message;
    }

    //Game wasn't started successfully
    static GameStartedMessage CreateGameStartedMessage(List<Integer> idsToUpdate)
    {
        GameStartedMessage message = new GameStartedMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.GameStarted = false;
        return message;
    }

    static GameStartedMessage CreateGameStartedMessage(List<Integer> playerIdsInGame, List<Integer> playerIdsInLobby, int gameId)
    {
        GameStartedMessage message = new GameStartedMessage();
        message.PlayerIDsToUpdate = playerIdsInGame;
        message.GameStarted = true;
        message.DeleteGameFromLobbyMessage = CreateDeleteGameFromLobbyMessage(playerIdsInLobby, gameId);
        return message;
    }

    static DeleteGameFromLobbyMessage CreateDeleteGameFromLobbyMessage(List<Integer> playerIdsInLobby,int gameId)
    {
        DeleteGameFromLobbyMessage message = new DeleteGameFromLobbyMessage();
        message.PlayerIDsToUpdate = playerIdsInLobby;
        message.GameId = gameId;
        return message;
    }

    static NewPlayerJoinedMessage CreateNewPlayerJoinedMessage(List<Integer> idsToUpdate, List<Player> playersInGame) {
        NewPlayerJoinedMessage message = new NewPlayerJoinedMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.PlayersInGame = playersInGame;
        return message;
    }

    public static PlayerLeftMessage CreatePlayerLeftMessage(List<Integer> idsToUpdate, int playerId) {
        PlayerLeftMessage message = new PlayerLeftMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.PlayerID = playerId;
        return message;
    }

    public static PlayerLeftMessage CreatePlayerLeftMessage(List<Integer> idsToUpdate, int playerId, List<Integer> playerIdsInLobby, int gameId) {
        PlayerLeftMessage message = new PlayerLeftMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.PlayerID = playerId;
        message.DeleteGameFromLobbyMessage = CreateDeleteGameFromLobbyMessage(playerIdsInLobby, gameId);
        return message;
    }

    public static GameCreatedMessage CreateGameCreatedMessage(List<Integer> idsToUpdate, Game game) {
        GameCreatedMessage message = new GameCreatedMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.NewGame = game;
        return message;
    }

    public static PlayerLeftLobbyMessage CreatePlayerLeftLobbyMessage(List<Integer> idsToUpdate, int playerID) {
        PlayerLeftLobbyMessage message = new PlayerLeftLobbyMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.PlayerID = playerID;

        return message;
    }

    public static AddNewPlayerToLobbyMessage CreateAddNewPlayerToLobbyMessage(List<Integer> idsToUpdate, Player player) {
        AddNewPlayerToLobbyMessage message = new AddNewPlayerToLobbyMessage();
        message.Player = player;
        message.PlayerIDsToUpdate = idsToUpdate;
        return message;
    }
}
