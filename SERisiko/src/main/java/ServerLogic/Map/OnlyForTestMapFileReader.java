package ServerLogic.Map;

import ServerLogic.Map.Interfaces.IMapFileReader;

/**
 * Created by m.ayasse on 16.07.2014.
 */
public class OnlyForTestMapFileReader implements IMapFileReader {
    @Override
    public String ReadMapFile() {
        return "HEAD:extraUnits=4;" +
                " A1:A2;" +
                " A2:A1;" +
                ";";
    }
}
