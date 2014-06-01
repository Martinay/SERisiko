package GameLogic;
public class SpielEreigniss {

	public int anz_Armeen;
	public Land erstesLand;
	public Land zweitesLand;
	public boolean phasenwechsel;
	
	//public Spieler aktueller_Spieler;
	
	public SpielEreigniss(int anz_Armeen, Land erstesLand, Land zweitesLand, boolean phasenwechsel){
		this.anz_Armeen=anz_Armeen;
		this.erstesLand=erstesLand;
		this.zweitesLand=zweitesLand;
		this.phasenwechsel=phasenwechsel;
	}

}
