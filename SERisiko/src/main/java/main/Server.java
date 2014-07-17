package main;

import ServerApi.RisikoServer;
import org.webbitserver.WebServer;
import org.webbitserver.WebServers;
import org.webbitserver.WebbitException;
import org.webbitserver.handler.StaticFileHandler;

/**
 *
 */
public class Server 
{
    
    private final static int  HTTP_SERVER_PORT = 80;
    private final static int  WEBSOCKET_SERVER_PORT = 8080;
    
    public static void main( String[] args )
    {

        String docRoot = "web";
        System.out.println("set documentRoot: " + docRoot);
        
        
        try{
            WebServer webServer = WebServers.createWebServer(HTTP_SERVER_PORT)
                    .add(new StaticFileHandler( docRoot )); //add http response Service

            webServer.start();
            System.out.println("Webserver running at " + webServer.getUri());
        } catch(WebbitException ex) {
            //drop the exception
        }
        
         WebServer webSocketServer = WebServers.createWebServer(WEBSOCKET_SERVER_PORT)
                        .add("/websocket", new RisikoServer()); //add Risiko Api Service 
        webSocketServer.start();
        
        System.out.println("Websocketserver running at " + webSocketServer.getUri());
    }
}
