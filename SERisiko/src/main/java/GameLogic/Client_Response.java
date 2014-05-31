package GameLogic;

public class Client_Response {
	
	private Spielzustaende aktuellerZustand;
	private Spielwelt dieSpielwelt;
	private boolean fehler;
	private Spieler aktuellerSpieler;
	
	protected Client_Response(Spielwelt dieSpielwelt, Spielzustaende aktuellerZustand, Spieler aktuellerSpieler, boolean fehler){
		this.dieSpielwelt=dieSpielwelt;
		this.aktuellerZustand=aktuellerZustand;
		this.fehler=fehler;
	}
	
	public Land[] gib_Laender(){
		return dieSpielwelt.gibLaender();
	}
	
	public Spielzustaende gib_aktuellen_Zustand(){
		return aktuellerZustand;
	}
	
	public int gib_Anzahl_Armeen_von_Spieler(Spieler gesuchter_Spieler){
		return dieSpielwelt.gib_anz_Laender(gesuchter_Spieler);
	}
	
	public boolean ist_ein_fehler_aufgetreten(){
		return fehler;
	}
	
	public Spieler gib_aktuellen_Spieler(){
		return aktuellerSpieler;
	}

}
