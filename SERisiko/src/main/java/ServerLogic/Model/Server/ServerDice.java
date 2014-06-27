package ServerLogic.Model.Server;

import ServerLogic.Model.Dice;

import java.util.List;

/**
 * Created by m.ayasse on 26.06.2014.
 */
public class ServerDice {
    public List<Dice> Attacker;
    public List<Dice> Defender;

    public boolean HasDice()
    {
        if (Attacker == null)
            return false;
        if (Defender == null)
            return false;

        return Attacker.size() != 0 && Defender.size() != 0;
    }
}
