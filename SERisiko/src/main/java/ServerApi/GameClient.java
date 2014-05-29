
package ServerApi;

import org.webbitserver.WebSocketConnection;

/**
 *
 * @author Steve Kliebisch
 */
public class GameClient {
    
    private final WebSocketConnection connection;

    
    public GameClient(WebSocketConnection connection) {
        this.connection = connection;
    }
    
    public WebSocketConnection getConnection() {
        return this.connection;
    }

    public void sendMessage(String message) {
        
        this.connection.send(message);
        
    }
    
    public int getIdentifyer() {
        return this.connection.hashCode();
    }
    
    
}
