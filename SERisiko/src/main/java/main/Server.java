package main;

import ServerApi.RisikoServer;
import org.webbitserver.WebServer;
import org.webbitserver.WebServers;
import org.webbitserver.handler.StaticFileHandler;

import java.net.URL;

/**
 *
 */
public class Server 
{
    
    private final static int  HTTP_SERVER_PORT = 12345;
    private final static int  WEBSOCKET_SERVER_PORT = 8080;
    
    public static void main( String[] args )
    {
        URL serverLocation = Server.class.getProtectionDomain().getCodeSource().getLocation();

        //String docRoot = "web";
        String docRoot = "C:\\Users\\M.Ayasse.VESCON\\IdeaProjects\\SERisiko\\SERisiko\\web";
        System.out.println("set documentRoot: " + docRoot);
        
        WebServer webServer = WebServers.createWebServer(HTTP_SERVER_PORT)
                .add(new StaticFileHandler( docRoot )); //add http response Service
        
        webServer.start();
        System.out.println("Webserver running at " + webServer.getUri());
        
        
         WebServer webSocketServer = WebServers.createWebServer(WEBSOCKET_SERVER_PORT)
                        .add("/websocket", new RisikoServer()); //add Risiko Api Service 
        webSocketServer.start();
        
        System.out.println("Websocketserver running at " + webSocketServer.getUri());
    }
}
