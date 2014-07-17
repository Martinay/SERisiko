package ServerLogic;

import ServerLogic.Helper.*;
import ServerLogic.Messages.*;
import ServerLogic.Model.*;
import ServerLogic.Model.Server.ServerDice;
import ServerLogic.Model.Server.ServerGame;
import ServerLogic.Model.Server.ServerState;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

public class ServerLogic implements IServerLogic {

    private ServerState _state = new ServerState();

    @Override
    public AttackMessage Attack(int playerID, String countryFromID, String countryToID, int units) {
        ServerGame game = _state.GetActiveGameByPlayerId(playerID);
        ServerDice dices = game.Attack(countryFromID, countryToID, units);

        return MessageCreator.CreateAttackMessage(game.GetPlayerIds(), game.GetMapChange(countryFromID), game.GetMapChange(countryToID), dices, game);
    }

    @Override
    public EndAttackMessage EndAttack(int playerID) {
        ServerGame game = _state.GetActiveGameByPlayerId(playerID);
        game.EndAttack();

        return MessageCreator.CreateEndAttackMessage(game.GetPlayerIds(), game);
    }

    @Override
    public MapChangedMessage Move(int playerID, String countryFromID, String countryToID, int units) {
        ServerGame game = _state.GetActiveGameByPlayerId(playerID);
        game.Move(countryFromID, countryToID, units);

        return MessageCreator.CreateMapChangedMessage(game.GetPlayerIds(), game.GetMapChange(countryFromID), game.GetMapChange(countryToID), game);
    }

    @Override
    public EndUnitPlacementMessage PlaceUnits(int playerID, List<ClientMapChange> clientMapChanges) {
        ServerGame game = _state.GetActiveGameByPlayerId(playerID);
        game.PlaceUnits(clientMapChanges);

        return MessageCreator.CreateEndUnitPlacementMessage(game.GetPlayerIds(), game.GetMapChanges(clientMapChanges), game);
    }

    @Override
    public EndTurnMessage EndTurn(int playerID) {
        ServerGame game = _state.GetActiveGameByPlayerId(playerID);
        game.EndTurn();

        return MessageCreator.CreateEndTurnMessage(game.GetPlayerIds(), game);
    }

    @Override
    public EndFirstUnitPlacementMessage EndFirstUnitPlacement(int playerID, List<ClientMapChange> clientMapChanges) {


        ServerGame game = _state.GetActiveGameByPlayerId(playerID);
        Player player = _state.GetPlayer(playerID);

        FirstUnitPlacementHelper helper = game.FirstUnitPlacementHelper;
        helper.Collect(player, clientMapChanges);

        if (helper.AllPlayerFinished()) {
            helper.ApplyChangesToGame();
            return MessageCreator.CreateEndFirstUnitPlacementMessage(game.GetPlayerIds(),helper.GetMapChanges(), game, player);
        }
        return MessageCreator.CreateEndFirstUnitPlacementMessage(game.GetPlayerIds(), null, null, player);

    }

    @Override
    public PlayerCreatedMessage CreatePlayer(int playerID, String playerName) {
        Player player = new Player(playerID, playerName);
        _state.Players.add(player);
        return MessageCreator.CreatePlayerCreatedMessage(player);
    }

    @Override
    public AddNewPlayerToLobbyMessage JoinLobby(int playerID) {
        
        Player player = _state.GetPlayer(playerID);
        _state.Lobby.AddPlayer(player);
        
    return MessageCreator.CreateAddNewPlayerToLobbyMessage(_state.Lobby.GetPlayerIDs(), player);
    }

    @Override
    public PlayerLeftMessage LeaveServer(int playerID) {

        Player player = _state.TryGetPlayer(playerID);
        if (player == null)
            return MessageCreator.CreatePlayerLeftMessage(new LinkedList<>(), null, null);

        List<Integer> idsToUpdate = new LinkedList<>(_state.Lobby.GetPlayerIDs());
        List<MapChange> map = null;

        if (player.PlayerStatus != PlayerStatus.InLobby && player.PlayerStatus != PlayerStatus.Undefined) {
            ServerGame game = _state.TryGetGameByPlayerId(playerID);
            if (game != null)
            {
                PlayerLeftGameMessage message = LeaveGame(playerID);
                map = message.Map;
                idsToUpdate = new LinkedList<>(message.PlayerIDsToUpdate);
            }
        }

        _state.Lobby.RemovePlayer(player);
        _state.Players.remove(player);
        PlayerMapper.Remove(player);
        idsToUpdate.remove(player);

        return MessageCreator.CreatePlayerLeftMessage(idsToUpdate, player, map);
    }

