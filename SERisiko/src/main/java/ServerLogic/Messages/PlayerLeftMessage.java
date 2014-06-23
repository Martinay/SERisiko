package ServerLogic.Messages;

public class PlayerLeftMessage extends MessageBase {
    public ServerLogic.Model.Player Player;
    //das gameobject würde reichen, so kommt man aber auch ran über die message DeleteGameFromLobbyMessage.game
    public DeleteGameFromLobbyMessage DeleteGameFromLobbyMessage; //Is != null if game is empty and can be deleted from Lobby.
    public GameCreatorLeftGameMessage GameCreatorLeftGameMessage; //Is != null if player who created the game left. Game is deleted. DeleteGameFromLobbyMessage is also != null
}
