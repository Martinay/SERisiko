package ServerLogic;

import GameLogic.Land;

import java.util.HashMap;

class CountryMapper {

    static HashMap<Integer,Land> _countryMapping = new HashMap<Integer, Land>();

    public static void CreateCountryMapping(Land[] lands) {
        for (int i = 0; i<lands.length; i++)
            _countryMapping.put(i,lands[i]);
    }

    public static Land GetCountryById(String id) {
        return _countryMapping.get(id);
    }
}
