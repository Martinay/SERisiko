package ServerLogic.Messages;

import ServerLogic.Model.MapChange;

import java.util.List;

public class PlayerLeftMessage extends MessageBase{
    public ServerLogic.Model.Player Player;
    public List<MapChange> Map;
}
