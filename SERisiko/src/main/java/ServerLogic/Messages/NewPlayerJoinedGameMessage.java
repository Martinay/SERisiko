package ServerLogic.Messages;

import ServerLogic.Model.Game;
import ServerLogic.Model.Player;


public class NewPlayerJoinedGameMessage extends MessageBase{
    public Player Player;
    public Game Game;
}
