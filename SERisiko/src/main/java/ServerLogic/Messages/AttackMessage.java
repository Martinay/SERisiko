package ServerLogic.Messages;

import ServerLogic.Model.Dice;

import java.util.List;

public class AttackMessage extends MapChangedMessage {

    public List<Dice> DiceAttacker;
    public List<Dice> DiceDefender;
}
