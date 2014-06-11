package ServerLogic.Helper;

import ServerLogic.Model.Player;
import ServerLogic.Model.ServerGame;

public class GameCreator {

    private static int _ID = 0;

    public static ServerGame Create(Player player, String gameName, int maxPlayer)
    {
        return new ServerGame(player, gameName, GetNextID(), maxPlayer);
    }

    private static int GetNextID()
    {
        return _ID++;
    }
}
