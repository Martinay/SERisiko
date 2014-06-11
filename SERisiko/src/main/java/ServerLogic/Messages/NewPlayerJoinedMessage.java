package ServerLogic.Messages;

import java.util.List;

public class NewPlayerJoinedMessage extends MessageBase{
    public List<Player> PlayersInGame;
    public boolean Successful;
}
