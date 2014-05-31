
package ServerApi;

import Network.WebSocket.WebSocketResponse;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author Steve Kliebisch
 */
public class RisikoServerResponse implements WebSocketResponse {
    
    private final LinkedList <String>errorList = new LinkedList<String>();
    
    private final LinkedList <ApiResponseObject>objectList = new LinkedList<ApiResponseObject>();
    
    private final LinkedList <Integer>clientList = new LinkedList<Integer>();
    
    private int state = 0;

    private String msg;
    
    /** build&return json string
     * 
     * @return String serialized jsonObject
     */
    public String toJSON() {
        
        JSONObject response = new JSONObject();
        
        response.put("state", this.state);
        response.put("type", this.msg);
        response.put("error", this.errorList);
        
        JSONArray objects = new JSONArray();
        
        for( int i= 0; i < this.objectList.size(); i++) {
            objects.add( this.objectList.get(i).getResponseData() );
        }
        response.put("data", objects);
        
        return JSONValue.toJSONString(response);
    }

    public RisikoServerResponse addError(String message) {
        this.errorList.add(message);
        return this;
    }

    public RisikoServerResponse addChangedObject(ApiResponseObject data) {
        this.objectList.add(data);
        return this;
    }
    
    public RisikoServerResponse setState(int state) {
        this.state = state;
        return this;
    }
    
    public RisikoServerResponse addTargetClient(Integer clientId) {
        this.clientList.add(clientId);
        return this;
    }
    
    public LinkedList getTargetClientList() {
        return this.clientList;
    }
    
    public RisikoServerResponse addTargetClientList(List<Integer> list) {        
        this.clientList.addAll(list);
        return this;
    }
    
    public RisikoServerResponse setMessage(String msg){
        this.msg = msg;
        return this;
    }
    
}
