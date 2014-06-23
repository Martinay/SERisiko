package ServerLogic.Helper;

import ServerLogic.Model.MapChange;
import GameLogic.Land;
import ServerLogic.Messages.*;
import ServerLogic.Messages.GameLogicInteraction.EndTurn;
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

    public static GameStartedMessage CreateGameStartedMessage(List<Integer> playerIdsInGame, List<Integer> playerIdsInLobby, Game game, Player player, int numberOfUnits)
    {
        GameStartedMessage message = new GameStartedMessage();
        message.PlayerIDsToUpdate = playerIdsInGame;
        message.GameStarted = true;
        message.DeleteGameFromLobbyMessage = CreateDeleteGameFromLobbyMessage(playerIdsInLobby, game);
        message.FirstPlayer = player;
        message.NumberOfUnits = numberOfUnits;
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

    public static NewPlayerJoinedMessage CreateNewPlayerJoinedMessage(List<Integer> idsToUpdate, Player player) {
        NewPlayerJoinedMessage message = new NewPlayerJoinedMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.Successful = true;
        message.Player = player;
        return message;
    }

    //If Player who doesn't own the game leaves
    public static PlayerLeftMessage CreatePlayerLeftMessage(List<Integer> idsToUpdate, Player player) {
        PlayerLeftMessage message = new PlayerLeftMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.Player = player;
        return message;
    }

    //If no player is left in the game
    public static PlayerLeftMessage CreatePlayerLeftMessage(List<Integer> playerIdsInLobby, Game game) {
        PlayerLeftMessage message = new PlayerLeftMessage();
        message.DeleteGameFromLobbyMessage = CreateDeleteGameFromLobbyMessage(playerIdsInLobby, game);
        return message;
    }

    //If Player who created the game leaves
    public static PlayerLeftMessage CreatePlayerLeftMessage(List<Integer> idsToUpdate, List<Integer> playerIdsInLobby, Game game) {

        PlayerLeftMessage message = new PlayerLeftMessage();
        message.GameCreatorLeftGameMessage = CreateGameCreatorLeftGameMessage(idsToUpdate);
        message.DeleteGameFromLobbyMessage = CreateDeleteGameFromLobbyMessage(playerIdsInLobby,game);
        return message;
    }

    private static GameCreatorLeftGameMessage CreateGameCreatorLeftGameMessage(List<Integer> idsToUpdate) {
        GameCreatorLeftGameMessage message = new GameCreatorLeftGameMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
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

    public static EndTurnMessage CreateEndTurnMessage(List<Integer> idsToUpdate, EndTurn endTurn) {
        EndTurnMessage message = new EndTurnMessage();

        message.NewActivePlayer = endTurn.NextPlayer;
        message.EndGame = endTurn.EndGame;
        message.DefeatedPlayer = endTurn.DefeatedPlayer;
        message.UnitsToPlaceNextPlayer =endTurn.UnitsToPlaceNextPlayer;
        message.PlayerIDsToUpdate = idsToUpdate;

        return message;
    }

    public static PlayerCreatedMessage CreatePlayerCreatedMessage(Player player) {
        PlayerCreatedMessage message = new PlayerCreatedMessage();
        message.NewPlayer = player;
        message.PlayerIDsToUpdate = Arrays.asList(player.ID);
        return message;
    }

    public static AttackMessage CreateAttackMessage(List<Integer> idsToUpdate, String countryFromID, String countryToID, Integer[] diceAttacker, Integer[] diceDefender) {
        AttackMessage message = new AttackMessage();

        message.PlayerIDsToUpdate = idsToUpdate;
        message.MapChange = Arrays.asList(CreateMapChange(countryFromID));
        message.MapChange.add(CreateMapChange(countryToID));
        message.DiceAttacker = diceAttacker;
        message.DiceDefender = diceDefender;

        return message;
    }

}
