package ServerLogic.Messages;

public class GameStartedMessage extends MessageBase{
    public boolean GameStarted; // if false only sender gets Message, that game wasn't started, if true PlayerIDsToUpdate are the Ids of the Players, which are in the Game

    public DeleteGameFromLobbyMessage DeleteGameFromLobbyMessage;
}
