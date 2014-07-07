package GameLogic;

import java.util.Arrays;


public class Spielsteuerung {

	
	private boolean ist_erste_runde;
	public Spieler aktueller_Spieler;
	
	public Spielwelt DieSpielwelt;
	private Spieler[] dieSpieler;
	
	public Spielzustaende Zustand;
        
        
        private Client_Response aktueller_Response;
	
	
	//Zustandsvariabeln
	
	private int hinzuzufuegende_Armeen;

	public Spielsteuerung( Spieler[] dieSpieler, Kontinent[] kontinente){
		ist_erste_runde=true;

		this.dieSpieler = dieSpieler;
		
		DieSpielwelt = new Spielwelt(kontinente);
		
		this.aktueller_Spieler=dieSpieler[0];

        setzeBesitzer(kontinente); //TODO
		
		armeen_hinzufuegen_betreten();
	}

    private void setzeBesitzer(Kontinent[] kontinente) {
        //TODO

        for (Kontinent kontinent : kontinente)
        {
            for (Land land : kontinent.GETLands())
                land.neuerBesitzer(dieSpieler[(int)(Math.random()*dieSpieler.length)]);
        }
    }

    public Client_Response gib_aktuellen_Zustand(){
            return aktueller_Response;
        }
    
    public void EntferneSpieler(Spieler spieler){
        //TODO: Spieler entfernen, Karte neu verteilen
    }
	
	public Client_Response zustandssteuerung(SpielEreigniss Ereigniss){
		
		switch (Zustand) {
		
			case Armeen_hinzufuegen:
					return armeen_hinzufuegen(Ereigniss);
					
			case Angriff:
					return angriff(Ereigniss);
				
			case Verschieben:
					return verschieben(Ereigniss);
                            
                        default:        return aktueller_Response;
				
		}
	}
	
	
	private int[] wuerfele(int angreifer_wuerfel ,Land defLand, int[] angreifer_wuerfel_array, int[]verteidiger_wuerfel_array){
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
                
                angreifer_wuerfel_array=ang_wuerfel;
                verteidiger_wuerfel_array=ver_wuerfel;
		
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
		Zustand=Spielzustaende.Armeen_hinzufuegen;
                Client_Response zwischen = new Client_Response(DieSpielwelt, Zustand, aktueller_Spieler, false);
                zwischen.hinzufuegbare_Armeen = DieSpielwelt.gib_anz_neue_Armeen(aktueller_Spieler);
               
        aktueller_Response=zwischen;
	return zwischen;
	}
	
	private Client_Response armeen_hinzufuegen(SpielEreigniss Ereigniss){
		
		if (Ereigniss.phasenwechsel){
				
			return armeen_hinzufuegen_verlassen();
				
		}else{
			
			if (Ereigniss.erstesLand.gib_besitzer()==this.aktueller_Spieler){
				Ereigniss.erstesLand.mehr_Armeen(Ereigniss.anz_Armeen);
				hinzuzufuegende_Armeen=hinzuzufuegende_Armeen-Ereigniss.anz_Armeen;
			}else{
                                aktueller_Response=new Client_Response(DieSpielwelt, Zustand, aktueller_Spieler, true);
				return aktueller_Response;
			}
		
			if (hinzuzufuegende_Armeen<=0) return armeen_hinzufuegen_verlassen();
			
                        aktueller_Response=new Client_Response(DieSpielwelt, Zustand, aktueller_Spieler, false);
                        aktueller_Response.hinzufuegbare_Armeen=hinzuzufuegende_Armeen;
			return aktueller_Response;
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
		aktueller_Response = new Client_Response(DieSpielwelt, Zustand, aktueller_Spieler, false);
                return aktueller_Response;
	}
		
	private Client_Response angriff(SpielEreigniss Ereigniss){
		if (Ereigniss.phasenwechsel){
			
			return angriff_verlassen();
				
		}else{
			if (DieSpielwelt.pruefe_Attacke(Ereigniss.erstesLand, Ereigniss.zweitesLand, aktueller_Spieler)){
                                int[] angreifer_wuerfel_array=null;
                                int[] verteidiger_wuerfel_array=null;
				int [] wuerfel_erg = wuerfele(Ereigniss.anz_Armeen ,Ereigniss.zweitesLand, angreifer_wuerfel_array,verteidiger_wuerfel_array);
				DieSpielwelt.fuehre_Angriff_durch(wuerfel_erg[0],wuerfel_erg[1], Ereigniss.erstesLand, Ereigniss.zweitesLand);
                                
                                if (pruefe_Spiel_ende()){
                                    Zustand=Spielzustaende.Beenden;
                                    Client_Response zwischen = new Client_Response(DieSpielwelt, Zustand, aktueller_Spieler, false);
                                    zwischen.angreifer_wuerfel=angreifer_wuerfel_array;
                                    zwischen.verteidiger_wuerfel=verteidiger_wuerfel_array;
                                    aktueller_Response=zwischen;
                                    return zwischen;
                                }
                                
                                Client_Response zwischen = new Client_Response(DieSpielwelt, Zustand, aktueller_Spieler, false);
                                    zwischen.angreifer_wuerfel=angreifer_wuerfel_array;
                                    zwischen.verteidiger_wuerfel=verteidiger_wuerfel_array;
				aktueller_Response = zwischen;
                                return aktueller_Response;
			}else{
                                aktueller_Response = new Client_Response(DieSpielwelt, Zustand, aktueller_Spieler, true);
				return aktueller_Response;
			}
			
		}
	}
		
	private Client_Response angriff_verlassen(){
		return verschieben_betreten();
	}
        
        private boolean pruefe_Spiel_ende(){
		int count=0;
		for (int i=0; i<dieSpieler.length; i++){
			if (DieSpielwelt.gib_anz_Armeen_insgesamt(dieSpieler[i])>0) count++;
		}
		if (count>1)return false;
				else return true;
	}
	
	//verschieben*******************************************************************************
	
	private Client_Response verschieben_betreten(){
		Zustand=Spielzustaende.Verschieben;
                aktueller_Response = new Client_Response(DieSpielwelt, Zustand, aktueller_Spieler, false);
		return aktueller_Response;
	}
		
	private Client_Response verschieben(SpielEreigniss Ereigniss){
		if (Ereigniss.phasenwechsel){
			return verschieben_verlassen();	
		}else{
			DieSpielwelt.verschiebe_Armeen(Ereigniss.erstesLand, Ereigniss.zweitesLand, Ereigniss.anz_Armeen);
                        aktueller_Response = new Client_Response(DieSpielwelt, Zustand, aktueller_Spieler, false);
			return aktueller_Response;
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
