package ServerLogic.Messages;

import java.util.HashMap;

public class AddNewPlayerToLobbyMessage extends MessageBase{
    public Player Player;

    @Override
    public <String, Object> HashMap getResponseData() {
        HashMap apiData = new HashMap<String, Object>();

        apiData.put("player", Player);

        return apiData;
    }
}
