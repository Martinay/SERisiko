package ServerLogic.Messages;

public class PlayerLeftMessage extends MessageBase {
    public ServerLogic.Model.Player Player;
    public DeleteGameFromLobbyMessage DeleteGameFromLobbyMessage; //Is != null if game was empty and was deleted from Lobby
}
