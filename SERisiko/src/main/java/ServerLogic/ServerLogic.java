package ServerLogic;

import ServerLogic.Helper.GameCreator;
import ServerLogic.Helper.MessageCreator;
import ServerLogic.Helper.PlayerMapper;
import ServerLogic.Messages.*;
import ServerLogic.Messages.GameLogicInteraction.EndTurn;
import ServerLogic.Model.*;

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
        Integer[] dices = game.Attack(countryFromID, countryToID, units);

        if (dices.length == 0)
            return MessageCreator.CreateAttackMessage(game.GetPlayerIds(), countryFromID, countryToID, null, null);

        Integer[] diceAttacker = Arrays.asList(dices[0],dices[1],dices[2]).toArray(new Integer[3]);
        Integer[] diceDefender = Arrays.asList(dices[3],dices[4]).toArray(new Integer[2]);
        return MessageCreator.CreateAttackMessage(game.GetPlayerIds(), countryFromID, countryToID, diceAttacker, diceDefender);
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
        EndTurn response = game.EndTurn();

        return MessageCreator.CreateEndTurnMessage(game.GetPlayerIds(), response);
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
        _state.Lobby.DeletePlayer(player);
        _state.Players.remove(player);
        PlayerMapper.Remove(player);

        return MessageCreator.CreatePlayerLeftLobbyMessage(_state.Lobby.GetPlayerIDs(), player);
    }

    @Override
    public NewPlayerJoinedMessage JoinGame(int playerID, int gameId) {
        Player player = _state.GetPlayer(playerID);
        ServerGame game = _state.Lobby.GetGameById(gameId);

        if (game.MaxPlayer<=game.GetPlayerCount())
            return MessageCreator.CreateNewPlayerJoinedMessage(Arrays.asList(playerID));

        game.Players.add(player);

        return MessageCreator.CreateNewPlayerJoinedMessage(game.GetPlayerIds(), player);
    }

    @Override
    public PlayerLeftMessage LeaveGame(int playerID) {
        Player player = _state.GetPlayer(playerID);
        ServerGame game = _state.Lobby.GetGameByPlayerId(playerID);

        game.Players.remove(player);

        if (game.Players.size()== 0)
        {
            _state.Lobby.RemoveGame(game);
            return MessageCreator.CreatePlayerLeftMessage(_state.Lobby.GetPlayerIDs(),game);
        }

        if (game.Creator.ID == playerID)
        {
            _state.Lobby.RemoveGame(game);
            return MessageCreator.CreatePlayerLeftMessage(game.GetPlayerIds(),_state.Lobby.GetPlayerIDs(),game);
        }

        return MessageCreator.CreatePlayerLeftMessage(game.GetPlayerIds(), player);
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
            return MessageCreator.CreateGameStartedMessage(Arrays.asList(playerID));

        if (!game.AreAllPlayerReady())
            return MessageCreator.CreateGameStartedMessage(Arrays.asList(playerID));

        _state.Lobby.RemoveGame(game);
        _state.ActiveGames.add(game);
        game.Start();

        return MessageCreator.CreateGameStartedMessage(game.GetPlayerIds(), _state.Lobby.GetPlayerIDs(),game, game.GetCurrentPlayer(), game.GetNumberOfUnitsToPlace());
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
