package ServerLogic;

import ServerLogic.Messages.Player;

import java.util.LinkedList;
import java.util.List;

public class Lobby {
    private List<Player> _players = new LinkedList<Player>();

    public void AddPlayer(Player player) {
        _players.add(player);
    }
}
