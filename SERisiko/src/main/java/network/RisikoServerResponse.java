
package network;

/**
 *
 * @author Steve Kliebisch
 */
public class RisikoServerResponse implements WebSocketResponse {
    
    
    public RisikoServerResponse() {
        
    }
    
    public void setTargetClients(){
        
    }
    
    public void setTargetChannel() {
        
    }
    
    
    
    public String serialize() {
        return "Hello";
    }

    public void addError(String message) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void addData(Object data) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    
}
