package ServerApi;

import Network.WebSocket.WebSocketHandler;
import Network.WebSocket.WebSocketResponse;
import ServerLogic.Messages.*;
import ServerLogic.Model.*;
import ServerLogic.ServerLogic;
import org.json.simple.JSONObject;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map.Entry;

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
        System.out.println("leave Server");

        int clientId = gameClient.getIdentifyer();
        
        PlayerLeftMessage message = gameManager.LeaveServer(clientId);
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );

        List<MapChange> changedMaps = message.Map;
        if(changedMaps != null){
            for(int i = 0; i< changedMaps.size(); i++) {
                response.addChangedObject( changedMaps.get(i) );
            }
        }

        if(message.Player != null) { //check player (neccessary if player leave lobby before)
            response.addChangedObject(message.Player);
        }

        if (message.Game != null)
            response.addChangedObject( message.Game );

        return response;
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

        if (message.Game != null)
            response.addChangedObject(message.Game);
                
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
        response.addTargetClient(clientId);
        
        //order is important !!!  (*mapchanges followed by game)
       
        List<MapChange> changedMaps = message.Map;
        if(message.Map != null){
            for(int i = 0; i< changedMaps.size(); i++) {
                response.addChangedObject( changedMaps.get(i) );
            }
        }
        
        response.addChangedObject( message.Player );

        if (message.Game != null)
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
        
        //order is important !!!  (*mapchanges followed by game)
        List<MapChange> changedMaps = message.Map;
        for(int i = 0; i< changedMaps.size(); i++) {
            response.addChangedObject( changedMaps.get(i) );
        }
        
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
        
        //List<Player> message = gameManager.GetPlayersInGame(clientId);
        
        ListPlayerInGameMessage message = gameManager.GetPlayersInGame(clientId);
        
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( "PlayerList" );
        response.addTargetClient( clientId );
        
        for(int i = 0; i< message.Players.size(); i++) {
            response.addChangedObject( message.Players.get(i) );
        }
        
        response.addChangedObject(message.Game);
        
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
        
        response.addChangedObject( message.Game );
        
        return response; 
        
        
    }    
    
    @Override
    public  WebSocketResponse endAttack(GameClient gameClient) {
        System.out.println("List Players");
        
        int clientId = gameClient.getIdentifyer();
        
        EndAttackMessage message = gameManager.EndAttack(clientId);
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( "AttackEndedMessage" );
        
        response.addTargetClientList( message.PlayerIDsToUpdate );
        
        response.addChangedObject( message.Game );
        
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
        
        response.addChangedObject( message.Game );
        
        return response; 
    }

    @Override
    public WebSocketResponse set(GameClient gameClient, JSONObject value) {
        System.out.println("setUnits");
        
        int clientId = gameClient.getIdentifyer();
        List<ClientMapChange> clientMapChanges = new LinkedList();
        Iterator mapChanges = value.entrySet().iterator();
        
        
        while(mapChanges.hasNext()){
            Entry thisEntry = (Entry) mapChanges.next();
            ClientMapChange o = new ClientMapChange();
            o.CountryId = (String)thisEntry.getKey();
            
            Long temp = (Long)thisEntry.getValue();
            o.AddedUnits = temp.intValue() ;

            
            clientMapChanges.add(o);

        }
        MapChangedMessage message = gameManager.PlaceUnits(clientId, clientMapChanges );
        
        
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        
        List<MapChange> changedMaps = message.MapChange;
        for(int i = 0; i< changedMaps.size(); i++) {
            response.addChangedObject( changedMaps.get(i) );
        }
        
        response.addChangedObject( message.Game );
        
        return response;   

    }

    @Override
    public WebSocketResponse endTurn(GameClient gameClient) {
        System.out.println("end Round");
        
        int clientId = gameClient.getIdentifyer();
        
        EndTurnMessage message = gameManager.EndTurn(clientId);
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        response.addChangedObject( message.Game );
        
        
        return response; 
    }

   
    @Override
    public WebSocketResponse endFirstUnitPlacement(GameClient gameClient, JSONObject value) {
        System.out.println("end first unitplacement");
        
        int clientId = gameClient.getIdentifyer();
        
        List<ClientMapChange> clientMapChanges = new LinkedList();
        Iterator mapChanges = value.entrySet().iterator();
        
        while(mapChanges.hasNext()){
            Entry thisEntry = (Entry) mapChanges.next();
            
            ClientMapChange o = new ClientMapChange();
            o.CountryId = (String)thisEntry.getKey();
            
            Long temp = (Long)thisEntry.getValue();
            o.AddedUnits = temp.intValue() ;
            
            clientMapChanges.add(o);

        }
        
        EndFirstUnitPlacementMessage message = gameManager.EndFirstUnitPlacement(clientId, clientMapChanges);
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( message.getClass().getSimpleName() );
        response.addTargetClientList( message.PlayerIDsToUpdate );
        response.addChangedObject( message.Player );
        if(message.Game != null){
            response.addChangedObject(message.Game);
        }
        
        if(message.CurrentMap != null){
            List<MapChange> changedMaps = message.CurrentMap;
            for(int i = 0; i< changedMaps.size(); i++) {
                response.addChangedObject( changedMaps.get(i) );
            }
        }
        
        return response;  
    }
    

    public WebSocketResponse sendChatMessage(GameClient gameClient, String text) {
        System.out.println("chat message: " + text);
        
        
        int clientId = gameClient.getIdentifyer();
        
        ChatMessage responseObject = new ChatMessage();
        responseObject.text = text;        
        responseObject.player = clientId;
       
        ListPlayerInGameMessage message = gameManager.GetPlayersInGame(clientId);
        
        
        RisikoServerResponse response = new RisikoServerResponse();
        response.setState(1);
        response.setMessage( "ChatMessage" );
        response.addTargetClientList(message.PlayerIDsToUpdate );
        response.addChangedObject(responseObject);
        
        return response;
    }
    
    /**
     * not used for api
     * 
     * @param gameClient
     * @return 
     */
    @Override
    protected RisikoServerResponse connectionTerminated(GameClient gameClient) {
        
        //cast to RisikoServerResponse
        return (RisikoServerResponse)this.leaveServer(gameClient);
        
    }
}
