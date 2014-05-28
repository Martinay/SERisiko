
package network;

import Game.Player;
import org.webbitserver.WebSocketConnection;

/**
 *
 * @author Steve Kliebisch
 */
public class GameClient {
    
    private final WebSocketConnection connection;

    private final Player player = new Player(); //change to Player Object
    
    
    
    public GameClient(WebSocketConnection connection) {
        this.connection = connection;
    }
    
    public WebSocketConnection getConnection() {
        return this.connection;
    }
    
    public Player getPlayer() {
        
        return this.player;
    }
    
    public void sendMessage(String message) {
        
        this.connection.send(message);
        
    }
    
    
}
