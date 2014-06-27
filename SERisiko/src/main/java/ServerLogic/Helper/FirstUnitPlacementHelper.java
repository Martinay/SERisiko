package ServerLogic.Helper;

import ServerLogic.Model.ClientMapChange;
import ServerLogic.Model.Player;
import ServerLogic.Model.Server.ServerGame;

import java.util.HashMap;
import java.util.List;

/**
 * Created by m.ayasse on 26.06.2014.
 */
public class FirstUnitPlacementHelper {
    private ServerGame _game;
    private HashMap<Player, List<ClientMapChange>> finishedPlayers = new HashMap<>();

    public FirstUnitPlacementHelper(ServerGame game) {

        _game = game;
    }

    public void Collect(Player player, List<ClientMapChange> clientMapChanges) {
        finishedPlayers.put(player, clientMapChanges);
    }

    public boolean AllPlayerFinished() {
        return _game.Players.size() == finishedPlayers.size();
    }

    public void ApplyChangesToGame() {
        if (!AllPlayerFinished())
            return;

        while (finishedPlayers.size() != 0)
        {
            Player currentPlayer = _game.CurrentPlayer;
            ApplyChangesToGame(currentPlayer);
            finishedPlayers.remove(currentPlayer);
        }
    }

    private void ApplyChangesToGame(Player currentPlayer) {
        List<ClientMapChange> changes = finishedPlayers.get(currentPlayer);
        for(ClientMapChange change : changes)
        {
            if (_game.CurrentPlayer.ID != currentPlayer.ID)
                return;
            _game.PlaceUnits(change.CountryId,change.AddedUnits);
        }
    }
}