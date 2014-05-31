package GameLogic;

import java.awt.*;

public class Spieler {
	
	private Color spielerfarbe;
	private String name;
	
	public Spieler(Color farbe, String name){
		this.spielerfarbe=farbe;
		this.name=name;
	}
	
	public String gib_name(){
		return name;
	}

	public Color gib_spielerfarbe(){
		return spielerfarbe;
	}
}
