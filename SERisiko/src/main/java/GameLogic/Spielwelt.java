package GameLogic;

public class Spielwelt {

	private Land [] dieLaender;
        private Kontinent[] dieKontinente;
	
	protected Spielwelt(Kontinent[] kontinente){
		this.dieLaender=konvertKontinentToLandArray(kontinente);
                dieKontinente=kontinente;
	}
        
        
        private Land[] konvertKontinentToLandArray(Kontinent[] kontinente){
            
            Land[] laender= new Land[0];
                
            for (int i=0; i<kontinente.length; i++){
                
                Land[] newLaender = new Land[laender.length+kontinente[i].GETLands().length];
			
                    for (int j=0; j<laender.length; j++){
                        newLaender[j]=laender[j];
                    }
			
                    for (int j=0; j<kontinente[i].GETLands().length; j++){
			newLaender[j+laender.length]=kontinente[i].GETLands()[j];
                    }	
		laender=newLaender;
            }
            
            return laender;
            
        }
	
	
	public Land[] gibLaender(){
		return dieLaender;
	}
	
	public int gib_anz_Armeen_insgesamt(Spieler derSpieler){
		int anzahl = 0;
		
		for (int i=0; i<dieLaender.length; i++){
			if (dieLaender[i].gib_besitzer()==derSpieler) anzahl=anzahl+dieLaender[i].gib_anzahl_armeen();
		}
		
		return anzahl;
	}
	
	protected int gib_anz_Laender(Spieler derSpieler){
		int anzahl = 0;
		
		for (int i=0; i<dieLaender.length; i++){
			if (dieLaender[i].gib_besitzer()==derSpieler) anzahl++;
		}
		
		return anzahl;
	}
	
        protected int gib_anz_neue_Armeen(Spieler aktueller_Spieler){
            int anzahl = gib_anz_Armeen_insgesamt(aktueller_Spieler) / 2;
            
            for (int i=0; i<dieKontinente.length; i++){
                Spieler besitzer=aktueller_Spieler;
                for (int j=0; j<dieKontinente[i].GETLands().length; j++){
                    if (dieKontinente[i].GETLands()[j].gib_besitzer()!= aktueller_Spieler) besitzer = dieKontinente[i].GETLands()[j].gib_besitzer();
                }
                if (besitzer == aktueller_Spieler){
                    anzahl = anzahl + dieKontinente[i].GETAnzahlBonusArmeen();
                }
            }
            
            return anzahl;
        }
	
	protected boolean pruefe_Attacke(Land angreifer, Land verteidiger, Spieler aktuellerSpieler){
		if ((angreifer.gib_besitzer()==aktuellerSpieler) && (angreifer.gib_besitzer()!=verteidiger.gib_besitzer()) && (angreifer.gib_anzahl_armeen()>1)){
			
			return angreifer.ist_angrenzendes_Land(verteidiger);
						
		}
		else {return false;}
	}
	
	protected int gib_Anzahl_Angreifer(Land angreifer){
		return (angreifer.gib_anzahl_armeen()-1);		
	}
	
	protected int gib_Anzahl_verteidiger(Land verteidiger){
		return verteidiger.gib_anzahl_armeen();		
	}
	
	protected void fuehre_Angriff_durch(int angreifer_gestorben,int verteidiger_gestorben, Land angreifer, Land verteidiger){

		for (int i=0; i<angreifer_gestorben; i++) angreifer.decArmeen();
		
		int neue_anz_ver=verteidiger.gib_anzahl_armeen()-verteidiger_gestorben;
		for (int i=0; i<verteidiger_gestorben; i++) verteidiger.decArmeen(); 
		
		if (neue_anz_ver<=0){
			verteidiger.neuerBesitzer(angreifer.gib_besitzer());
			verteidiger.mehr_Armeen(Math.abs(neue_anz_ver)+1);
			for (int i=0; i<=Math.abs(neue_anz_ver); i++) angreifer.decArmeen();
		}
		
	}
	
	protected boolean pruefe_verschieben(Land Ausgang, Land Ziel, Spieler aktuellerSpieler){
		if ((Ausgang.gib_besitzer()==aktuellerSpieler) && (Ausgang.gib_besitzer()==Ziel.gib_besitzer()) && (Ausgang.gib_anzahl_armeen()>1)){
			
			return Ausgang.ist_angrenzendes_Land(Ziel);
						
		}
		else {return false;}
	}
	
	protected int max_anzahl_verschiebbare_Armeen(Land Frageland){
		return (Frageland.gib_anzahl_armeen()-1);		
	}
	
	protected void verschiebe_Armeen(Land Ausgang, Land Ziel, int anzahl_Armeen){
		for (int i=0; i<anzahl_Armeen; i++) Ausgang.decArmeen();
		Ziel.mehr_Armeen(anzahl_Armeen);
	}
	
	protected boolean pruefe_zusatz_Armeen (Land Zielland, Spieler aktueller_Spieler){
		if (Zielland.gib_besitzer()==aktueller_Spieler) return true;
		return false;
	}
	
	protected void fuege_Armeen_hinzu(Land Zielland, int anzahl_Armeen){
		Zielland.mehr_Armeen(anzahl_Armeen);		
	}
	
}
