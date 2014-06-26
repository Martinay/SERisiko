
package ServerLogic.Model.Server;

import GameLogic.*;
import ServerLogic.Helper.CountryMapper;
import ServerLogic.Helper.PlayerMapper;
import ServerLogic.Map.Interfaces.IMapLoader;
import ServerLogic.Map.MapLoader;
import ServerLogic.Model.*;
import net.hydromatic.linq4j.Linq4j;
import net.hydromatic.linq4j.function.Function1;
import net.hydromatic.linq4j.function.Predicate1;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author Martin
 */
public class ServerGame extends Game {
    
    public Player Creator;
    private Spielsteuerung _spiel;
    private IMapLoader _mapLoader = new MapLoader();

    public ServerGame(Player player, String name, int id, int maxPlayer) {
        Players.add(player);
        Creator = player;
        Name = name;
        ID = id;
        MaxPlayer = maxPlayer;
        CurrentGameStatus = GameStatus.WaitingForPlayer;
    }

    @Override
    public int GetPlayerCount() {
        return Players.size();
    }

    public List<Integer> GetPlayerIds()
    {
        return Linq4j.asEnumerable(Players)
                .select(new Function1<Player, Integer>() {
                    @Override
                    public Integer apply(Player player) {
                        return player.ID;
                    }
                })
                .toList();
    }

    public boolean AreAllPlayerReady()
    {
        return Linq4j.asEnumerable(Players)
                .all(new Predicate1<Player>() {
                    @Override
                    public boolean apply(Player player) {
                        return player.Ready;
                    }
                });
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

        Kontinent[] kontinents = loadedContinents.toArray(new Kontinent[loadedContinents.size() - 1]);

       _spiel = new Spielsteuerung(spielerList.toArray(new Spieler[spielerList.size()-1]), kontinents);
        CountryMapper.CreateCountryMapping(kontinents);

        Client_Response response = _spiel.gib_aktuellen_Zustand();
        UpdateGameStatus(response);
        CurrentGameStatus = GameStatus.FirstRoundPlacing;
     }

    public ServerDice Attack(String countryFromID, String countryToID, int units) {

        if (_spiel.Zustand != Spielzustaende.Angriff)
            return new ServerDice();

        Land from = CountryMapper.GetCountryById(countryFromID);
        Land to = CountryMapper.GetCountryById(countryToID);

        Client_Response gameResponse =  InteractWithGameLogic(units, from, to, false);
        UpdateGameStatus(gameResponse);

        return MapToServerDice(gameResponse.angreifer_wuerfel, gameResponse.verteidiger_wuerfel);
    }

    public void EndAttack() {
        if (_spiel.Zustand != Spielzustaende.Angriff)
            return;

        Client_Response gameResponse = InteractWithGameLogic(0, null, null, true);
        UpdateGameStatus(gameResponse);
    }

    public void Move(String countryFromID, String countryToID, int units) {
        if (_spiel.Zustand != Spielzustaende.Verschieben)
            return;

        Land from = CountryMapper.GetCountryById(countryFromID);
        Land to = CountryMapper.GetCountryById(countryToID);

        Client_Response gameResponse = InteractWithGameLogic(units, from, to, false);
        UpdateGameStatus(gameResponse);
    }

    public void PlaceUnits(String countryID, int units) {
        if (_spiel.Zustand != Spielzustaende.Armeen_hinzufuegen)
            return;

        Land land = CountryMapper.GetCountryById(countryID);

        Client_Response gameResponse = InteractWithGameLogic(units, land, null, false);
        UpdateGameStatus(gameResponse);
    }

    public void EndTurn() {

        Client_Response gameResponse = InteractWithGameLogic(1,null,null, true);
        while(gameResponse.gib_aktuellen_Zustand() != Spielzustaende.Armeen_hinzufuegen || gameResponse.gib_aktuellen_Zustand() != Spielzustaende.Beenden)
            gameResponse = InteractWithGameLogic(1,null,null, true);

        UpdateGameStatus(gameResponse);
    }

    public void Finish() {
        CurrentGameStatus = GameStatus.Finished;
        CurrentPlayer = null;
        NumberOfUnitsToPlace = 0;
    }

    private void UpdateGameStatus(Client_Response gameResponse) {
        CurrentPlayer = PlayerMapper.Map(gameResponse.gib_aktuellen_Spieler());
        CurrentGameStatus = MapSpielZustand(gameResponse.gib_aktuellen_Zustand());
        NumberOfUnitsToPlace = gameResponse.gib_Anzahl_Armeen_von_Spieler(gameResponse.gib_aktuellen_Spieler());
        //TODO Spielerstatus updaten
    }

    private GameStatus MapSpielZustand(Spielzustaende spielzustaende) {
        switch (spielzustaende) {
            case Armeen_hinzufuegen:
                return GameStatus.PlacingUnits;
            case Angriff:
                return GameStatus.Attack;
            case Verschieben:
                return GameStatus.Move;
            case Beenden:
                return GameStatus.Finished;
            default:
                throw new RuntimeException("Gamestatus not defined");
        }
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

    private ServerDice MapToServerDice(int[] angreifer_wuerfel, int[] verteidiger_wuerfel) {
        ServerDice dice = new ServerDice();
        dice.Attacker = getDices(angreifer_wuerfel, DiceType.Attacker);
        dice.Defender = getDices(verteidiger_wuerfel, DiceType.Defender);
        return dice;
    }

    private List<Dice> getDices(int[] dices, final DiceType type) {
        return Linq4j.asEnumerable(ConvertToList(dices))
                .select(new Function1<Integer, Dice>() {
                    @Override
                    public Dice apply(Integer integer) {
                        Dice dice = new Dice();
                        dice.type = type;
                        dice.value = integer;
                        return dice;
                    }
                })
                .toList();
    }

    private Collection<Integer> ConvertToList(int[] ints) {
        List<Integer> list = new ArrayList<>();
        for (int anInt : ints) {
            list.add(anInt);
        }
        return list;
    }
}
