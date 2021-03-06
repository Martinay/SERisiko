
package ServerLogic.Model.Server;

import GameLogic.*;
import ServerLogic.Helper.CountryService;
import ServerLogic.Helper.FirstUnitPlacementHelper;
import ServerLogic.Helper.PlayerMapper;
import ServerLogic.Map.Interfaces.IMapLoader;
import ServerLogic.Map.MapLoader;
import ServerLogic.Model.*;
import net.hydromatic.linq4j.Enumerable;
import net.hydromatic.linq4j.Linq4j;
import net.hydromatic.linq4j.function.Function1;
import net.hydromatic.linq4j.function.Predicate1;

import java.util.*;
import java.util.function.Consumer;

/**
 *
 * @author Martin
 */
public class ServerGame extends Game {

    public Player Creator;
    public List<Player> Players = new LinkedList<>();
    public boolean HasStarted = false;
    public Player CurrentPlayer;
    public FirstUnitPlacementHelper FirstUnitPlacementHelper = new FirstUnitPlacementHelper(this);


    private Spielsteuerung _spiel;
    private IMapLoader _mapLoader = new MapLoader();
    private CountryService _countryService = new CountryService();


    public ServerGame(Player player, String name, int id, int maxPlayer) {
        AddPlayer(player);
        Creator = player;
        Name = name;
        ID = id;
        MaxPlayer = maxPlayer;
        CurrentGameStatus = GameStatus.WaitingForPlayer;
        player.PlayerStatus = PlayerStatus.WaitingForGameStart;
    }

    @Override
    public int GetPlayerCount() {
        return Players.size();
    }

    @Override
    public int GetCurrentPlayerId() {
        if (CurrentPlayer == null)
            return 0;
        return CurrentPlayer.ID;
    }

    public List<Integer> GetPlayerIds() {
        return Linq4j.asEnumerable(Players)
                .select(new Function1<Player, Integer>() {
                    @Override
                    public Integer apply(Player player) {
                        return player.ID;
                    }
                })
                .toList();
    }

    public boolean AreAllPlayerReady() {
        return Linq4j.asEnumerable(Players)
                .all(new Predicate1<Player>() {
                    @Override
                    public boolean apply(Player player) {
                        return player.Ready;
                    }
                });
    }

    public void AddPlayer(Player player) {
        Players.add(player);
        player.PlayerStatus = PlayerStatus.WaitingForGameStart;
        player.Ready = false;
    }

    public void Start() {
        List<Spieler> spielerList = new LinkedList<>();

        for (Player player : Players) {
            Spieler spieler = new Spieler(player.ID);
            spielerList.add(spieler);
            PlayerMapper.Add(spieler, player);
        }

        Collection<Kontinent> loadedContinents = _mapLoader.GetKontinets();

        Kontinent[] kontinents = loadedContinents.toArray(new Kontinent[loadedContinents.size() - 1]);

        _spiel = new Spielsteuerung(spielerList.toArray(new Spieler[spielerList.size() - 1]), kontinents);
        _countryService.Initialize(kontinents);

        Client_Response response = _spiel.gib_aktuellen_Zustand();
        UpdateGameStatus(response);
        CurrentGameStatus = GameStatus.FirstRoundPlacing;

        SetPlayerStatusToPlaying();
        HasStarted = true;
    }

    public ServerDice Attack(String countryFromID, String countryToID, int units) {

        if (_spiel.Zustand != Spielzustaende.Angriff)
            return new ServerDice();

        Land from = _countryService.GetCountryById(countryFromID);
        Land to = _countryService.GetCountryById(countryToID);

        Client_Response gameResponse = InteractWithGameLogic(units, from, to, false);
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

        Land from = _countryService.GetCountryById(countryFromID);
        Land to = _countryService.GetCountryById(countryToID);

        Client_Response gameResponse = InteractWithGameLogic(units, from, to, false);
        UpdateGameStatus(gameResponse);
    }

    public void PlaceUnits(List<ClientMapChange> clientMapChanges) {
        int currentPlayerId = _spiel.aktueller_Spieler.Id;

        for(ClientMapChange change : clientMapChanges)
            PlaceUnits(change.CountryId, change.AddedUnits);

        if (_spiel.Zustand == Spielzustaende.Armeen_hinzufuegen && _spiel.aktueller_Spieler.Id == currentPlayerId) {
            Client_Response gameResponse = InteractWithGameLogic(1, null, null, true);
            UpdateGameStatus(gameResponse);
        }
    }

