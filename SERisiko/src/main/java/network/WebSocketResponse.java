package network;

/**
 *
 * @author Steve Kliebisch
 */
public interface WebSocketResponse {
    
    
    public String serialize();
    
    public void addError(String message);
    
    public void addData(Object data);
    
}
