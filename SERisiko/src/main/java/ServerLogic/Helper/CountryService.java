package ServerLogic.Helper;

import GameLogic.Kontinent;
import GameLogic.Land;

import java.util.HashMap;

public class CountryService {

    HashMap<String, Land> _countryMapping = new HashMap<>();

    public void Initialize(Kontinent[] kontinents) {
        for (Kontinent continent : kontinents) {
            Land[] lands = continent.GETLands();
            for (int i = 0; i<lands.length; i++)
                _countryMapping.put(lands[i].gib_bezeichnung(),lands[i]);
        }

    }

    public Land GetCountryById(String id) {
        return _countryMapping.get(id);
    }

}
