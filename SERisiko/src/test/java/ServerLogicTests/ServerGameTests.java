package ServerLogicTests;

import ServerLogic.Model.Player;
import ServerLogic.Model.Server.ServerGame;
import junit.framework.TestCase;

/**
 * Created by m.ayasse on 30.06.2014.
 */
public class ServerGameTests extends TestCase {
    public void testServerGameStart() throws Exception {

        //Arrange
        Player player1 = new Player(1,"player1");
        Player player2 = new Player(2,"player2");

        //Act
        ServerGame game = new ServerGame(player1,"game", 1, 2);
        game.AddPlayer(player2);
        game.Start();

        //Assert

    }
}
