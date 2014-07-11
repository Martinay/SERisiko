package ServerLogic.Helper;

import ServerLogic.Model.ClientMapChange;
import ServerLogic.Model.MapChange;
import ServerLogic.Model.Player;
import ServerLogic.Model.Server.ServerGame;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by m.ayasse on 26.06.2014.
 */
public class FirstUnitPlacementHelper {
    private ServerGame _game;
    private HashMap<Player, List<ClientMapChange>> _finishedPlayers = new HashMap<>();
    private List<ClientMapChange> _clientChanges = new LinkedList<>();

    public FirstUnitPlacementHelper(ServerGame game) {

        _game = game;
    }

    public void Collect(Player player, List<ClientMapChange> clientMapChanges) {
        _finishedPlayers.put(player, clientMapChanges);
        _clientChanges.addAll(clientMapChanges);
    }

    public boolean AllPlayerFinished() {
        return _game.Players.size() == _finishedPlayers.size();
    }

    public void ApplyChangesToGame() {
        if (!AllPlayerFinished())
            return;

        while (_finishedPlayers.size() != 0)
        {
            Player currentPlayer = _game.CurrentPlayer;
            ApplyChangesToGame(currentPlayer);
            _finishedPlayers.remove(currentPlayer);
        }
    }

    public List<MapChange> GetMapChanges() {

        return _game.GetMapChanges(_clientChanges);
    }

    private void ApplyChangesToGame(Player currentPlayer) {
        List<ClientMapChange> changes = _finishedPlayers.get(currentPlayer);
        _game.PlaceUnits(changes);
    }
}