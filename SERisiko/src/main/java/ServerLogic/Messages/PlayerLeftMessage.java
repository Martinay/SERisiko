package ServerLogic.Messages;

import java.util.HashMap;

public class PlayerLeftMessage extends MessageBase {
    public Player Player;
    public DeleteGameFromLobbyMessage DeleteGameFromLobbyMessage; //Is != null if game was empty and was deleted from Lobby

    @Override
    public <String, Object> HashMap getResponseData() {
        HashMap apiData = new HashMap<String, Object>();

        apiData.put("player", Player);
        apiData.put("deleteGameFromLobbyMessage", DeleteGameFromLobbyMessage);

        return apiData;
    }
}
