package ServerApi;

import Network.WebSocket.WebSocketHandler;
import Network.WebSocket.WebSocketResponse;
import ServerLogic.Messages.*;
import ServerLogic.Model.Dice;
import ServerLogic.Model.Game;
import ServerLogic.Model.MapChange;
import ServerLogic.Model.Player;
import ServerLogic.ServerLogic;
import java.util.List;
import org.json.simple.JSONObject;


/**
 * Serverside API Implementation for Risiko WebGame
 * 
 * @author Steve Kliebisch
 */
public class RisikoServer extends WebSocketHandler implements RisikoWebSocketApi {
    
    private final ServerLogic gameManager = new ServerLogic();
    
    @Override
    public WebSocketResponse joinServer(GameClient gameClient, String username) {
        System.out.println("Join Server");

        int clientId = gameClient.getIdentifyer();
        
        PlayerCreatedMessage message = gameManager.CreatePlayer(clientId, username);

        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClient( clientId );
        response.addChangedObject(message.NewPlayer);
        
        return response;
    }  
    
    @Override
    public WebSocketResponse leaveServer(GameClient gameClient) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    } 

    @Override
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

    @Override
    public WebSocketResponse leaveLobby(GameClient gameClient) {
        System.out.println("Leave Lobby");
        
        int clientId = gameClient.getIdentifyer();
        
        
        PlayerLeftMessage message = gameManager.LeaveServer(clientId);
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        response.addChangedObject( message.Player );
        
        
        return response;
    }

    @Override
    public WebSocketResponse joinGame(GameClient gameClient, Long gameIndex) {
        System.out.println("Join Game: " + gameIndex);
                
        int clientId = gameClient.getIdentifyer();
        int gameId = gameIndex.intValue();
        
        NewPlayerJoinedGameMessage message = gameManager.JoinGame(clientId, gameId );
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        
        
        response.addChangedObject( message.Player );
                
        return response;
    }

    @Override
    public WebSocketResponse leaveGame(GameClient gameClient) {
        System.out.println("leave game");
        
        int clientId = gameClient.getIdentifyer();

        PlayerLeftGameMessage message = gameManager.LeaveGame(clientId);
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        response.addChangedObject( message.Game );

        
        return response;
    }

    @Override
    public WebSocketResponse createGame(GameClient gameClient, String gamename, Long maxPlayer) {
        System.out.println("Create Game: " + gamename + '(' +maxPlayer+ ')');
        
        int clientId = gameClient.getIdentifyer();
        
        GameCreatedMessage message = gameManager.CreateGame(clientId, gamename, maxPlayer.intValue() );
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        response.addChangedObject( message.NewGame );
        response.addChangedObject( message.CreatedBy );
        
        return response;
    }
    
    @Override
    public WebSocketResponse setPlayerState(GameClient gameClient, Boolean state) {
        System.out.println("set player state");
        
        int clientId = gameClient.getIdentifyer();
        
        ReadyStateChangedMessage message = gameManager.ChangeReadyStatus(clientId, state);
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        response.addChangedObject( message.Player );
        
        return response;
    }
    
    @Override
    public WebSocketResponse startGame(GameClient gameClient) {
        System.out.println("Start Game");
        
        int clientId = gameClient.getIdentifyer();
        
        GameStartedMessage message = gameManager.StartGame(clientId);
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        response.addChangedObject( message.Game );
        
        
        return response;
    }

    @Override
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

    @Override
    public WebSocketResponse listPlayers(GameClient gameClient) {
        System.out.println("List Players");
        
        int clientId = gameClient.getIdentifyer();
        
        List<Player> message = gameManager.GetPlayersInGame(clientId);
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( "PlayerList" );
        response.addTargetClient( clientId );
        
        for(int i = 0; i< message.size(); i++) {
            response.addChangedObject( message.get(i) );
        }
        
        return response;
    }

    
    
    //game
    @Override
    public WebSocketResponse attack(GameClient gameClient, String source, String target, Long value) {
        System.out.println("attack");
        
        int clientId = gameClient.getIdentifyer();
        
        AttackMessage message = gameManager.Attack(clientId, source, target, value.intValue());
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        
        //changed countrys
        List<MapChange> changedMaps = message.MapChange;
        for(int i = 0; i< changedMaps.size(); i++) {
            response.addChangedObject( changedMaps.get(i) );
        }
        
        //dice
        List<Dice> dice = message.DiceAttacker;
        for(int i = 0; i< dice.size() ; i++) {
            response.addChangedObject( dice.get(i) );
        }
        
        List<Dice> dice2 = message.DiceDefender;
        for(int i = 0; i< dice2.size(); i++) {
            response.addChangedObject( dice2.get(i) );
        }
        
        return response; 
        
        
    }    
    
    @Override
    public  WebSocketResponse endAttack(GameClient gameClient) {
        System.out.println("List Players");
        
        int clientId = gameClient.getIdentifyer();
        
        gameManager.EndAttack(clientId);
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( "AttackEndedMessage" );
        response.addTargetClient( clientId );
        
        return response;    
    }
   

    @Override
    public WebSocketResponse move(GameClient gameClient, String source, String target, Long value) {
        System.out.println("move Units");
        
        int clientId = gameClient.getIdentifyer();
        
        MapChangedMessage message = gameManager.Move(clientId, source, target, value.intValue());
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        
        List<MapChange> changedMaps = message.MapChange;
        for(int i = 0; i< changedMaps.size(); i++) {
            response.addChangedObject( changedMaps.get(i) );
        }
        
        return response; 
    }

    @Override
    public WebSocketResponse set(GameClient gameClient, String target, Long value) {
        System.out.println("setUnits");
        
        int clientId = gameClient.getIdentifyer();
        
        MapChangedMessage message = gameManager.PlaceUnits(clientId, target, value.intValue() );
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        
        List<MapChange> changedMaps = message.MapChange;
        for(int i = 0; i< changedMaps.size(); i++) {
            response.addChangedObject( changedMaps.get(i) );
        }
        
        return response;   

    }

    @Override
    public WebSocketResponse endTurn(GameClient gameClient) {
        System.out.println("end first unitplacement");
        
        int clientId = gameClient.getIdentifyer();
        
        EndTurnMessage message = gameManager.EndTurn(clientId);
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addChangedObject( message.Game );
        
        
        return response; 
    }

    @Override
    protected void connectionTerminated(GameClient gameClient) {
        
        int clientId = gameClient.getIdentifyer();
        
        this.gameManager.LeaveServer(clientId);
    }

    @Override
    public WebSocketResponse endFirstUnitPlacement(GameClient gameClient, JSONObject value) {
        System.out.println("end first unitplacement");
        
        int clientId = gameClient.getIdentifyer();
        
        EndFirstUnitPlacementMessage message = gameManager.EndFirstUnitPlacement(clientId, null);
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );

        
        
        return response;  
    }
    

}
