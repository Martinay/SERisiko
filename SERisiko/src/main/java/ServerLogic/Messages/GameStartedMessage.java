package ServerLogic.Messages;

import ServerLogic.Model.Player;

public class GameStartedMessage extends MessageBase{
    public boolean GameStarted; // if false only sender gets Message, that game wasn't started, if true PlayerIDsToUpdate are the Ids of the Players, which are in the Game

    public DeleteGameFromLobbyMessage DeleteGameFromLobbyMessage; // is quasi das gameObject
    public Player FirstPlayer; // add to gameObject (currentPLayer)
    public int NumberOfUnits; // add to playerObject (freeSupply)
}
