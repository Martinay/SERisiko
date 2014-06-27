package ServerApi;

import Network.WebSocket.WebSocketHandler;
import Network.WebSocket.WebSocketResponse;
import ServerLogic.Messages.*;
import ServerLogic.Model.Game;
import ServerLogic.Model.MapChange;
import ServerLogic.Model.Player;
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
        
        PlayerCreatedMessage message = gameManager.CreatePlayer(clientId, username);

        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClient( clientId );
        response.addChangedObject(message.NewPlayer);
        
        return response;
    }  
    
    public WebSocketResponse leaveServer(GameClient gameClient) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
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
        
        
        PlayerLeftMessage message = gameManager.LeaveServer(clientId);
        
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
        
        NewPlayerJoinedGameMessage message = gameManager.JoinGame(clientId, gameId );
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        
        
        response.addChangedObject( message.Player );
                
        return response;
    }

    public WebSocketResponse leaveGame(GameClient gameClient) {
        System.out.println("leave game");
        
        int clientId = gameClient.getIdentifyer();

        PlayerLeftGameMessage message = gameManager.LeaveGame(clientId);
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        //response.addChangedObject( message.Player ); //TODO

        
        return response;
    }

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
    
    public WebSocketResponse startGame(GameClient gameClient) {
        System.out.println("Start Game");
        
        int clientId = gameClient.getIdentifyer();
        
        GameStartedMessage message = gameManager.StartGame(clientId);
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        // TODO response.addChangedObject( message.DeleteGameFromLobbyMessage.Game );
        
        
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
        //TODO
        /*Dice[] dice = message.DiceAttacker;
        for(int i = 0; i< dice.length ; i++) {
            response.addChangedObject( dice[i] );
        }
        
        Dice[] dice2 = message.DiceDefender;
        for(int i = 0; i< dice2.length; i++) {
            response.addChangedObject( dice2[i] );
        }*/
        
        return response; 
        
        
    }    
    
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

    public WebSocketResponse endTurn(GameClient gameClient) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    protected void connectionTerminated(GameClient gameClient) {
        
        int clientId = gameClient.getIdentifyer();
        
        this.gameManager.LeaveServer(clientId);
    }
    

}
