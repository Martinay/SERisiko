package ServerLogic;

import GameLogic.Spieler;
import ServerLogic.Messages.Player;

import java.util.HashMap;

public class PlayerMapper {

    private static HashMap<Spieler,Player> _mappingSP = new HashMap<Spieler, Player>();
    private static HashMap<Player,Spieler> _mappingPS = new HashMap<Player, Spieler>();

    public static void Add(Spieler spieler, Player player){
        _mappingSP.put(spieler, player);
        _mappingPS.put(player,spieler);
    }

    public static void Remove(Player player){
        Spieler spieler = _mappingPS.get(player);
        _mappingSP.remove(spieler);
        _mappingPS.remove(player);
    }

    public static Player Map(Spieler player) {
        return _mappingSP.get(player);
    }
}
