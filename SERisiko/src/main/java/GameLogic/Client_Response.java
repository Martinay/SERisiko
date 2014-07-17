package GameLogic;

public class Client_Response {
	
	private Spielzustaende aktuellerZustand;
	private Spielwelt dieSpielwelt;
	private boolean fehler;
	private Spieler aktuellerSpieler;
        
        public int hinzufuegbare_Armeen; // nur gesetzt wenn im Zustand armeen hinzu
        
        public int[] angreifer_wuerfel;         // gesetzt nach Angriff auch nach Beendet
        public int[] verteidiger_wuerfel;       // ich weiss das der public mist unschoen ist...
                
	protected Client_Response(Spielwelt dieSpielwelt, Spielzustaende aktuellerZustand, Spieler aktuellerSpieler, boolean fehler){
		this.dieSpielwelt=dieSpielwelt;
		this.aktuellerZustand=aktuellerZustand;
		this.fehler=fehler;
                this.aktuellerSpieler=aktuellerSpieler;
                
                hinzufuegbare_Armeen=0;
                angreifer_wuerfel=null;
                verteidiger_wuerfel=null;       
	}
	
	public Land[] gib_Laender(){
		return dieSpielwelt.gibLaender();
	}
	
	public Spielzustaende gib_aktuellen_Zustand(){
		return aktuellerZustand;
	}
	
	public int gib_Anzahl_Laender_von_Spieler(Spieler gesuchter_Spieler){
		return dieSpielwelt.gib_anz_Laender(gesuchter_Spieler);
	}

    public void setzeAktuellenZustand(Spielzustaende zustand)
    {
        aktuellerZustand = zustand;
    }

	public boolean ist_ein_fehler_aufgetreten(){
		return fehler;
	}
	
	public Spieler gib_aktuellen_Spieler(){
		return aktuellerSpieler;
	}

}
