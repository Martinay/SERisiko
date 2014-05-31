package GameLogic;

import java.awt.*;


public class Land {
	
	private Spieler besitzer; //Spieler mit Armeen auf Land
	private final String bezeichnung; // z.B. Deutschland
	private int anzahl_armeen;
	
	private Land[] angrenzendeLaender;
	private Polygon abmessungen;
	
	
	public Land (Spieler besitzer,String bezeichnung, Polygon abmessungen){
		this.besitzer=besitzer;
		this.anzahl_armeen=1;
		this.bezeichnung=bezeichnung;
		this.abmessungen= abmessungen;
		this.angrenzendeLaender=new Land[0];
	}
	
	
	public Polygon gib_Polygon(){
		return abmessungen;
	}
	
	public int gib_anzahl_armeen(){
		return anzahl_armeen;
	}
	
	public Spieler gib_besitzer(){
		return besitzer;
	}
	
	protected void mehr_Armeen(int Anz){
		anzahl_armeen = anzahl_armeen+Math.abs(Anz);
	}	
	
	protected String gib_bezeichnung(){
		return bezeichnung;
	}
	
	protected boolean decArmeen(){
		if (anzahl_armeen>0){
			anzahl_armeen = anzahl_armeen-1;
		}
		if (anzahl_armeen>0) return true;
		return false;
	}
	
	protected void neuerBesitzer(Spieler newBesitzer){
		besitzer = newBesitzer;
	}
	
	protected boolean ist_angrenzendes_Land(Land frage_Land){
		for (int i=0;i<angrenzendeLaender.length; i++){
			if (angrenzendeLaender[i]==frage_Land) return true;
		}
		return false;
	}
	
	protected void setze_angrenzende_Laender(Land[] Laender){
		angrenzendeLaender=Laender;
	}
	
}
