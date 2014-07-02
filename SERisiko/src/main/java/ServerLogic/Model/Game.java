package ServerLogic.Model;

import ServerApi.ApiResponseObject;

import java.util.HashMap;

public abstract class Game implements ApiResponseObject {
    public String Name;
    public int ID;
    public int MaxPlayer;

    public int NumberOfUnitsToPlace;
    public GameStatus CurrentGameStatus;
    protected abstract int GetPlayerCount();
    public abstract int GetCurrentPlayerId();

    
    public <String, Object> HashMap getResponseData() {

        HashMap apiData = new HashMap<String, Object>();
        
        apiData.put("id", ID);
        apiData.put("name", Name);
        apiData.put("currentGameStatus", CurrentGameStatus.toString() );
        apiData.put("playerCount", this.GetPlayerCount() );
        apiData.put("maxPlayer", MaxPlayer );
        apiData.put("currentPlayerId", GetCurrentPlayerId());
        apiData.put("numberOfUnitsToPlace", NumberOfUnitsToPlace);

        return apiData;

    }
}
