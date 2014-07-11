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
        //Einfügen der Spielerverteilfunktion von Simon aus Ursprünglichem Programm

        for (Kontinent kontinent : kontinente)
        {
            for (Land land : kontinent.GETLands())
                land.neuerBesitzer(dieSpieler[(int)(Math.random()*dieSpieler.length)]);
        }
    }

    public Client_Response gib_aktuellen_Zustand(){
            return aktueller_Response;
        }
    
    /*
    
    kein kommentar ..............
    */
    public void EntferneSpieler(Spieler zuentfernenderspieler){
        Spieler[] dienewSpieler = new Spieler[dieSpieler.length-1];
        int i=0;

        while((dieSpieler[i]!=zuentfernenderspieler) && (i<(dieSpieler.length-1))){
        	dienewSpieler[i]=dieSpieler[i];
        	i++;
        }
        i++;
        while (i<dieSpieler.length){
        	dienewSpieler[i-1]=dieSpieler[i];
        	i++;
        }
        dieSpieler=dienewSpieler;
        DieSpielwelt.verteile_neu_ohne(zuentfernenderspieler, dieSpieler);
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
	
	
	private int[] wuerfele(int[] angreifer_wuerfel_array, int[]verteidiger_wuerfel_array) {
        int angreifer_wuerfel = angreifer_wuerfel_array.length;
        int verteidiger_wuerfel = verteidiger_wuerfel_array.length;

        int[] ang_wuerfel = new int[angreifer_wuerfel];
        int[] ver_wuerfel = new int[verteidiger_wuerfel];

        for (int i = 0; i < angreifer_wuerfel; i++) {
            int zahl = (int) (1 + Math.random() * 5);
            ang_wuerfel[i] = zahl;
            angreifer_wuerfel_array[i] = zahl;
        }
        Arrays.sort(ang_wuerfel);

        for (int i = 0; i < verteidiger_wuerfel; i++) {
            int zahl = (int) (1 + Math.random() * 5);
            ver_wuerfel[i] = zahl;
            verteidiger_wuerfel_array[i] = zahl;
        }
        Arrays.sort(ver_wuerfel);

        int tote_angreifer = 0;
        int tote_verteidiger = 0;

        int unterschied = ang_wuerfel.length - ver_wuerfel.length;
        for (int i = ver_wuerfel.length - 1; i >= 0; i--) {
            if (ang_wuerfel[unterschied + i] > ver_wuerfel[i]) tote_angreifer++;
            else tote_verteidiger++;
        }
        tote_verteidiger = tote_verteidiger + unterschied;


        int[] rueck = new int[2];

        rueck[0] = tote_angreifer;
        rueck[1] = tote_verteidiger;

        return rueck;
    }
		
	
	
	
//Armeen hinzu*******************************************************************************
	
	
	private Client_Response armeen_hinzufuegen_betreten(){
		Zustand=Spielzustaende.Armeen_hinzufuegen;
                Client_Response zwischen = new Client_Response(DieSpielwelt, Zustand, aktueller_Spieler, false);
                
                /*
                also wenn man sich schon so switch cases irg wo raus kopiert
                dann bitte auch richt anpassen, was für nen monat bitte XDDDDDDD
                want to buy cat
                */
                if (ist_erste_runde==true){
                	switch (dieSpieler.length){
                            case 2:  hinzuzufuegende_Armeen=40;
                                         break;
                            case 3:  hinzuzufuegende_Armeen=35;
                                         break;
                            case 4:  hinzuzufuegende_Armeen=30;
                                         break;
                            case 5:  hinzuzufuegende_Armeen=25;
                                         break;
                            default: hinzuzufuegende_Armeen=20;
                                         break;
                        }
                }
                else{
                	hinzuzufuegende_Armeen = DieSpielwelt.gib_anz_neue_Armeen(aktueller_Spieler);
                }
                
               	zwischen.hinzufuegbare_Armeen=hinzuzufuegende_Armeen;
               	
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
		
	private Client_Response angriff(SpielEreigniss Ereigniss) {

        //
        //
        // http://i.imgur.com/6xGoQrf.gif
        //
        //

        if (Ereigniss.phasenwechsel)
            return angriff_verlassen();

        if (!DieSpielwelt.pruefe_Attacke(Ereigniss.erstesLand, Ereigniss.zweitesLand, aktueller_Spieler)) {
            aktueller_Response = new Client_Response(DieSpielwelt, Zustand, aktueller_Spieler, true);
            return aktueller_Response;
        }

        int dicesA = Ereigniss.anz_Armeen > 3?3:Ereigniss.anz_Armeen;
        int dicesD = Ereigniss.zweitesLand.gib_anzahl_armeen() > 2?2:Ereigniss.zweitesLand.gib_anzahl_armeen();
        
        int[] angreifer_wuerfel_array = new int[dicesA];
        int[] verteidiger_wuerfel_array = new int[dicesD];

        int[] wuerfel_erg = wuerfele(angreifer_wuerfel_array, verteidiger_wuerfel_array);
        DieSpielwelt.fuehre_Angriff_durch(wuerfel_erg[0], wuerfel_erg[1], Ereigniss.erstesLand, Ereigniss.zweitesLand);

        if (pruefe_Spiel_ende()) {
            Zustand = Spielzustaende.Beenden;
            Client_Response zwischen = new Client_Response(DieSpielwelt, Zustand, aktueller_Spieler, false);
            zwischen.angreifer_wuerfel = angreifer_wuerfel_array;
            zwischen.verteidiger_wuerfel = verteidiger_wuerfel_array;
            aktueller_Response = zwischen;
            return zwischen;
        }

        Client_Response zwischen = new Client_Response(DieSpielwelt, Zustand, aktueller_Spieler, false);
        zwischen.angreifer_wuerfel = angreifer_wuerfel_array;
        zwischen.verteidiger_wuerfel = verteidiger_wuerfel_array;
        aktueller_Response = zwischen;
        return aktueller_Response;
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
		
		if (DieSpielwelt.gib_anz_Laender(aktueller_Spieler)==0) verschieben_verlassen();
		
		return armeen_hinzufuegen_betreten();
	}
	
	

}
