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

    public Land[] GETLands() {
        return _laender.toArray(new Land[_laender.size()-1]);
    }
}
