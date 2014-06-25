package ServerLogic.Messages;

import ServerLogic.Model.MapChange;
import java.util.List;

public class MapChangedMessage extends ServerLogic.Messages.MessageBase {

    public List<MapChange> MapChange;
}
