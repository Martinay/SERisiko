package main;

import ServerApi.RisikoServer;
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
        WebServer webServer = WebServers.createWebServer(80)
                .add("/websocket", new RisikoServer()) //add Risiko Api Service 
                .add(new StaticFileHandler("C:\\share\\risk\\JsRemotetest\\web")); //add http response Service
        webServer.start();
        System.out.println("Server running at " + webServer.getUri());
        
        System.out.print("Connected clients: 0");
    }
}
