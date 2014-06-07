
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
        CountryMapper.CreateCountryMapping(_spiel.DieSpielwelt.gibLaender());
     }

    public void Attack(String countryFromID, String countryToID, int units) {

        if (_spiel.Zustand != Spielzustaende.Angriff)
            return;

        Land from = CountryMapper.GetCountryById(countryFromID);
        Land to = CountryMapper.GetCountryById(countryToID);

        SpielEreigniss ereignis = new SpielEreigniss(units,from, to, false);
        _spiel.zustandssteuerung(ereignis);
    }

    public void EndAttack() {
        if (_spiel.Zustand != Spielzustaende.Angriff)
            return;

        SpielEreigniss ereignis = new SpielEreigniss(1,null, null, true);
        _spiel.zustandssteuerung(ereignis);
    }

    public void Move(String countryFromID, String countryToID, int units) {
        if (_spiel.Zustand != Spielzustaende.Verschieben)
            return;

        Land from = CountryMapper.GetCountryById(countryFromID);
        Land to = CountryMapper.GetCountryById(countryToID);

        SpielEreigniss ereignis = new SpielEreigniss(units,from, to, false);
        _spiel.zustandssteuerung(ereignis);
    }

    public void PlaceUnits(String countryID, int units) {
        if (_spiel.Zustand != Spielzustaende.Armeen_hinzufuegen)
            return;

        Land land = CountryMapper.GetCountryById(countryID);

        SpielEreigniss ereignis = new SpielEreigniss(units,land, null, false);
        _spiel.zustandssteuerung(ereignis);
    }

    public Player EndTurn() {
        SpielEreigniss ereignis = new SpielEreigniss(1,null, null, true);
        _spiel.zustandssteuerung(ereignis);
        if (_spiel.Zustand != Spielzustaende.Angriff)
            _spiel.zustandssteuerung(ereignis);

        if (_spiel.Zustand != Spielzustaende.Verschieben)
            _spiel.zustandssteuerung(ereignis);

        return PlayerMapper.Map(_spiel.aktueller_Spieler);
    }
}
