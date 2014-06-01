package ServerLogic.Messages;

import ServerApi.ApiResponseObject;

import java.util.HashMap;

public abstract class Game implements ApiResponseObject {
    public String Name;
    public int ID;
    public int MaxPlayer;
    public abstract int GetPlayerCount();
    
    
    public <String, Object> HashMap getResponseData() {

        HashMap apiData = new HashMap<String, Object>();
        
        apiData.put("id", ID);
        apiData.put("name", Name);
        apiData.put("player", this.GetPlayerCount() );
        
        return apiData;

    }
}
