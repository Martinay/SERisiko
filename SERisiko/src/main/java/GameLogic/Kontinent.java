package GameLogic;

import java.util.LinkedList;
import java.util.List;

public class Kontinent {

    private List<Land> _laender = new LinkedList<Land>();

    public void AddLand(Land land)
    {
        _laender.add(land);
        land.Kontinent = this;
    }
}
