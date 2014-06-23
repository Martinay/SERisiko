package ServerLogic.Messages;

public class ReadyStateChangedMessage extends MessageBase {
    public ServerLogic.Model.Player Player;
    public boolean ReadyState; // add to PLayerObject (rdyStat)
}
