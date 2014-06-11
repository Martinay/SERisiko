
package ServerLogic.Model;

import GameLogic.*;
import ServerLogic.Helper.CountryMapper;
import ServerLogic.Helper.PlayerMapper;
import ServerLogic.Map.Interfaces.IMapLoader;
import ServerLogic.Map.MapLoader;

import java.util.Arrays;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author Martin
 */
public class ServerGame extends Game {
    
    public List<Player> Players = new LinkedList<>();
    private Spielsteuerung _spiel;
    private IMapLoader _mapLoader = new MapLoader();

    public ServerGame(Player player, String name, int id, int maxPlayer) {
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
            PlayerMapper.Add(spieler, player);
        }

        Collection<Kontinent> loadedContinents = _mapLoader.GetKontinets();

        Kontinent[] kontinents = loadedContinents.toArray(new Kontinent[loadedContinents.size()-1]);

       _spiel = new Spielsteuerung(spielerList.toArray(new Spieler[spielerList.size()-1]), kontinents);
        CountryMapper.CreateCountryMapping(kontinents);
     }

    public Integer[] Attack(String countryFromID, String countryToID, int units) {

        if (_spiel.Zustand != Spielzustaende.Angriff)
            return new Integer[0];

        Land from = CountryMapper.GetCountryById(countryFromID);
        Land to = CountryMapper.GetCountryById(countryToID);

        InteractWithGameLogic(units, from, to, false);

        return Arrays.asList(6,4,3,2,1).toArray(new Integer[5]);
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
