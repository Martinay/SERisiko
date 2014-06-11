
package ServerLogic;

import GameLogic.*;
import ServerLogic.Map.Interfaces.IMapLoader;
import ServerLogic.Map.MapLoader;
import ServerLogic.Messages.Game;
import ServerLogic.Messages.Player;

import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author Martin
 */
class ServerGame extends Game {
    
    List<Player> Players = new LinkedList<>();
    private Spielsteuerung _spiel;
    private IMapLoader _mapLoader = new MapLoader();

    ServerGame(Player player, String name, int id, int maxPlayer) {
        Players.add(player);
        Name = name;
        ID = id;
        MaxPlayer = maxPlayer;
    }

    @Override
    public int GetPlayerCount() {
        return Players.size();
    }

    public List<Integer> GetPlayerIds()
    {
        List<Integer> iDs = new LinkedList<>();

        for (Player player : Players) {
            iDs.add(player.ID);
        }

        return iDs;
    }

    public boolean AreAllPlayerReady()
    {
        for (Player player : Players) {
            if (!player.Ready)
                return false;
        }
        return true;
    }

    public void Start()
    {
        List<Spieler> spielerList = new LinkedList<>();

        for (Player player : Players) {
            Spieler spieler = new Spieler(player.ID);
            spielerList.add(spieler);
            PlayerMapper.Add(spieler,player);
        }

        Kontinent[] kontinents = (Kontinent[]) _mapLoader.GetKontinets().toArray();

       _spiel = new Spielsteuerung((Spieler[])spielerList.toArray(), kontinents);
        CountryMapper.CreateCountryMapping(kontinents);
     }

    public void Attack(String countryFromID, String countryToID, int units) {

        if (_spiel.Zustand != Spielzustaende.Angriff)
            return;

        Land from = CountryMapper.GetCountryById(countryFromID);
        Land to = CountryMapper.GetCountryById(countryToID);

        InteractWithGameLogic(units, from, to, false);
    }

    public void EndAttack() {
        if (_spiel.Zustand != Spielzustaende.Angriff)
            return;

        InteractWithGameLogic(1, null, null, true);
    }

    public void Move(String countryFromID, String countryToID, int units) {
        if (_spiel.Zustand != Spielzustaende.Verschieben)
            return;

        Land from = CountryMapper.GetCountryById(countryFromID);
        Land to = CountryMapper.GetCountryById(countryToID);

        InteractWithGameLogic(units, from, to, false);
    }

    public void PlaceUnits(String countryID, int units) {
        if (_spiel.Zustand != Spielzustaende.Armeen_hinzufuegen)
            return;

        Land land = CountryMapper.GetCountryById(countryID);

        InteractWithGameLogic(units, land, null, false);
    }

    public Player EndTurn() {

        Client_Response gameResponse = InteractWithGameLogic(1,null,null, true);
        if (gameResponse.gib_aktuellen_Zustand() != Spielzustaende.Angriff) {
            gameResponse = InteractWithGameLogic(1,null,null, true);
        }

        if (gameResponse.gib_aktuellen_Zustand() != Spielzustaende.Verschieben) {
            gameResponse = InteractWithGameLogic(1,null,null, true);
        }

        return PlayerMapper.Map(gameResponse.gib_aktuellen_Spieler());
    }

    private Client_Response InteractWithGameLogic(int units, Land erstesLand, Land zweitesLand, boolean changeState )
    {
        SpielEreigniss ereignis = new SpielEreigniss(units, erstesLand, zweitesLand, changeState );
        Client_Response gameResponse = _spiel.zustandssteuerung(ereignis);
        CheckForError(gameResponse);
        return gameResponse;
    }

    private void CheckForError(Client_Response gameResponse)
    {
        if (gameResponse.ist_ein_fehler_aufgetreten())
            throw new RuntimeException("Unknown Error in GameLogic in" + gameResponse.gib_aktuellen_Zustand());
    }
}
