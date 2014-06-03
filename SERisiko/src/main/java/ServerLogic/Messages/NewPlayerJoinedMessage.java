package ServerLogic.Messages;

import java.util.HashMap;
import java.util.List;

public class NewPlayerJoinedMessage extends MessageBase{
    public List<Player> PlayersInGame;
    public boolean Successful;

    @Override
    public <String, Object> HashMap getResponseData() {
        HashMap apiData = new HashMap<String, Object>();

        apiData.put("playersInGame", PlayersInGame);
        apiData.put("successful", Successful);

        return apiData;
    }
}