    @Override
    public NewPlayerJoinedGameMessage JoinGame(int playerID, int gameId) {
        Player player = _state.GetPlayer(playerID);

        if (player.PlayerStatus != PlayerStatus.InLobby)
        {
            Logger.Write("Spieler bereits in einem Spiel und nicht in der Lobby. PlayerId:" + playerID + "gameID: " + gameId);
            return MessageCreator.CreateNewPlayerJoinedGameMessage(Arrays.asList(playerID), player, null);
        }

        ServerGame game = _state.Lobby.TryGetGameById(gameId);

        if (game == null)
        {
            Logger.Write("Kein Spiel gefunden PlayerId:" + playerID + "gameID: " + gameId);
            return MessageCreator.CreateNewPlayerJoinedGameMessage(Arrays.asList(playerID), player, null);
        }

        if (game.MaxPlayer<=game.GetPlayerCount())
        {
            Logger.Write("Max Spieler erreicht PlayerId:" + playerID + "gameID: " + gameId);
            return MessageCreator.CreateNewPlayerJoinedGameMessage(Arrays.asList(playerID), player, null);
        }

        game.AddPlayer(player);
        _state.Lobby.RemovePlayer(player);

        List<Integer> idsToUpdate = new LinkedList<>(game.GetPlayerIds());
        idsToUpdate.addAll(_state.Lobby.GetPlayerIDs());

        return MessageCreator.CreateNewPlayerJoinedGameMessage(idsToUpdate, player, game);
    }

    @Override
    public PlayerLeftGameMessage LeaveGame(int playerID) {
        Player player = _state.GetPlayer(playerID);
        ServerGame game = _state.TryGetGameByPlayerId(playerID);

        if (game == null)
            return MessageCreator.CreatePlayerLeftGameMessage(Arrays.asList(playerID),null,player,null);

        game.RemovePlayer(player);

        if (game.CurrentGameStatus == GameStatus.Finished)
            _state.RemoveGame(game);

        List<Integer> idsToUpdate = new LinkedList<>(game.GetPlayerIds());

        List<MapChange> map = null;
        if ((game.CurrentGameStatus != GameStatus.Finished && game.CurrentGameStatus != GameStatus.WaitingForPlayer))
            map = game.GetMap();

        if (game.CurrentGameStatus == GameStatus.WaitingForPlayer || (game.CurrentGameStatus == GameStatus.Finished && !game.HasStarted))
            idsToUpdate.addAll(_state.Lobby.GetPlayerIDs());

        return MessageCreator.CreatePlayerLeftGameMessage(idsToUpdate, game, player, map);
    }

    @Override
    public GameCreatedMessage CreateGame(int playerID, String gameName, int maxPlayer) {
        Player player = _state.GetPlayer(playerID);

        if (maxPlayer > 6)
        {
            Logger.Write("SpielerID:" + playerID + " zu hohe maxPlayer Anzahl : " + maxPlayer);
            return MessageCreator.CreateGameCreatedMessage(Arrays.asList(playerID), null, player);
        }


        if (_state.TryGetGameByPlayerId(playerID) != null)
        {
            Logger.Write("SpielerID:" + playerID + " ist bereits in einem Spiel");
            return MessageCreator.CreateGameCreatedMessage(Arrays.asList(playerID), null, player);
        }

        ServerGame game = GameCreator.Create(player, gameName, maxPlayer);

        _state.Lobby.RemovePlayer(player);
        _state.Lobby.AddGame(game);

        List<Integer> idsToUpdate = _state.Lobby.GetPlayerIDs();
        idsToUpdate.add(playerID);

    return MessageCreator.CreateGameCreatedMessage(idsToUpdate, game, player);
    }

    @Override
    public GameStartedMessage StartGame(int playerID) {
        ServerGame game = _state.Lobby.GetGameByPlayerId(playerID);

        if (playerID != game.Creator.ID)
        {
            Logger.Write("Player != Creator hat versucht das Spiel zu starten Name:" + game.Name+ "SpielerID: "+ playerID + ". Spiel nicht gestartet.");
            return MessageCreator.CreateGameStartedMessage(Arrays.asList(playerID), game, new LinkedList<>());
        }

        if (!game.AreAllPlayerReady())
        {
            Logger.Write("Creator hat versucht das Spiel zu starten, ohne das alle Spieler bereit sind. Spiel nicht gestartet.Name:" + game.Name);
            return MessageCreator.CreateGameStartedMessage(Arrays.asList(playerID), game, new LinkedList<>());
        }

        if (game.Players.size() == 1)
        {
            Logger.Write("Nur ein Spieler im Spiel. Spiel nicht gestartet. Name:" + game.Name);
            return MessageCreator.CreateGameStartedMessage(Arrays.asList(playerID), game, new LinkedList<>());
        }

        _state.SetGameToActiveGame(game);

        game.Start();

        List<Integer> idsToSend = new LinkedList<>(game.GetPlayerIds());
        idsToSend.addAll(_state.Lobby.GetPlayerIDs());

        return MessageCreator.CreateGameStartedMessage(idsToSend, game, game.GetMap());
    }

    @Override
    public ReadyStateChangedMessage ChangeReadyStatus(int playerID, boolean state) {
        Player player = _state.GetPlayer(playerID);
        player.Ready = state;

        return MessageCreator.CreateReadyStateChangedMessage(
                _state.Lobby.GetGameByPlayerId(playerID).GetPlayerIds(),
                player,
                state);
    }

    @Override
    public List<Player> GetPlayersInLobby() {
        return _state.Lobby.GetPlayer();
    }

    @Override
    public ListPlayerInGameMessage GetPlayersInGame(int playerID) {
        ServerGame game = _state.GetGameByPlayerId(playerID);
        return MessageCreator.CreateListPlayerInGameMessage(game.GetPlayerIds(), game.Players, game );
    }

    @Override
    public List<Game> GetGamesInLobby() {
        return _state.Lobby.GetOpenGames();
    }
}
