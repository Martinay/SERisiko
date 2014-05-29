package ServerApi;

import ServerLogic.Messages.AddNewPlayerToLobbyMessage;
import ServerLogic.ServerLogic;
import Network.WebSocket.GameClient;
import Network.WebSocket.WebSocketHandler;
import Network.WebSocket.WebSocketResponse;



/**
 * Serverside API Implementation for Risiko WebGame
 * 
 * @author Steve Kliebisch
 */
public class RisikoServer extends WebSocketHandler implements RisikoWebSocketApi {
    
    private final ServerLogic gameManager = new ServerLogic();
    
    public WebSocketResponse joinServer(GameClient gameClient, String username) {
        System.out.println("Join Server");

        int clientId = gameClient.getIdentifyer();
        
        gameManager.CreatePlayer(clientId, username);

        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage("");
        return this.joinLobby(gameClient);
    }    
    
    public WebSocketResponse joinLobby(GameClient gameClient) {
        System.out.println("Join Lobby");

        int clientId = gameClient.getIdentifyer();
        
        
        AddNewPlayerToLobbyMessage message = gameManager.JoinLobby(clientId);
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        response.addChangedObject( message.Player );
        
        return response;
    }

    public WebSocketResponse leaveLobby(GameClient gameClient) {
        System.out.println("Leave Lobby");
        
        
        
        RisikoServerResponse response = new RisikoServerResponse();
        
        
        
        return response;
    }

    public WebSocketResponse joinGame(GameClient gameClient, Long gameIndex) {
        System.out.println("Join Game: " + gameIndex);
        
        gameClient.sendMessage("TestMessage An client");
        
        
        RisikoServerResponse response = new RisikoServerResponse();
        
        
        
        return response;
    }

    public WebSocketResponse leaveGame(GameClient gameClient) {
        System.out.println("leave game");
        
        
        
        RisikoServerResponse response = new RisikoServerResponse();
        
        
        
        return response;
    }

    public WebSocketResponse createGame(GameClient gameClient, String gamename) {
        System.out.println("Create Game");
        
        
        
        RisikoServerResponse response = new RisikoServerResponse();
        
        
        
        return response;
    }

    public WebSocketResponse startGame(GameClient gameClient) {
        System.out.println("StartGame");
        
        
        
        RisikoServerResponse response = new RisikoServerResponse();
        
        
        
        return response;
    }

    public WebSocketResponse listOpenGames(GameClient gameClient) {
        System.out.println("List Games");
        
        
        
        RisikoServerResponse response = new RisikoServerResponse();
        
        
        
        return response;
    }

    public WebSocketResponse listPlayers(GameClient gameClient) {
        System.out.println("listPlayers");
        
        
        
        RisikoServerResponse response = new RisikoServerResponse();
        
        
        
        return response;
    }

    
    
    
    public WebSocketResponse attack(GameClient gameClient, Long source, Long target, Long value) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public WebSocketResponse move(GameClient gameClient, Long source, Long target, Long value) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public WebSocketResponse set(GameClient gameClient, Long target, Long value) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public WebSocketResponse endTurn(GameClient gameClient) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    

}