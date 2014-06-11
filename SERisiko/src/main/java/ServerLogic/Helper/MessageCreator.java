package ServerLogic.Helper;

import GameLogic.Land;
import ServerLogic.Messages.*;
import ServerLogic.Model.Game;
import ServerLogic.Model.Player;

import java.util.Arrays;
import java.util.List;

public class MessageCreator {
    public static ReadyStateChangedMessage CreateReadyStateChangedMessage(List<Integer> idsToUpdate, Player player, boolean readyState)
    {
        ReadyStateChangedMessage message = new ReadyStateChangedMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.Player = player;
        message.ReadyState = readyState;
        return message;
    }

    //Game wasn't started successfully
    public static GameStartedMessage CreateGameStartedMessage(List<Integer> idsToUpdate)
    {
        GameStartedMessage message = new GameStartedMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.GameStarted = false;
        return message;
    }

    public static GameStartedMessage CreateGameStartedMessage(List<Integer> playerIdsInGame, List<Integer> playerIdsInLobby, Game game)
    {
        GameStartedMessage message = new GameStartedMessage();
        message.PlayerIDsToUpdate = playerIdsInGame;
        message.GameStarted = true;
        message.DeleteGameFromLobbyMessage = CreateDeleteGameFromLobbyMessage(playerIdsInLobby, game);
        return message;
    }

    public static DeleteGameFromLobbyMessage CreateDeleteGameFromLobbyMessage(List<Integer> playerIdsInLobby, Game game)
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

    public static NewPlayerJoinedMessage CreateNewPlayerJoinedMessage(List<Integer> idsToUpdate, List<Player> playersInGame) {
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

    public static GameCreatedMessage CreateGameCreatedMessage(List<Integer> idsToUpdate, Game game, Player createdBy) {
        GameCreatedMessage message = new GameCreatedMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.NewGame = game;
        message.CreatedBy = createdBy;
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

    public static MapChangedMessage CreateMapChangedMessage(List<Integer> idsToUpdate, String countryFromID, String countryToID) {

        MapChangedMessage message = CreateMapChangedMessage(idsToUpdate, countryFromID);

        message.MapChange.add(CreateMapChange(countryToID));

        return message;
    }

    public static MapChangedMessage CreateMapChangedMessage(List<Integer> idsToUpdate, String countryID) {
        MapChangedMessage message = new MapChangedMessage();

        List<MapChange> mapChange = Arrays.asList(CreateMapChange(countryID));

        message.PlayerIDsToUpdate = idsToUpdate;
        message.MapChange = mapChange;

        return message;
    }

    private static MapChange CreateMapChange(String countryId)
    {
        Land country = CountryMapper.GetCountryById(countryId);

        MapChange mapChange = new MapChange();
        mapChange.CountryID = countryId;
        mapChange.OwnedPlayer = PlayerMapper.Map(country.gib_besitzer());
        mapChange.Units = country.gib_anzahl_armeen();

        return mapChange;
    }

    public static EndTurnMessage CreateEndTurnMessage(List<Integer> idsToUpdate, Player nextPlayer) {
        EndTurnMessage message = new EndTurnMessage();

        message.NewActivePlayer = nextPlayer;
        message.PlayerIDsToUpdate = idsToUpdate;

        return message;
    }

    public static PlayerCreatedMessage CreatePlayerCreatedMessage(Player player) {
        PlayerCreatedMessage message = new PlayerCreatedMessage();
        message.NewPlayer = player;
        message.PlayerIDsToUpdate = Arrays.asList(player.ID);
        return message;
    }
}
