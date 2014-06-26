package ServerLogic;

import ServerLogic.Helper.GameCreator;
import ServerLogic.Helper.Logger;
import ServerLogic.Helper.MessageCreator;
import ServerLogic.Helper.PlayerMapper;
import ServerLogic.Messages.*;
import ServerLogic.Model.ClientMapChange;
import ServerLogic.Model.Game;
import ServerLogic.Model.Player;
import ServerLogic.Model.Server.ServerDice;
import ServerLogic.Model.Server.ServerGame;
import ServerLogic.Model.Server.ServerState;

import java.util.Arrays;
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

        return MessageCreator.CreateAttackMessage(game.GetPlayerIds(), countryFromID, countryToID, dices);
    }

    @Override
    public void EndAttack(int playerID) {
        ServerGame game = _state.GetActiveGameByPlayerId(playerID);
        game.EndAttack();
    }

    @Override
    public MapChangedMessage Move(int playerID, String countryFromID, String countryToID, int units) {
        ServerGame game = _state.GetActiveGameByPlayerId(playerID);
        game.Move(countryFromID, countryToID, units);

        return MessageCreator.CreateMapChangedMessage(game.GetPlayerIds(), countryFromID, countryToID);
    }

    @Override
    public MapChangedMessage PlaceUnits(int playerID, String countryID, int units) {
        ServerGame game = _state.GetActiveGameByPlayerId(playerID);
        game.PlaceUnits(countryID, units);

        return MessageCreator.CreateMapChangedMessage(game.GetPlayerIds(), countryID);
    }

    @Override
    public EndTurnMessage EndTurn(int playerID) {
        ServerGame game = _state.GetActiveGameByPlayerId(playerID);
        game.EndTurn();

        return MessageCreator.CreateEndTurnMessage(game.GetPlayerIds(), null);
    }

    @Override
    public EndFirstUnitPlacementMessage EndFirstUnitPlacement(int playerID, List<ClientMapChange> clientMapChanges) {
        return null; //TODO
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
    public PlayerLeftLobbyMessage LeaveLobby(int playerID) {

        Player player = _state.GetPlayer(playerID);
        _state.Lobby.RemovePlayer(player);
        _state.Players.remove(player);
        PlayerMapper.Remove(player);

        return MessageCreator.CreatePlayerLeftLobbyMessage(_state.Lobby.GetPlayerIDs(), player);
    }

    @Override
    public NewPlayerJoinedGameMessage JoinGame(int playerID, int gameId) {
        Player player = _state.GetPlayer(playerID);
        ServerGame game = _state.Lobby.GetGameById(gameId);

        if (game.MaxPlayer<=game.GetPlayerCount())
            return MessageCreator.CreateNewPlayerJoinedGameMessage(Arrays.asList(playerID), player);

        game.Players.add(player);

        return MessageCreator.CreateNewPlayerJoinedGameMessage(game.GetPlayerIds(), player);
    }

    @Override
    public PlayerLeftGameMessage LeaveGame(int playerID) {
        Player player = _state.GetPlayer(playerID);
        ServerGame game = _state.Lobby.GetGameByPlayerId(playerID);

        game.Players.remove(player);

        if (game.Players.size()== 0)
        {
            _state.Lobby.RemoveGame(game);
        }

        if (game.Creator.ID == playerID)
        {
            _state.Lobby.RemoveGame(game);
            game.Finish();
            return MessageCreator.CreatePlayerLeftGameMessage(game.GetPlayerIds(), game, player);
        }

        return MessageCreator.CreatePlayerLeftGameMessage(game.GetPlayerIds(), game, player);
    }

    @Override
    public GameCreatedMessage CreateGame(int playerID, String gameName, int maxPlayer) {
        Player player = _state.GetPlayer(playerID);
        ServerGame game = GameCreator.Create(player, gameName, maxPlayer);

        _state.Lobby.AddGame(game);

    return MessageCreator.CreateGameCreatedMessage(_state.Lobby.GetPlayerIDs(), game, player);
    }

    @Override
    public GameStartedMessage StartGame(int playerID) {
        ServerGame game = _state.Lobby.GetGameByPlayerId(playerID);

        if (playerID != game.Creator.ID)
        {
            Logger.Write("Player != Creator hat versucht das Spiel zu starten Name:" + game.Name);
            return MessageCreator.CreateGameStartedMessage(Arrays.asList(playerID), game);
        }

        if (!game.AreAllPlayerReady())
        {
            Logger.Write("Creator hat versucht das Spiel zu starten, ohne das alle Spieler bereit sind. Name:" + game.Name);
            return MessageCreator.CreateGameStartedMessage(Arrays.asList(playerID), game);
        }

        _state.Lobby.RemoveGame(game);
        _state.Lobby.RemovePlayer(game.Players);
        _state.ActiveGames.add(game);
        game.Start();

        return MessageCreator.CreateGameStartedMessage(game.GetPlayerIds(), game);
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
    public List<Player> GetPlayersInGame(int playerID) {
        return _state.Lobby.GetGameByPlayerId(playerID).Players;
    }

    @Override
    public List<Game> GetGamesInLobby() {
        return _state.Lobby.GetOpenGames();
    }
}
