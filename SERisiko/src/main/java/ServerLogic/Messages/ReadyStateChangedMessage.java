package ServerLogic.Messages;

import java.util.HashMap;

public class ReadyStateChangedMessage extends MessageBase {
    public Player Player;
    public boolean ReadyState;

    @Override
    public <String, Object> HashMap getResponseData() {
        HashMap apiData = new HashMap<String, Object>();

        apiData.put("player", Player);
        apiData.put("readyState", ReadyState);

        return apiData;
    }
}
