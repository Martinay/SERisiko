package ServerLogic;

import GameLogic.Kontinent;
import GameLogic.Land;

import java.util.HashMap;

class CountryMapper {

    static HashMap<String, Land> _countryMapping = new HashMap<>();

    public static void CreateCountryMapping(Kontinent[] kontinents) {
        for (Kontinent continent : kontinents) {
            Land[] lands = continent.GETLands();
            for (int i = 0; i<lands.length; i++)
                _countryMapping.put(String.valueOf(i),lands[i]);
        }

    }

    public static Land GetCountryById(String id) {
        return _countryMapping.get(id);
    }
}
