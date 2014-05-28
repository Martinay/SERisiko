package network;

/**
 *
 * @author Steve Kliebisch
 */
public interface RisikoWebSocketResponseApi {
    
    
    public String serialize();
    
    public void addError(String message);
    
}
