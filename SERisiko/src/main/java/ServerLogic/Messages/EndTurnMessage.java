package ServerLogic.Messages;

import java.util.HashMap;

public class EndTurnMessage extends MessageBase {
    public Player NewActivePlayer;

    @Override
    public <String, Object> HashMap getResponseData() {
        HashMap apiData = new HashMap<String, Object>();

        apiData.put("newActivePlayer", NewActivePlayer);

        return apiData;
    }
}
