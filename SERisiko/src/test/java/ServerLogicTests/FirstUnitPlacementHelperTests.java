package ServerLogicTests;

import ServerLogic.Helper.FirstUnitPlacementHelper;
import ServerLogic.Model.ClientMapChange;
import ServerLogic.Model.Game;
import ServerLogic.Model.MapChange;
import ServerLogic.Model.Player;
import ServerLogic.Model.Server.ServerGame;
import junit.framework.TestCase;
import net.hydromatic.linq4j.Linq4j;
import net.hydromatic.linq4j.function.Predicate1;

import java.util.LinkedList;
import java.util.List;

/**
 * Created by m.ayasse on 30.06.2014.
 */
public class FirstUnitPlacementHelperTests extends TestCase {
    public void testWorkflow() throws Exception {

        //Arrange
        Player player1 = new Player(1,"player1");
        Player player2 = new Player(2,"player2");

        ServerGame game = new ServerGame(player1,"game", 1, 2);
        game.AddPlayer(player2);
        game.Start();

        FirstUnitPlacementHelper helper = game.FirstUnitPlacementHelper;

        //Assert
        assertEquals(helper.AllPlayerFinished(), false);

        //Act
        helper.Collect(player1, getClientMapChanges(player1,game,game.GetMap()));

        //Assert
        assertEquals(helper.AllPlayerFinished(), false);

        //Act
        helper.Collect(player2, getClientMapChanges(player2, game, game.GetMap()));

        //Assert
        assertEquals(helper.AllPlayerFinished(), true);

        //Act
        helper.ApplyChangesToGame();

        //Assert
        assertEquals(helper.AllPlayerFinished(), true);

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
