package ServerLogic;

import ServerLogic.Messages.Player;

class GameCreator {

    private static int _ID = 0;

    public static ServerGame Create(Player player, String gameName)
    {
        return new ServerGame(player,gameName, GetNextID());
    }

    private static int GetNextID()
    {
        return _ID++;
    }
}
