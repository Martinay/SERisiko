package ServerLogic.Model;

import ServerApi.ApiResponseObject;

import java.util.HashMap;

public class ChatMessage implements ApiResponseObject {
    public String text;
    public int player;

    public <String, Object> HashMap getResponseData() {

        HashMap apiData = new HashMap<String, Object>();
        
        apiData.put("message", text);
        apiData.put("player", player);
        return apiData;

    }
}
