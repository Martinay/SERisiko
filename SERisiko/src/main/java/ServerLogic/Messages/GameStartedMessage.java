package ServerLogic.Messages;

import java.util.HashMap;

public class GameStartedMessage extends MessageBase{
    public boolean GameStarted; // if false only sender gets Message, that game wasn't started, if true PlayerIDsToUpdate are the Ids of the Players, which are in the Game

    public DeleteGameFromLobbyMessage DeleteGameFromLobbyMessage;

    @Override
    public <String, Object> HashMap getResponseData() {
        HashMap apiData = new HashMap<String, Object>();

        apiData.put("gameStarted", GameStarted);
        apiData.put("deleteGameFromLobbyMessage", DeleteGameFromLobbyMessage);

        return apiData;
    }
}
