package ServerLogic.Messages;

import ServerLogic.Model.Dice;

public class AttackMessage extends MapChangedMessage {

    public Dice[] DiceAttacker;
    public Dice[] DiceDefender;
}
