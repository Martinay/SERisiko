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

            //setzeBesitzer(kontinente);
            setFairRandomOwner(kontinente); // this coud be a kind of more handy
            
            if (constructor_ok()){
                armeen_hinzufuegen_betreten();
            }else{
               Zustand=Spielzustaende.Beenden;
               this.aktueller_Response = new Client_Response(null, null, null, true); 
               throw new IllegalArgumentException("Init failed -> not enought data");
            }
    }

    private boolean constructor_ok(){

        if (dieSpieler.length<2) return false;
        if (DieSpielwelt.gibLaender()==null) return false;
        if (DieSpielwelt.gibLaender().length<5) return false;

        //Falls noch Fehlzustaende zur Erzeugung fuehren bitte hier Abfrage erstellen 

        return true;
    }

    private void setzeBesitzer(Kontinent[] kontinente) {
        //Todo testen... 

        int[] verteilung = new int[dieSpieler.length];
        for (int i=0; i<dieSpieler.length; i++){ //default für int ist 0 also kann man sich die loop sparen ;)
            verteilung[i]=0;			
        } 

        for (Kontinent kontinent : kontinente)
        {
            for (Land land : kontinent.GETLands())
                land.neuerBesitzer(auswahl_zufall_spieler(dieSpieler, verteilung));

        }
    }
    
    private void spieler_wechsel(){
        int pos=0;
	while(this.aktueller_Spieler!=dieSpieler[pos]){
            pos++;
	}
		
	if (pos>=dieSpieler.length-1){
            aktueller_Spieler=dieSpieler[0];
	}else{
            aktueller_Spieler=dieSpieler[pos+1];
	}
		
	if (DieSpielwelt.gib_anz_Laender(aktueller_Spieler)==0) spieler_wechsel();
        
    }
    
    /*
    choose a fair player for each land, dependedd by a priotity list
    */
    private void setFairRandomOwner(Kontinent[] kontinente){
        int[] priorities = new int[dieSpieler.length]; 
        for (Kontinent kontinent : kontinente){
            for (Land land : kontinent.GetLandsShuffeld())
                land.neuerBesitzer(dieSpieler[choosePriotedPlayer(dieSpieler.length, priorities)]);
        }
    }
    
   /*
    returns a random integer number with given boundaries
    */
    private static int myRandom(int low, int high) {
        return (int) (Math.random() * (high - low) + low);
    }
    
    /*
    returns a player by given player list, depended by a priotity list
    */
    private int choosePriotedPlayer(int playerAmount, int[] priorities){
        int highestPrio = myRandom(0, playerAmount);
        int i = 0;
        if (playerAmount > 0){
            for (; i < playerAmount; i++){
                if (priorities[i] < priorities[highestPrio]){
                    highestPrio = i;
                }
            }  
            priorities[highestPrio]++;
        }
        return highestPrio;
    }
       
    private Spieler auswahl_zufall_spieler(Spieler[] spieler, int[] verteilung){ // ja bei 2 spielern ist es fair wenn einer 30% und der andere 70% bekommt, bei 4 Spieler aufwärts ist die funktion in ordnung
        int merk=10000;
	int pos=0;
		
	for (int i=0; i<verteilung.length; i++){
			
            if (verteilung[i]==merk){
                if (((int)(Math.random()*2))==1){
                    pos=i;
                    merk=verteilung[i];
                }
            }

            if (verteilung[i]<merk){
                pos=i;
                merk=verteilung[i];
            }
	}
        
	verteilung[pos]++;
	return spieler[pos];
    }

    public Client_Response gib_aktuellen_Zustand(){
            return aktueller_Response;
        }
    

    public void EntferneSpieler(Spieler zuentfernenderspieler) {

        if (dieSpieler.length <= 1) {
            dieSpieler = new Spieler[0];
            Zustand = Spielzustaende.Beenden;
            aktueller_Response.setzeAktuellenZustand(Zustand);
            return;
        }

        Spieler[] dienewSpieler = new Spieler[dieSpieler.length - 1];
        int i = 0;

        while ((dieSpieler[i] != zuentfernenderspieler) && (i < (dieSpieler.length - 1))) {
            dienewSpieler[i] = dieSpieler[i];
            i++;
        }
        i++;
        while (i < dieSpieler.length) {
            dienewSpieler[i - 1] = dieSpieler[i];
            i++;
        }
        dieSpieler = dienewSpieler;

        if (dieSpieler.length == 1){
            Zustand = Spielzustaende.Beenden;
            aktueller_Response.setzeAktuellenZustand(Zustand);

            for (Land land : DieSpielwelt.gibLaender())
                land.neuerBesitzer(dieSpieler[0]);
            return;
        }


        DieSpielwelt.verteile_neu_ohne(zuentfernenderspieler, dieSpieler);

        if (zuentfernenderspieler == this.aktueller_Spieler) {           // Case den ich nicht bedacht habe
            this.spieler_wechsel();
            this.armeen_hinzufuegen_betreten();
        }
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
	
	
    private void wuerfele(int[] angreifer_wuerfel_array, int[]verteidiger_wuerfel_array) {
            //zufaellig wuerfeln
            for (int i=0; i<angreifer_wuerfel_array.length;i++){
                angreifer_wuerfel_array[i]=(int)(1+Math.random()*6);
            }
            Arrays.sort(angreifer_wuerfel_array);
            array_drehen(angreifer_wuerfel_array);
            //zufaellig wuerfeln
            for (int i=0; i<verteidiger_wuerfel_array.length;i++){
                verteidiger_wuerfel_array[i]=(int)(1+Math.random()*6);
            }
            Arrays.sort(verteidiger_wuerfel_array);
            array_drehen(verteidiger_wuerfel_array);        
    }
    
    private void array_drehen(int[] array){
        for (int i=0; i<(array.length/2);i++){
            int zwischen = array [i];
            array[i]=array[(array.length-1)-i];
            array[(array.length-1)-i]=zwischen;
        }
    }
		
	
	
	
//Armeen hinzu*******************************************************************************
	
	
	private Client_Response armeen_hinzufuegen_betreten(){
		Zustand=Spielzustaende.Armeen_hinzufuegen;
                Client_Response zwischen = new Client_Response(DieSpielwelt, Zustand, aktueller_Spieler, false);
                
                
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
				throw new IllegalArgumentException("This is not the Players county! - can not increment armis");
			}
		
			if (hinzuzufuegende_Armeen<=0) return armeen_hinzufuegen_verlassen();
			
                        aktueller_Response=new Client_Response(DieSpielwelt, Zustand, aktueller_Spieler, false);
                        aktueller_Response.hinzufuegbare_Armeen=hinzuzufuegende_Armeen;
			return aktueller_Response;
		}
	}
	
	private Client_Response armeen_hinzufuegen_verlassen(){
		if (ist_erste_runde==true){
                    
			spieler_wechsel();
			
                        if (this.aktueller_Spieler == dieSpieler[0])
                            ist_erste_runde=false;
                                
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


            
        //***********wechsel der Phase????********************
        if (Ereigniss.phasenwechsel)
            return angriff_verlassen();

        //***********Darf der Angriff durchgefuehrt werden???********************
        
        if (!(DieSpielwelt.pruefe_Attacke(Ereigniss.erstesLand, Ereigniss.zweitesLand, aktueller_Spieler))) {
            aktueller_Response = new Client_Response(DieSpielwelt, Zustand, aktueller_Spieler, true);
            throw new IllegalArgumentException("can not attack!");
        }        
        
        //***********Angriff an sich********************
  
        Land angreifer_Land = Ereigniss.erstesLand;
        Land verteidiger_Land = Ereigniss.zweitesLand;
        int angreifer = Ereigniss.anz_Armeen;
        
        int angreifer_wuerfel=0;
        int verteidiger_wuerfel=0;
        
        if (angreifer>3) angreifer_wuerfel=3; else angreifer_wuerfel=angreifer;
        if (verteidiger_Land.gib_anzahl_armeen()>2) verteidiger_wuerfel=2; else verteidiger_wuerfel=verteidiger_Land.gib_anzahl_armeen();
        if (verteidiger_wuerfel>angreifer_wuerfel) verteidiger_wuerfel=angreifer_wuerfel;
        
        //wuerfeln...
        int[] angreifer_wuerfel_array = new int[angreifer_wuerfel];
        int[]verteidiger_wuerfel_array = new int[verteidiger_wuerfel];        
        wuerfele(angreifer_wuerfel_array, verteidiger_wuerfel_array);    
        
        //vergleichen
        int tote_angreifer=0;
        int tote_verteidiger=0;
        
        for (int i=0; i<verteidiger_wuerfel_array.length;i++){
                if (angreifer_wuerfel_array[i]<=verteidiger_wuerfel_array[i]){
                    tote_angreifer++;
                }else{
                    tote_verteidiger++;
                }     
        }
        
        //Angriff durchfuehren
        DieSpielwelt.fuehre_Angriff_durch(tote_angreifer, angreifer, tote_verteidiger, angreifer_Land, verteidiger_Land);
        
        //Spiel zu ende?
        
        if (pruefe_Spiel_ende()) {
            Zustand = Spielzustaende.Beenden;
        }  
        
        //Baue Response
        
        aktueller_Response = new Client_Response(DieSpielwelt, Zustand, aktueller_Spieler, false);
        aktueller_Response.angreifer_wuerfel = angreifer_wuerfel_array;
        aktueller_Response.verteidiger_wuerfel = verteidiger_wuerfel_array;
        
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
		}
                if (DieSpielwelt.pruefe_zusatz_Armeen(Ereigniss.erstesLand, Ereigniss.zweitesLand, aktueller_Spieler)){
                    DieSpielwelt.verschiebe_Armeen(Ereigniss.erstesLand, Ereigniss.zweitesLand, Ereigniss.anz_Armeen);
                    aktueller_Response = new Client_Response(DieSpielwelt, Zustand, aktueller_Spieler, false);
                    return aktueller_Response;
                }else{
                    aktueller_Response=new Client_Response(DieSpielwelt, Zustand, aktueller_Spieler, true);
                    throw new IllegalArgumentException("Can not move armis, because aktiv Player is not owner of both countries...");   
                }
	}
			
	private Client_Response verschieben_verlassen(){
		this.spieler_wechsel();
		
		return armeen_hinzufuegen_betreten();
	}
	
	

}
