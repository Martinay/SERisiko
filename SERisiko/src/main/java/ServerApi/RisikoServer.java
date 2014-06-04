package ServerApi;

import Network.WebSocket.WebSocketHandler;
import Network.WebSocket.WebSocketResponse;
import ServerLogic.Messages.*;
import ServerLogic.ServerLogic;

import java.util.List;



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
        
        int clientId = gameClient.getIdentifyer();
        
        
        PlayerLeftLobbyMessage message = gameManager.LeaveLobby(clientId);
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        response.addChangedObject( message.Player );
        
        
        return response;
    }

    public WebSocketResponse joinGame(GameClient gameClient, Long gameIndex) {
        System.out.println("Join Game: " + gameIndex);
                
        int clientId = gameClient.getIdentifyer();
        int gameId = gameIndex.intValue();
        
        NewPlayerJoinedMessage message = gameManager.JoinGame(clientId, gameId );
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        
        for(int i = 0; i< message.PlayersInGame.size(); i++) {
            response.addChangedObject( message.PlayersInGame.get(i) );
        }        
        
        return response;
    }

    public WebSocketResponse leaveGame(GameClient gameClient) {
        System.out.println("leave game");
        
        int clientId = gameClient.getIdentifyer();

        PlayerLeftMessage message = gameManager.LeaveGame(clientId);
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        response.addChangedObject( message.Player );

        
        return response;
    }

    public WebSocketResponse createGame(GameClient gameClient, String gamename, Long maxPlayer) {
        System.out.println("Create Game");
        
        int clientId = gameClient.getIdentifyer();
        
        GameCreatedMessage message = gameManager.CreateGame(clientId, gamename, maxPlayer.intValue() );
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        response.addChangedObject( message.NewGame );
        
        
        return response;
    }

    public WebSocketResponse startGame(GameClient gameClient) {
        System.out.println("Create Game");
        
        int clientId = gameClient.getIdentifyer();
        
        GameStartedMessage message = gameManager.StartGame(clientId);
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        response.addChangedObject( message.DeleteGameFromLobbyMessage.Game );
        
        
        return response;
    }

    public WebSocketResponse listOpenGames(GameClient gameClient) {
        System.out.println("List Games");
        
        int clientId = gameClient.getIdentifyer();
        
        List<Game> message = gameManager.GetGamesInLobby();
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( "GameList" );
        response.addTargetClient( clientId );
        
        for(int i = 0; i< message.size(); i++) {
            response.addChangedObject( message.get(i) );
        }
        
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