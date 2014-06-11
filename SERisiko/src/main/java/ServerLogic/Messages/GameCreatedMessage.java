package ServerLogic.Messages;

import ServerLogic.Model.Game;
import ServerLogic.Model.Player;

public class GameCreatedMessage extends MessageBase{
    public Game NewGame;
    public Player CreatedBy;
}
