package ServerApi;

import Network.WebSocket.WebSocketResponse;
import org.json.simple.JSONObject;

/**
 *
 * @author Steve Kliebisch
 */
interface RisikoWebSocketApi {
   
    
    //lobby methods .....
    public WebSocketResponse joinServer(GameClient gameClient, String userName);
    public WebSocketResponse leaveServer(GameClient gameClient);
    public WebSocketResponse joinLobby(GameClient gameClient);
    public WebSocketResponse leaveLobby(GameClient gameClient);
    public WebSocketResponse joinGame(GameClient gameClient, Long gameIndex);
    public WebSocketResponse leaveGame(GameClient gameClient);
    public WebSocketResponse createGame(GameClient gameClient,String gamename, Long maxPlayer);
    public WebSocketResponse setPlayerState(GameClient gameClient, Boolean state);
    public WebSocketResponse startGame(GameClient gameClient);
    public WebSocketResponse listOpenGames(GameClient gameClient);
    public WebSocketResponse listPlayers(GameClient gameClient); 
    
    //game methods
    public WebSocketResponse attack(GameClient gameClient, String source, String target, Long value);   
    public WebSocketResponse move(GameClient gameClient, String source, String target, Long value);
    public WebSocketResponse set(GameClient gameClient, String target, Long value);
    public WebSocketResponse endTurn(GameClient gameClient);   
    public WebSocketResponse endAttack(GameClient gameClient); 
    public WebSocketResponse endFirstUnitPlacement(GameClient gameClient, JSONObject value);
    
}
