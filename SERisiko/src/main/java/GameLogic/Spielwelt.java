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
	
	public void verteile_neu_ohne(Spieler zuentfernenderspieler, Spieler[] andereSpieler){
		/*
                sag mal codest du mit dem editor??
                wie gesagt , ja - und ich finde fuer Editor programmieren hab ich relativ wenig falsch gemacht.
                und vlt. pfuscht du in zukunft nicht so rum, dass du die Logik zerhaust.
                */
            
                int pos=0;
		for (int i=0; i<dieLaender.length; i++){
			if (dieLaender[i].gib_besitzer()==zuentfernenderspieler){
				dieLaender[i].neuerBesitzer(andereSpieler[pos]);
				pos++;
                                
                                      
				while(dieLaender[i].decArmeen()); // ist so richtig - versau nicht wieder den code
                                dieLaender[i].mehr_Armeen(1);
			}
			if (pos>=andereSpieler.length) pos=0;
		}
	}
	
	protected int gib_anz_Laender(Spieler derSpieler){
		int anzahl = 0;
		
		for (int i=0; i<dieLaender.length; i++){
			if (dieLaender[i].gib_besitzer()==derSpieler) anzahl++;
		}
		
		return anzahl;
	}
	
        protected int gib_anz_neue_Armeen(Spieler aktueller_Spieler){
            int anzahl = 0;
            int Laenderanzahl = gib_anz_Armeen_insgesamt(aktueller_Spieler);
            if (Laenderanzahl>0)  anzahl = anzahl+3;
	    if (Laenderanzahl>7) anzahl = anzahl+1;
	    if (Laenderanzahl>14) anzahl = anzahl+1;
	    if (Laenderanzahl>22) anzahl = anzahl+1;
	    if (Laenderanzahl>29) anzahl = anzahl+1;
	    if (Laenderanzahl>37) anzahl = anzahl+2;
            
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
		if (!(angreifer.gib_besitzer()==aktuellerSpieler))          throw new IllegalArgumentException("Not the own country!");
                if (angreifer.gib_besitzer()==verteidiger.gib_besitzer())   throw new IllegalArgumentException("Player attack himself");
                if (!(angreifer.gib_anzahl_armeen()>1))                     throw new IllegalArgumentException("not enougth armis");
			
		if (!(angreifer.ist_angrenzendes_Land(verteidiger)))        throw new IllegalArgumentException("att country is not next to dev country");
						
		return true;
	}
	
	protected int gib_Anzahl_Angreifer(Land angreifer){
		return (angreifer.gib_anzahl_armeen()-1);		
	}
	
	protected int gib_Anzahl_verteidiger(Land verteidiger){
		return verteidiger.gib_anzahl_armeen();		
	}
	
	protected void fuehre_Angriff_durch(int angreifer_gestorben, int angreifer_ausgesandt,int verteidiger_gestorben, Land angreifer, Land verteidiger){

		for (int i=0; i<angreifer_gestorben; i++) {
                    angreifer.decArmeen();
                    angreifer_ausgesandt--;
                }
		
		int neue_anz_ver=verteidiger.gib_anzahl_armeen()-verteidiger_gestorben;
		for (int i=0; i<verteidiger_gestorben; i++) verteidiger.decArmeen(); 
		
		if (neue_anz_ver<=0){
			verteidiger.neuerBesitzer(angreifer.gib_besitzer());
			verteidiger.mehr_Armeen(angreifer_ausgesandt);
			for (int i=0; i<angreifer_ausgesandt; i++) angreifer.decArmeen();
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
	
	protected boolean pruefe_zusatz_Armeen (Land Ausgangsland, Land Zielland, Spieler aktueller_Spieler){
                if (!(Ausgangsland.ist_angrenzendes_Land(Zielland))) throw new IllegalArgumentException("Country not next to the other one!");
                if ((Ausgangsland.gib_besitzer()==aktueller_Spieler) && (Zielland.gib_besitzer()==aktueller_Spieler)) return true;
		return false;
	}
	
	protected void fuege_Armeen_hinzu(Land Zielland, int anzahl_Armeen){
		Zielland.mehr_Armeen(anzahl_Armeen);		
	}
	
}
