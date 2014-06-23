package ServerLogic.Model;

import ServerApi.ApiResponseObject;
import java.util.HashMap;

public class MapChange implements ApiResponseObject{
    public String CountryID;
    public int Units;
    public Player OwnedPlayer;   
    
    public <String, Object> HashMap getResponseData() {

        HashMap apiData = new HashMap();
        
        apiData.put("countryId", CountryID);
        apiData.put("unitCount", Units);
        apiData.put("owner", OwnedPlayer);

        return apiData;
    }    
}
