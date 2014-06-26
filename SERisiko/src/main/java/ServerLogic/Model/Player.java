package ServerLogic.Model;

import ServerApi.ApiResponseObject;

import java.util.HashMap;

public class Player implements ApiResponseObject {
    public int ID;
    public String Name;
    public boolean Ready;
    public PlayerStatus PlayerStatus;

    public Player(int playerID, String playerName) {
        ID = playerID;
        Name = playerName;
        Ready = false;
        PlayerStatus = PlayerStatus.Undefined;
    }

    public <String, Object> HashMap getResponseData() {

        HashMap apiData = new HashMap<String, Object>();
        
        apiData.put("id", ID);
        apiData.put("name", Name);
        apiData.put("ready", Ready);
        apiData.put("playerStatus", PlayerStatus);

        return apiData;

    }
    
    
}
