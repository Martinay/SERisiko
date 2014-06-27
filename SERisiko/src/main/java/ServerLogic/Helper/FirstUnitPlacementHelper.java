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
    private HashMap<Player, List<ClientMapChange>> finishedPlayers = new HashMap<>();

    public FirstUnitPlacementHelper(ServerGame game) {

        _game = game;
    }

    public void Collect(Player player, List<ClientMapChange> clientMapChanges) {
        finishedPlayers.put(player,clientMapChanges);
    }

    public boolean AllPlayerFinished() {
        return _game.Players.size() == finishedPlayers.size();
    }

    public void ApplyChangesToGame() {
        //TODO
    }

    public List<MapChange> GetAllChanges() {
        List<MapChange> result = new LinkedList<>();
        //for (List<ClientMapChange> mapChange : finishedPlayers.values())
            //result.addAll(mapChange);
        return null;//TODO
    }
}
