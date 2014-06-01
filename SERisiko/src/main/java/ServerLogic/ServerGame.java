
package ServerLogic;

import GameLogic.*;
import ServerLogic.Messages.Game;
import ServerLogic.Messages.Player;

import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author Martin
 */
class ServerGame extends Game {
    
    List<Player> Players = new LinkedList<Player>();
    Spielsteuerung _spiel;

    ServerGame(Player player, String name, int id) {
        Players.add(player);
        Name = name;
        ID = id;
    }

    @Override
    public int GetPlayerCount() {
        return Players.size();
    }

    public List<Integer> GetPlayerIds()
    {
        List<Integer> IDs = new LinkedList<Integer>();

        for (Player player : Players) {
            IDs.add(player.ID);
        }

        return IDs;
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
        List<Spieler> spielerList = new LinkedList<Spieler>();

        for (Player player : Players) {
            Spieler spieler = new Spieler(player.ID);
            spielerList.add(spieler);
            PlayerMapper.Add(spieler,player);
        }

       _spiel = new Spielsteuerung((Spieler[])spielerList.toArray());
        CountryMapper.CreateCountryMapping(_spiel.DieSpielwelt.gibLaender());
     }

    public void Attack(int countryFromID, int countryToID, int units) {

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

    public void Move(int countryFromID, int countryToID, int units) {
        if (_spiel.Zustand != Spielzustaende.Verschieben)
            return;

        Land from = CountryMapper.GetCountryById(countryFromID);
        Land to = CountryMapper.GetCountryById(countryToID);

        SpielEreigniss ereignis = new SpielEreigniss(units,from, to, false);
        _spiel.zustandssteuerung(ereignis);
    }

    public void PlaceUnits(int countryID, int units) {
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
