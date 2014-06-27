package ServerLogic.Model;

import ServerApi.ApiResponseObject;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

public abstract class Game implements ApiResponseObject {
    public String Name;
    public int ID;
    public int MaxPlayer;
    public Player CurrentPlayer;
    public int NumberOfUnitsToPlace;
    public GameStatus CurrentGameStatus;
    public List<Player> Players = new LinkedList<>();
    public abstract int GetPlayerCount();
    
    
    public <String, Object> HashMap getResponseData() {

        HashMap apiData = new HashMap<String, Object>();
        
        apiData.put("id", ID);
        apiData.put("name", Name);
        apiData.put("currentGameStatus", CurrentGameStatus.toString() );
        apiData.put("playerCount", this.GetPlayerCount() );
        apiData.put("maxPlayer", MaxPlayer );
        apiData.put("players", Players );
        apiData.put("currentPlayer", CurrentPlayer);
        apiData.put("numberOfUnitsToPlace", NumberOfUnitsToPlace);

        return apiData;

    }
}
