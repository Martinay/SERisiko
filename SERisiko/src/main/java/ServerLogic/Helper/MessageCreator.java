package ServerLogic.Helper;

import GameLogic.Land;
import ServerLogic.Messages.*;
import ServerLogic.Model.Game;
import ServerLogic.Model.MapChange;
import ServerLogic.Model.Player;
import ServerLogic.Model.Server.ServerDice;

import java.util.Arrays;
import java.util.List;

public class MessageCreator {
    public static ReadyStateChangedMessage CreateReadyStateChangedMessage(List<Integer> idsToUpdate, Player player, boolean readyState)
    {
        ReadyStateChangedMessage message = new ReadyStateChangedMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.Player = player;
        return message;
    }

    public static GameStartedMessage CreateGameStartedMessage(List<Integer> playerIdsInGame, Game game)
    {
        // TODO Karte am Anfang mitschicken
        GameStartedMessage message = new GameStartedMessage();
        message.PlayerIDsToUpdate = playerIdsInGame;
        message.Game = game;
        return message;
    }

    public static NewPlayerJoinedGameMessage CreateNewPlayerJoinedGameMessage(List<Integer> idsToUpdate, Player player) {
        NewPlayerJoinedGameMessage message = new NewPlayerJoinedGameMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.Player = player;
        return message;
    }

    public static PlayerLeftGameMessage CreatePlayerLeftGameMessage(List<Integer> idsToUpdate, Game game, Player player) {
        PlayerLeftGameMessage message = new PlayerLeftGameMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.Game = game;
        message.Player = player;
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

    public static EndTurnMessage CreateEndTurnMessage(List<Integer> idsToUpdate, Game game) {
        EndTurnMessage message = new EndTurnMessage();
        message.Game = game;
        message.PlayerIDsToUpdate = idsToUpdate;

        return message;
    }

    public static PlayerCreatedMessage CreatePlayerCreatedMessage(Player player) {
        PlayerCreatedMessage message = new PlayerCreatedMessage();
        message.NewPlayer = player;
        message.PlayerIDsToUpdate = Arrays.asList(player.ID);
        return message;
    }

    public static AttackMessage CreateAttackMessage(List<Integer> idsToUpdate, String countryFromID, String countryToID, ServerDice dice) {
        AttackMessage message = new AttackMessage();

        message.PlayerIDsToUpdate = idsToUpdate;
        message.MapChange = Arrays.asList(CreateMapChange(countryFromID));
        message.MapChange.add(CreateMapChange(countryToID));

        if (dice.HasDice()) {
            message.DiceAttacker = dice.Attacker;
            message.DiceDefender = dice.Defender;
        }

        return message;
    }

    public static EndFirstUnitPlacementMessage CreateEndFirstUnitPlacementMessage(List<Integer> idsToUpdate, List<MapChange> currentMap, Game game, Player player)
    {
        EndFirstUnitPlacementMessage message = new EndFirstUnitPlacementMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.CurrentMap = currentMap;
        message.Game = game;
        message.Player = player;

        return message;
    }

}
