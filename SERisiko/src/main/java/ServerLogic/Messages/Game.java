package ServerLogic.Messages;

import ServerApi.ApiResponseObject;
import java.util.HashMap;

public abstract class Game implements ApiResponseObject {
    public String Name;
    public int ID;
    public abstract int GetPlayerCount();
    
    
    public <String, Object> HashMap getResponseData() {

        HashMap apiData = new <String, Object>HashMap();
        
        apiData.put("id", ID);
        apiData.put("name", Name);
        apiData.put("player", this.GetPlayerCount() );
        
        return apiData;

    }
}
