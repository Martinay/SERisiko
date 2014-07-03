package ServerLogic.Messages;

import ServerLogic.Model.MapChange;

import java.util.List;

public class PlayerLeftGameMessage extends MessageBase {
    public ServerLogic.Model.Game Game;
    public ServerLogic.Model.Player Player;
    public List<MapChange> Map;
}
