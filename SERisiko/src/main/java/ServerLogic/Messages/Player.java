package ServerLogic.Messages;

import ServerApi.ApiResponseObject;

import java.util.HashMap;

public class Player implements ApiResponseObject {
    public int ID;
    public String Name;
    public boolean Ready;

    public Player(int playerID, String playerName) {
        ID = playerID;
        Name = playerName;
        Ready = false;
    }

    public <String, Object> HashMap getResponseData() {

        HashMap apiData = new HashMap<String, Object>();
        
        apiData.put("id", ID);
        apiData.put("name", Name);
        apiData.put("ready", Ready);
        
        return apiData;

    }
    
    
}
