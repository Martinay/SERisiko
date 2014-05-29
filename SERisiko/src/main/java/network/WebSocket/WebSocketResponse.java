package Network.WebSocket;

import ServerApi.ApiResponseObject;

/**
 *
 * @author Steve Kliebisch
 */
public interface WebSocketResponse {
    
    
    public String toJSON();
    
    public WebSocketResponse addError(String message);
    
    public WebSocketResponse addChangedObject(ApiResponseObject data);
    
}