    public void EndTurn() {

        Client_Response gameResponse = InteractWithGameLogic(1, null, null, true);
        while (!(gameResponse.gib_aktuellen_Zustand() == Spielzustaende.Armeen_hinzufuegen || gameResponse.gib_aktuellen_Zustand() == Spielzustaende.Beenden))
            gameResponse = InteractWithGameLogic(1, null, null, true);

        UpdateGameStatus(gameResponse);
    }

    public void Finish() {
        CurrentGameStatus = GameStatus.Finished;
        CurrentPlayer = null;
        NumberOfUnitsToPlace = 0;
        SetPlayerStatusToUndefined();
    }

    public void RemovePlayer(Player player) {

        if (Creator.ID == player.ID && (CurrentGameStatus == GameStatus.WaitingForPlayer || CurrentGameStatus == GameStatus.FirstRoundPlacing) || Players.size() == 1)
            Finish();
        else
            player.PlayerStatus = PlayerStatus.Undefined;

        if (_spiel != null)
        {
            if (player.PlayerStatus != PlayerStatus.Defeated)
                _spiel.EntferneSpieler(PlayerMapper.Map(player));
            Client_Response gameResponse = _spiel.gib_aktuellen_Zustand();
            UpdateGameStatus(gameResponse);
        }

        Players.remove(player);
    }

    public List<MapChange> GetMap() {

        return Linq4j.asEnumerable(Arrays.asList(_spiel.gib_aktuellen_Zustand().gib_Laender()))
                .select(new Function1<Land, MapChange>() {
                    @Override
                    public MapChange apply(Land land) {
                        MapChange mapChange = new MapChange();
                        mapChange.Units = land.gib_anzahl_armeen();
                        mapChange.CountryID = land.gib_bezeichnung();
                        mapChange.OwnedByPlayerId = PlayerMapper.Map(land.gib_besitzer()).ID;
                        return mapChange;
                    }
                })
                .toList();
    }

    public List<MapChange> GetMapChanges(List<ClientMapChange> clientMapChanges) {
        return Linq4j.asEnumerable(clientMapChanges)
                .select(new Function1<ClientMapChange, MapChange>() {
                    @Override
                    public MapChange apply(ClientMapChange mapChange) {
                        return GetMapChange(mapChange.CountryId);
                    }
                })
                .toList();
    }

    public MapChange GetMapChange(String countryFromID) {
        return   Linq4j.asEnumerable(GetMap())
                .where(new Predicate1<MapChange>() {
                    @Override
                    public boolean apply(MapChange mapChange) {
                        return mapChange.CountryID.equals(countryFromID);
                    }
                })
                .first();
    }

    private void SetPlayerStatusToUndefined() {
        for (Player player : Players)
            player.PlayerStatus = PlayerStatus.Undefined;
    }

    private void UpdateGameStatus(Client_Response gameResponse) {
        CurrentPlayer = PlayerMapper.Map(gameResponse.gib_aktuellen_Spieler());
        CurrentGameStatus = MapSpielZustand(gameResponse.gib_aktuellen_Zustand());
        NumberOfUnitsToPlace = gameResponse.hinzufuegbare_Armeen;
        UpdatePlayerStatus();
    }

    private void UpdatePlayerStatus() {
        Enumerable<Land> lands = Linq4j.asEnumerable(_spiel.DieSpielwelt.gibLaender());

        for (Player player : Players)
        {
            boolean ownsAnyLand = lands.any(new Predicate1<Land>() {
                @Override
                public boolean apply(Land land) {
                    return land.gib_besitzer().Id == player.ID;
                }
            });
            if (!ownsAnyLand)
                player.PlayerStatus = PlayerStatus.Defeated;
        }
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

    private void PlaceUnits(String countryID, int units) {
        if (_spiel.Zustand != Spielzustaende.Armeen_hinzufuegen)
            return;

        Land land = _countryService.GetCountryById(countryID);

        Client_Response gameResponse = InteractWithGameLogic(units, land, null, false);
        UpdateGameStatus(gameResponse);
    }

    private Client_Response InteractWithGameLogic(int units, Land erstesLand, Land zweitesLand, boolean changeState) {
        SpielEreigniss ereignis = new SpielEreigniss(units, erstesLand, zweitesLand, changeState);
        Client_Response gameResponse = _spiel.zustandssteuerung(ereignis);
        CheckForError(gameResponse);
        return gameResponse;
    }

    private void CheckForError(Client_Response gameResponse) {
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
        List<Integer> list = new ArrayList<>(ints.length);
        for (int anInt : ints) {
            list.add(anInt);
        }
        return list;
    }

    private void SetPlayerStatusToPlaying() {
        Linq4j.asEnumerable(Players)
                .forEach(new Consumer<Player>() {
                    @Override
                    public void accept(Player player) {
                        player.PlayerStatus = PlayerStatus.Playing;
                    }
                });
    }
}