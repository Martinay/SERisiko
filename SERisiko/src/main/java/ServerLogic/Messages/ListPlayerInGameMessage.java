package ServerLogic.Messages;

import ServerLogic.Model.Game;
import ServerLogic.Model.Player;
import java.util.List;

/**
 * Created by Martin on 7/6/2014.
 */
public class ListPlayerInGameMessage extends MessageBase {
    public Game Game;
    public List<Player> Players;
}
