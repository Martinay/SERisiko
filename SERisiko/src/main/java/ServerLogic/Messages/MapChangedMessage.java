package ServerLogic.Messages;

import java.util.HashMap;
import java.util.List;

public class MapChangedMessage extends ServerLogic.Messages.MessageBase {

    public List<MapChange> MapChange;

    @Override
    public <String, Object> HashMap getResponseData() {
        HashMap apiData = new HashMap<String, Object>();

        apiData.put("mapChange", MapChange);

        return apiData;
    }
}
