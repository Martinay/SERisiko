package main;

import ServerApi.RisikoServer;
import java.net.URL;
import org.webbitserver.WebServer;
import org.webbitserver.WebServers;
import org.webbitserver.handler.StaticFileHandler;

/**
 *
 */
public class Server 
{
    public static void main( String[] args )
    {
        URL serverLocation = Server.class.getProtectionDomain().getCodeSource().getLocation();

        //add devFix
        String docRoot = serverLocation.getPath() + "../../web";
        
        WebServer webServer = WebServers.createWebServer(80)
                .add("/websocket", new RisikoServer()) //add Risiko Api Service 
                .add(new StaticFileHandler( docRoot )); //add http response Service
        webServer.start();
        System.out.println("Server running at " + webServer.getUri());
        System.out.println("WebRoot: " + docRoot);
        System.out.print("Connected clients: 0");
    }
}
