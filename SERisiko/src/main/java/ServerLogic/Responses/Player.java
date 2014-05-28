package ServerLogic.Responses;

public class Player {
    public int ID;
    public String Name;
    public boolean Ready;

    public Player(int playerID, String playerName) {
        ID = playerID;
        Name = playerName;
        Ready = false;
    }
}
