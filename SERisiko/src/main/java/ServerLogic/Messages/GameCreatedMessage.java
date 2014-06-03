package ServerLogic.Messages;

import java.util.HashMap;

public class GameCreatedMessage extends MessageBase{
    public Game NewGame;

    @Override
    public <String, Object> HashMap getResponseData() {
        HashMap apiData = new HashMap<String, Object>();

        apiData.put("newGame", NewGame);

        return apiData;
    }
}
