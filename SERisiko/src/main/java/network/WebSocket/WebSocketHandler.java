package Network.WebSocket;


import ServerApi.GameClient;
import ServerApi.RisikoServerResponse;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.webbitserver.BaseWebSocketHandler;
import org.webbitserver.WebSocketConnection;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.logging.Level;
import java.util.logging.Logger;


/**
 *
 * @author Steve Kliebisch
 */
public abstract class WebSocketHandler extends BaseWebSocketHandler {

    protected HashMap <Integer, GameClient>clientList = new HashMap<Integer, GameClient>();

    private final HashMap <String, Method>apiCmdList = new HashMap<String, Method>();
    
    public WebSocketHandler() {
        super();
        
        //initialize api
        this.initApi();
    }
    
    
    @Override
    public void onOpen(WebSocketConnection connection) {
        
        //initialize a new GameClient and put to clientList
        this.clientList.put(connection.hashCode(), new GameClient(connection) );

         System.out.println(connection.hashCode() + " connected");
        
    }

    @Override
    public void onClose(WebSocketConnection connection) {
        
        //remove GameClient from clientList
        GameClient gameClient = this.clientList.get(connection.hashCode());
        this.clientList.remove(connection.hashCode());
        connection.send("42");
        connection.close();
        System.out.println(connection.hashCode() + " disconnected");
        
        this.connectionTerminated(gameClient);
    }

    /**
     * Handle incoming Messages from Client and 
     * dispatch to implementet api method
     * 
     * @TODO remove throw .... handle exception inside methode and return error message to client and/or logfile
     * 
     * @param connection
     * @param message
     */
    @Override
    public void onMessage(WebSocketConnection connection, String message) {
        
        //get the current GameClient from the list with Connetced Clients
        GameClient currentClient = (GameClient)this.clientList.get(connection.hashCode());
        
        this.handleApiRequest(currentClient, message);
    }
    
    
    private void initApi() {

        Class classReflection = this.getClass();
        Method[] methods = classReflection.getMethods();
        for (Method m : methods) {
            String returnType = m.getReturnType().getName();

            if(returnType.endsWith("WebSocketResponse")) {
                this.apiCmdList.put(m.getName(), m); //add method to api list
            }
        }

    }
    
    private void handleApiRequest(GameClient currentClient, String requestData){
     

        try {
            JSONParser parser = new JSONParser();
            JSONObject obj = (JSONObject)parser.parse(requestData);
            
            String methodName = (String)obj.get("name");
            JSONArray arguments = (JSONArray)obj.get("args");

            //get API method
            Method m = this.apiCmdList.get(methodName);
            
            arguments.add(0, currentClient); //add GameClient to methodParams (at first position)
            for (Object argument : arguments) {
                System.out.println( argument.getClass().getName() );
            }
            
            //@TODO WRONG (specific object type) ..... NEW ..... !!!!!!!
            RisikoServerResponse ret = (RisikoServerResponse)m.invoke(this, arguments.toArray() );
            
            String response = ret.toJSON();
            
            LinkedList targetList = ret.getTargetClientList();
            
            for(int i = 0; i < targetList.size(); i++) {
                
                GameClient client = this.clientList.get( (Integer)targetList.get(i) );
                if(client != null) {
                    client.sendMessage(response); //send msg to client
                } else {
                    //send back playerHasDisconnected
                }
            }
            
        } catch (ParseException ex) {
            Logger.getLogger(WebSocketHandler.class.getName()).log(Level.SEVERE, null, ex);
        } catch (SecurityException ex) {
            Logger.getLogger(WebSocketHandler.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            Logger.getLogger(WebSocketHandler.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IllegalArgumentException ex) {
            Logger.getLogger(WebSocketHandler.class.getName()).log(Level.SEVERE, null, ex);
        } catch (InvocationTargetException ex) {
            Logger.getLogger(WebSocketHandler.class.getName()).log(Level.SEVERE, null, ex);
        } catch (UnsupportedOperationException ex) {
            Logger.getLogger(WebSocketHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    protected abstract void connectionTerminated(GameClient gameClient);
}
