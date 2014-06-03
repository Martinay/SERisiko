package ServerLogic.Messages;

import java.util.HashMap;

public class DeleteGameFromLobbyMessage extends MessageBase {
    public Game Game;

    @Override
    public <String, Object> HashMap getResponseData() {
        HashMap apiData = new HashMap<String, Object>();

        apiData.put("game", Game);

        return apiData;
    }
}
