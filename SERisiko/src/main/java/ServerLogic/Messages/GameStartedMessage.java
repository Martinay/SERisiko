package ServerLogic.Messages;

import ServerLogic.Model.Game;
import ServerLogic.Model.MapChange;

import java.util.List;

public class GameStartedMessage extends MessageBase{

    public Game Game; // if false only sender gets Message, if true PlayerIDsToUpdate are the Ids of the Players, which are in the Game
    public List<MapChange> Map;
}
