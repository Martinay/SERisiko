package ServerLogic.Messages;

import ServerLogic.Model.Player;

import java.util.List;

/**
 * Created by Martin on 7/6/2014.
 */
public class ListPlayerInGameMessage extends MessageBase {
    public int CurrentPlayerID;
    public List<Player> Players;
}
