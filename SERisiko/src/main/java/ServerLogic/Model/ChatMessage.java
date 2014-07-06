package ServerLogic.Model;

import ServerApi.ApiResponseObject;

import java.util.HashMap;

public class ChatMessage implements ApiResponseObject {
    public String text;

    public <String, Object> HashMap getResponseData() {

        HashMap apiData = new HashMap<String, Object>();
        
        apiData.put("message", text);

        return apiData;

    }
}
