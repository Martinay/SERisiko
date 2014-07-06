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

    public ServerLogic() {
        SetExampleData();
    }

    private void SetExampleData() {
        CreatePlayer(1,"Player1");
        CreatePlayer(2,"Player2");
        CreatePlayer(3,"Player3");
        CreatePlayer(4,"Player4");
        CreatePlayer(5,"Player5");

        Player player1 = _state.Players.get(0);
        Player player2 = _state.Players.get(1);
        Player player3 = _state.Players.get(2);
        Player player4 = _state.Players.get(3);
        Player player5 = _state.Players.get(4);

        CreateGame(player1.ID,"Game1", 6);
        Game game1 = _state.Lobby.GetGameByPlayerId(player1.ID);
        JoinGame(player2.ID,game1.ID);
        CreateGame(player3.ID,"Game2", 3);

        JoinLobby(player4.ID);
        JoinLobby(player5.ID);
    }

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

        for (ClientMapChange mapChange : clientMapChanges)
            game.PlaceUnits(mapChange.CountryId, mapChange.AddedUnits);

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
            return MessageCreator.CreateEndFirstUnitPlacementMessage(game.GetPlayerIds(),game.GetMap(), game, player);
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
            return MessageCreator.CreatePlayerLeftMessage(new LinkedList<Integer>(), null);

        List<Integer> idsToUpdate = _state.Lobby.GetPlayerIDs();

        if (player.PlayerStatus != PlayerStatus.InLobby && player.PlayerStatus != PlayerStatus.Undefined) {
            ServerGame game = _state.TryGetGameByPlayerId(playerID);
            if (game != null)
            {
                LeaveGame(playerID);
                idsToUpdate = game.GetPlayerIds();
            }
        }

        _state.Lobby.RemovePlayer(player);
        _state.Players.remove(player);
        PlayerMapper.Remove(player);
        idsToUpdate.remove(player);

        return MessageCreator.CreatePlayerLeftMessage(idsToUpdate, player);
    }

    @Override
    public NewPlayerJoinedGameMessage JoinGame(int playerID, int gameId) {
        Player player = _state.GetPlayer(playerID);

        if (player.PlayerStatus != PlayerStatus.InLobby)
        {
            Logger.Write("Spieler bereits in einem Spiel und nicht in der Lobby. PlayerId:" + playerID + "gameID: " + gameId);
            return MessageCreator.CreateNewPlayerJoinedGameMessage(Arrays.asList(playerID), player);
        }

        ServerGame game = _state.Lobby.TryGetGameById(gameId);

        if (game == null)
        {
            Logger.Write("Kein Spiel gefunden PlayerId:" + playerID + "gameID: " + gameId);
            return MessageCreator.CreateNewPlayerJoinedGameMessage(Arrays.asList(playerID), player);
        }

        if (game.MaxPlayer<=game.GetPlayerCount())
        {
            Logger.Write("Max Spieler erreicht PlayerId:" + playerID + "gameID: " + gameId);
            return MessageCreator.CreateNewPlayerJoinedGameMessage(Arrays.asList(playerID), player);
        }

        game.AddPlayer(player);
        _state.Lobby.RemovePlayer(player);

        return MessageCreator.CreateNewPlayerJoinedGameMessage(game.GetPlayerIds(), player);
    }

    @Override
    public PlayerLeftGameMessage LeaveGame(int playerID) {
        Player player = _state.GetPlayer(playerID);
        ServerGame game = _state.GetGameByPlayerId(playerID);

        game.RemovePlayer(player);

        if (game.CurrentGameStatus == GameStatus.Finished)
            _state.RemoveGame(game);

        List<MapChange> map = null;
        if ((game.CurrentGameStatus != GameStatus.Finished && game.CurrentGameStatus != GameStatus.WaitingForPlayer))
            map = game.GetMap();

        return MessageCreator.CreatePlayerLeftGameMessage(game.GetPlayerIds(), game, player, map);
    }

    @Override
    public GameCreatedMessage CreateGame(int playerID, String gameName, int maxPlayer) {
        Player player = _state.GetPlayer(playerID);
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
            Logger.Write("Player != Creator hat versucht das Spiel zu starten Name:" + game.Name+ "SpielerID: "+ playerID);
            return MessageCreator.CreateGameStartedMessage(Arrays.asList(playerID), game, null);
        }

        if (!game.AreAllPlayerReady())
        {
            Logger.Write("Creator hat versucht das Spiel zu starten, ohne das alle Spieler bereit sind. Name:" + game.Name);
            return MessageCreator.CreateGameStartedMessage(Arrays.asList(playerID), game, null);
        }

        _state.SetGameToActiveGame(game);

        game.Start();

        return MessageCreator.CreateGameStartedMessage(game.GetPlayerIds(), game, game.GetMap());
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
