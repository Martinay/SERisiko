package ServerLogicTests;

import ServerLogic.Model.*;
import ServerLogic.ServerLogic;
import junit.framework.TestCase;
import net.hydromatic.linq4j.Linq4j;
import net.hydromatic.linq4j.function.Predicate1;

import java.util.LinkedList;
import java.util.List;

/**
 * Created by m.ayasse on 30.06.2014.
 */
public class ServerLogicTests extends TestCase {
    public void testWorkflow() throws Exception {

        //Arrange
        ServerLogic logic = new ServerLogic();

        //Act
        final Player player1 = logic.CreatePlayer(10, "Player1").NewPlayer;
        Player player2 = logic.CreatePlayer(11, "Player2").NewPlayer;

        //Assert
        assertEquals(player1.PlayerStatus, PlayerStatus.Undefined);
        assertEquals(player2.PlayerStatus, PlayerStatus.Undefined);
        assertEquals(player1.Ready, false);
        assertEquals(player2.Ready, false);

        //Act
        logic.JoinLobby(player1.ID);
        logic.JoinLobby(player2.ID);

        //Assert
        assertEquals(player1.PlayerStatus, PlayerStatus.InLobby);
        assertEquals(player2.PlayerStatus, PlayerStatus.InLobby);

        //Act
        Game game = logic.CreateGame(player1.ID, "Game1", 6).NewGame;
        logic.JoinGame(player2.ID, game.ID);

        //Assert
        assertEquals(player1.PlayerStatus, PlayerStatus.WaitingForGameStart);
        assertEquals(player2.PlayerStatus, PlayerStatus.WaitingForGameStart);
        assertEquals(game.CurrentGameStatus, GameStatus.WaitingForPlayer);

        //Act
        logic.ChangeReadyStatus(player1.ID, true);
        logic.ChangeReadyStatus(player2.ID, true);

        //Assert
        assertEquals(player1.PlayerStatus, PlayerStatus.WaitingForGameStart);
        assertEquals(player2.PlayerStatus, PlayerStatus.WaitingForGameStart);
        assertEquals(player1.Ready, true);
        assertEquals(player2.Ready, true);

        //Act
        List<MapChange> map = logic.StartGame(player1.ID).Map;

        //Assert
        assertEquals(player1.PlayerStatus, PlayerStatus.Playing);
        assertEquals(player2.PlayerStatus, PlayerStatus.Playing);
        assertEquals(game.CurrentGameStatus, GameStatus.FirstRoundPlacing);

        //Act
        Player finishedPlayer1 = logic.EndFirstUnitPlacement(player1.ID, getClientMapChanges(player1,game,map)).Player;

        //Assert
        assertEquals(player1.PlayerStatus, PlayerStatus.Playing);
        assertEquals(player2.PlayerStatus, PlayerStatus.Playing);
        assertEquals(game.CurrentGameStatus, GameStatus.FirstRoundPlacing);
        assertEquals(finishedPlayer1.ID,player1.ID);

        //Act
        Player finishedPlayer2 = logic.EndFirstUnitPlacement(player2.ID, getClientMapChanges(player2,game,map)).Player;

        //Assert
        assertEquals(player1.PlayerStatus, PlayerStatus.Playing);
        assertEquals(player2.PlayerStatus, PlayerStatus.Playing);
        assertEquals(game.CurrentGameStatus, GameStatus.PlacingUnits);
        assertEquals(finishedPlayer2.ID,player2.ID);

        //Act
        Player currentPlayerPlaceUnits1 = game.CurrentPlayer;
        String placeUnitsCurrentLand1ID = GetLandIdOfPlayer(currentPlayerPlaceUnits1, map);

        logic.PlaceUnits(currentPlayerPlaceUnits1.ID, placeUnitsCurrentLand1ID, game.NumberOfUnitsToPlace);

        //Assert
        assertEquals(player1.PlayerStatus, PlayerStatus.Playing);
        assertEquals(player2.PlayerStatus, PlayerStatus.Playing);
        assertEquals(game.CurrentGameStatus, GameStatus.Attack);

        //Act
        Player currentPlayerAttack1 = game.CurrentPlayer;
        String LandIdAttackCurrent1 = GetLandIdOfPlayer(currentPlayerAttack1,map);
        String LandIdAttackOpponent1 = GetLandIdOfPlayer(GetOpponentOf(currentPlayerAttack1, player1, player2), map);

        logic.Attack(currentPlayerAttack1.ID,LandIdAttackCurrent1,LandIdAttackOpponent1,game.NumberOfUnitsToPlace);

        //Assert
        assertEquals(currentPlayerAttack1.ID,currentPlayerPlaceUnits1.ID);
        assertEquals(player1.PlayerStatus, PlayerStatus.Playing);
        assertEquals(player2.PlayerStatus, PlayerStatus.Playing);
        assertEquals(game.CurrentGameStatus, GameStatus.Attack);

        //Act
        Player currentPlayerEndAttack1 = game.CurrentPlayer;
        logic.EndAttack(currentPlayerEndAttack1.ID);

        //Assert
        assertEquals(currentPlayerAttack1.ID,currentPlayerEndAttack1.ID);
        assertEquals(player1.PlayerStatus, PlayerStatus.Playing);
        assertEquals(player2.PlayerStatus, PlayerStatus.Playing);
        assertEquals(game.CurrentGameStatus, GameStatus.Move);

        //Act
        Player currentPlayerMove1 = game.CurrentPlayer;
        logic.EndTurn(currentPlayerMove1.ID);

        //Assert
        assertEquals(currentPlayerMove1.ID, currentPlayerEndAttack1.ID);
        assertEquals(player1.PlayerStatus, PlayerStatus.Playing);
        assertEquals(player2.PlayerStatus, PlayerStatus.Playing);
        assertEquals(game.CurrentGameStatus, GameStatus.PlacingUnits);
        assertEquals(game.CurrentPlayer.ID, GetOpponentOf(currentPlayerMove1,player1,player2).ID);


        //Act
        Player currentPlayerPlace2 = game.CurrentPlayer;
        logic.PlaceUnits(currentPlayerPlace2.ID,GetLandIdOfPlayer(currentPlayerPlace2,map),game.NumberOfUnitsToPlace);

        //Assert
        assertEquals(GetOpponentOf(currentPlayerMove1,player1,player2).ID, currentPlayerPlace2.ID);
        assertEquals(player1.PlayerStatus, PlayerStatus.Playing);
        assertEquals(player2.PlayerStatus, PlayerStatus.Playing);
        assertEquals(game.CurrentGameStatus, GameStatus.Attack);

        //Act
        Player currentPlayerAttack2 = game.CurrentPlayer;
        logic.EndTurn(currentPlayerAttack2.ID);

        //Assert
        assertEquals(currentPlayerAttack2.ID, currentPlayerPlace2.ID);
        assertEquals(player1.PlayerStatus, PlayerStatus.Playing);
        assertEquals(player2.PlayerStatus, PlayerStatus.Playing);
        assertEquals(game.CurrentGameStatus, GameStatus.PlacingUnits);
        assertEquals(game.CurrentPlayer.ID, GetOpponentOf(currentPlayerAttack2,player1,player2));


        // ...
    }

    private Player GetOpponentOf(Player player, Player ref1, Player ref2)
    {
        if (player.ID == ref1.ID)
            return ref2;

        return ref1;
    }

    private String GetLandIdOfPlayer(final Player player, List<MapChange> map) {
        return Linq4j.asEnumerable(map)
                .where(new Predicate1<MapChange>() {
                    @Override
                    public boolean apply(MapChange mapChange) {
                        return mapChange.OwnedByPlayerId.ID == player.ID;
                    }
                })
                .first()
                .CountryID;
    }

    private List<ClientMapChange> getClientMapChanges(final Player player, Game game, List<MapChange> map) {
        List<ClientMapChange> changes = new LinkedList<>();

        ClientMapChange mapChangePlayer1 = new ClientMapChange();
        mapChangePlayer1.AddedUnits = game.NumberOfUnitsToPlace;
        mapChangePlayer1.CountryId = Linq4j.asEnumerable(map)
                .where(new Predicate1<MapChange>() {
                    @Override
                    public boolean apply(MapChange mapChange) {
                        return mapChange.OwnedByPlayerId.ID == player.ID;
                    }
                })
                .first()
                .CountryID;

        changes.add(mapChangePlayer1);
        return changes;
    }
}
