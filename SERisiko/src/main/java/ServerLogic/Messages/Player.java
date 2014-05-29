package ServerLogic.Messages;

import java.util.HashMap;
import ServerApi.ApiResponseObject;

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

        HashMap apiData = new <String, Object>HashMap();
        
        apiData.put("id", ID);
        apiData.put("name", Name);
        apiData.put("redy", Ready);
        
        return apiData;

    }
    
    
}
