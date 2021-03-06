package GameLogic;

import java.util.LinkedList;
import java.util.List;
import java.util.Collections;

public class Kontinent {

    private List<Land> _laender = new LinkedList<Land>();
    private int anzahl_bonus_Armeen;
    
    public Kontinent(int anzahl_bonus_Armeen){
        this.anzahl_bonus_Armeen=anzahl_bonus_Armeen;
    }
    
    public void AddLand(Land land)
    {
        _laender.add(land);
        land.Kontinent = this;
    }
    
    public Land[] GETLands(){
    	return  _laender.toArray(new Land[_laender.size()]);
    }
    
    public Land[] GetLandsShuffeld(){
        
        List<Land> shuffeldLands = new LinkedList<Land>(_laender);
        Collections.shuffle(shuffeldLands);
        
        return shuffeldLands.toArray(new Land[_laender.size()]);
    }
    
    public int GETAnzahlBonusArmeen(){
    	return  this.anzahl_bonus_Armeen;
    }
}
