package ServerLogic.Helper;

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

    public static GameStartedMessage CreateGameStartedMessage(List<Integer> playerIdsInGame, Game game, List<MapChange> map)
    {
        GameStartedMessage message = new GameStartedMessage();
        message.PlayerIDsToUpdate = playerIdsInGame;
        message.Game = game;
        message.Map = map;
        return message;
    }

    public static NewPlayerJoinedGameMessage CreateNewPlayerJoinedGameMessage(List<Integer> idsToUpdate, Player player) {
        NewPlayerJoinedGameMessage message = new NewPlayerJoinedGameMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.Player = player;
        return message;
    }

    public static PlayerLeftGameMessage CreatePlayerLeftGameMessage(List<Integer> idsToUpdate, Game game, Player player, List<MapChange> map) {
        PlayerLeftGameMessage message = new PlayerLeftGameMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.Game = game;
        message.Player = player;
        message.Map = map;
        return message;
    }

    public static GameCreatedMessage CreateGameCreatedMessage(List<Integer> idsToUpdate, Game game, Player createdBy) {
        GameCreatedMessage message = new GameCreatedMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.NewGame = game;
        message.CreatedBy = createdBy;
        return message;
    }

    public static PlayerLeftMessage CreatePlayerLeftMessage(List<Integer> idsToUpdate, Player player) {
        PlayerLeftMessage message = new PlayerLeftMessage();
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

    public static MapChangedMessage CreateMapChangedMessage(List<Integer> idsToUpdate, MapChange countryFrom, MapChange countryTo, Game game) {

        return CreateMapChangedMessage(idsToUpdate, Arrays.asList(countryFrom,countryTo), game);
    }

    public static MapChangedMessage CreateMapChangedMessage(List<Integer> idsToUpdate,  List<MapChange> countries, Game game) {
        MapChangedMessage message = new MapChangedMessage();


        message.PlayerIDsToUpdate = idsToUpdate;
        message.MapChange = countries;
        message.Game = game;

        return message;
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

    public static AttackMessage CreateAttackMessage(List<Integer> idsToUpdate, MapChange countryFromID, MapChange countryToID, ServerDice dice, Game game) {
        AttackMessage message = new AttackMessage();

        message.PlayerIDsToUpdate = idsToUpdate;
        message.MapChange.add(countryFromID);
        message.MapChange.add(countryToID);
        message.Game = game;

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

    public static EndAttackMessage CreateEndAttackMessage(List<Integer> idsToUpdate, Game game) {
        EndAttackMessage message = new EndAttackMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.Game = game;

        return message;
    }

    public static EndUnitPlacementMessage CreateEndUnitPlacementMessage(List<Integer> idsToUpdate, List<MapChange> mapChanges, Game game) {

        EndUnitPlacementMessage message = new EndUnitPlacementMessage();

        message.PlayerIDsToUpdate = idsToUpdate;
        message.MapChange = mapChanges;
        message.Game = game;

        return message;
    }

    public static ListPlayerInGameMessage CreateListPlayerInGameMessage(List<Integer> idsToUpdate, List<Player> players, Game game) {
        ListPlayerInGameMessage message = new ListPlayerInGameMessage();
        message.PlayerIDsToUpdate = idsToUpdate;
        message.Players = players;
        message.Game = game;
        return message;
    }
}
