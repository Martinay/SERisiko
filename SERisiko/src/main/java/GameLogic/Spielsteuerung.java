package GameLogic;

import java.util.Arrays;


public class Spielsteuerung {

	
	private boolean ist_erste_runde;
	private Spieler aktueller_Spieler;
	
	private Land zuletzt_geklicktes_Land;
	
	private Spielwelt dieSpielwelt;
	private Spieler[] dieSpieler;
	
	private Spielzustaende Zustand;
	
	
	//Zustandsvariabeln
	
	private int hinzuzufuegende_Armeen;
	
	/**
	 * @param args
	 */
	
	public Spielsteuerung( Spieler[] dieSpieler){
		ist_erste_runde=true;

		this.dieSpieler = dieSpieler;
		this.dieSpielwelt = spielfeld_data.init_spielwelt_europa(dieSpieler);
		
		this.aktueller_Spieler=dieSpieler[0];
		
		armeen_hinzufuegen_betreten();
	}
	
	
	public Client_Response zustandssteuerung(Spiel_Ereigniss Ereigniss){
		
		switch (Zustand) {
		
			case Armeen_hinzufuegen:
					return armeen_hinzufuegen(Ereigniss);
					
			case Angriff:
					return angriff(Ereigniss);
				
			case Verschieben:
					return verschieben(Ereigniss);
				
		}
                throw new RuntimeException("Invalid State");
	}
	
	
	private int[] wuerfele(int angreifer_wuerfel ,Land defLand){
		int verteidiger_wuerfel;
		
		if (angreifer_wuerfel < defLand.gib_anzahl_armeen()) verteidiger_wuerfel=angreifer_wuerfel; 
				else verteidiger_wuerfel=defLand.gib_anzahl_armeen();
		
		int [] ang_wuerfel = new int[angreifer_wuerfel];		
		int [] ver_wuerfel = new int[verteidiger_wuerfel];
		
		
		for (int i=0; i<angreifer_wuerfel; i++){
			ang_wuerfel[i]=(int)(1+Math.random()*6);
		}
		Arrays.sort(ang_wuerfel);
		
		for (int i=0; i<verteidiger_wuerfel; i++){
			ver_wuerfel[i]=(int)(1+Math.random()*6);
		}
		Arrays.sort(ver_wuerfel);
		
		int tote_angreifer=0;
		int tote_verteidiger=0;
		
		int unterschied = ang_wuerfel.length - ver_wuerfel.length;
		for (int i=ver_wuerfel.length-1; i>=0; i--){
			if (ang_wuerfel[unterschied+i]>ver_wuerfel[i]) tote_angreifer++; else tote_verteidiger++;
		}
		tote_verteidiger = tote_verteidiger + unterschied;
		
		
		int[] rueck = new int[2];
		
		rueck[0]=tote_angreifer;
		rueck[1]=tote_verteidiger;
		
		return rueck;
	}
		
	
	
	
//Armeen hinzu*******************************************************************************
	
	
	private Client_Response armeen_hinzufuegen_betreten(){
		int max_Armeen=(dieSpielwelt.gib_anz_Laender(aktueller_Spieler)/2);
		hinzuzufuegende_Armeen=max_Armeen;
		Zustand=Spielzustaende.Armeen_hinzufuegen;
		return new Client_Response(dieSpielwelt, Zustand, aktueller_Spieler, false);
	}
	
	private Client_Response armeen_hinzufuegen(Spiel_Ereigniss Ereigniss){ 
		
		if (Ereigniss.phasenwechsel){
				
			return armeen_hinzufuegen_verlassen();
				
		}else{
			
			if (Ereigniss.erstesLand.gib_besitzer()==this.aktueller_Spieler){
				Ereigniss.erstesLand.mehr_Armeen(Ereigniss.anz_Armeen);
				hinzuzufuegende_Armeen=hinzuzufuegende_Armeen-Ereigniss.anz_Armeen;
			}else{
				return new Client_Response(dieSpielwelt, Zustand, aktueller_Spieler, true);
			}
		
			if (hinzuzufuegende_Armeen<=0) return armeen_hinzufuegen_verlassen();
			
			return new Client_Response(dieSpielwelt, Zustand, aktueller_Spieler, false);
		}
	}
	
	private Client_Response armeen_hinzufuegen_verlassen(){
		if (ist_erste_runde==true){
			int pos=0;
			while(this.aktueller_Spieler!=dieSpieler[pos]){
				pos++;
			}
			
			if (pos>=dieSpieler.length-1){
				ist_erste_runde=false;
				aktueller_Spieler=dieSpieler[0];
			}else{
				aktueller_Spieler=dieSpieler[pos+1];
			}
			
			return armeen_hinzufuegen_betreten();
			
		}else{
			return angriff_betreten();
		}
	}
	

//Angriff*******************************************************************************
		
	private Client_Response angriff_betreten(){
		Zustand=Spielzustaende.Angriff;
		return new Client_Response(dieSpielwelt, Zustand, aktueller_Spieler, false);
	}
		
	private Client_Response angriff(Spiel_Ereigniss Ereigniss){
		if (Ereigniss.phasenwechsel){
			
			return angriff_verlassen();
				
		}else{
			if (dieSpielwelt.pruefe_Attacke(Ereigniss.erstesLand, Ereigniss.zweitesLand, aktueller_Spieler)){
				int [] wuerfel_erg = wuerfele(Ereigniss.anz_Armeen ,Ereigniss.zweitesLand);
				dieSpielwelt.fuehre_Angriff_durch(wuerfel_erg[0],wuerfel_erg[1], Ereigniss.erstesLand, Ereigniss.zweitesLand);	
				return new Client_Response(dieSpielwelt, Zustand, aktueller_Spieler, false);
			}else{
				return new Client_Response(dieSpielwelt, Zustand, aktueller_Spieler, true);
			}
			
		}
	}
		
	private Client_Response angriff_verlassen(){
		return verschieben_betreten();
	}
	
	//verschieben*******************************************************************************
	
	private Client_Response verschieben_betreten(){
		Zustand=Spielzustaende.Verschieben;
		return new Client_Response(dieSpielwelt, Zustand, aktueller_Spieler, false);
	}
		
	private Client_Response verschieben(Spiel_Ereigniss Ereigniss){
		if (Ereigniss.phasenwechsel){
			return verschieben_verlassen();	
		}else{
			dieSpielwelt.verschiebe_Armeen(Ereigniss.erstesLand, Ereigniss.zweitesLand, Ereigniss.anz_Armeen);
			return new Client_Response(dieSpielwelt, Zustand, aktueller_Spieler, false);
		}
	}
			
	private Client_Response verschieben_verlassen(){
		int pos=0;
		while(this.aktueller_Spieler!=dieSpieler[pos]){
			pos++;
		}
		
		if (pos>=dieSpieler.length-1){
			aktueller_Spieler=dieSpieler[0];
		}else{
			aktueller_Spieler=dieSpieler[pos+1];
		}
		
		return armeen_hinzufuegen_betreten();
	}
	
	

}