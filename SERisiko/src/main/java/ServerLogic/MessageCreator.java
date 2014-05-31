package ServerLogic;

import ServerLogic.Messages.*;

import java.util.List;

class MessageCreator {
    static ReadyStateChangedMessage CreateReadyStateChangedMessage(List<Integer> idsToUpdate, Player player, boolean readyState)
    {
        ReadyStateChangedMessage message = new ReadyStateChangedMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.Player = player;
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

    static GameStartedMessage CreateGameStartedMessage(List<Integer> playerIdsInGame, List<Integer> playerIdsInLobby, Game game)
    {
        GameStartedMessage message = new GameStartedMessage();
        message.PlayerIDsToUpdate = playerIdsInGame;
        message.GameStarted = true;
        message.DeleteGameFromLobbyMessage = CreateDeleteGameFromLobbyMessage(playerIdsInLobby, game);
        return message;
    }

    static DeleteGameFromLobbyMessage CreateDeleteGameFromLobbyMessage(List<Integer> playerIdsInLobby,Game game)
    {
        DeleteGameFromLobbyMessage message = new DeleteGameFromLobbyMessage();
        message.PlayerIDsToUpdate = playerIdsInLobby;
        message.Game = game;
        return message;
    }

    //Join wasn't successful
    public static NewPlayerJoinedMessage CreateNewPlayerJoinedMessage(List<Integer> idsToUpdate) {

        NewPlayerJoinedMessage message = new NewPlayerJoinedMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.Successful = false;
        return message;
    }

    static NewPlayerJoinedMessage CreateNewPlayerJoinedMessage(List<Integer> idsToUpdate, List<Player> playersInGame) {
        NewPlayerJoinedMessage message = new NewPlayerJoinedMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.Successful = true;
        message.PlayersInGame = playersInGame;
        return message;
    }

    public static PlayerLeftMessage CreatePlayerLeftMessage(List<Integer> idsToUpdate, Player player) {
        PlayerLeftMessage message = new PlayerLeftMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.Player = player;
        return message;
    }

    public static PlayerLeftMessage CreatePlayerLeftMessage(List<Integer> idsToUpdate, Player player, List<Integer> playerIdsInLobby, Game game) {
        PlayerLeftMessage message = new PlayerLeftMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.Player = player;
        message.DeleteGameFromLobbyMessage = CreateDeleteGameFromLobbyMessage(playerIdsInLobby, game);
        return message;
    }

    public static GameCreatedMessage CreateGameCreatedMessage(List<Integer> idsToUpdate, Game game) {
        GameCreatedMessage message = new GameCreatedMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.NewGame = game;
        return message;
    }

    public static PlayerLeftLobbyMessage CreatePlayerLeftLobbyMessage(List<Integer> idsToUpdate, Player player) {
        PlayerLeftLobbyMessage message = new PlayerLeftLobbyMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.Player = player;

        return message;
    }

    public static AddNewPlayerToLobbyMessage CreateAddNewPlayerToLobbyMessage(List<Integer> idsToUpdate, Player player) {
        AddNewPlayerToLobbyMessage message = new AddNewPlayerToLobbyMessage();
        message.Player = player;
        message.PlayerIDsToUpdate = idsToUpdate;
        return message;
    }
}
