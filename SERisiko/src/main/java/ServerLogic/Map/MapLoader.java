package ServerLogic.Map;

import GameLogic.Kontinent;
import ServerLogic.Map.Interfaces.IMapFileReader;
import ServerLogic.Map.Interfaces.IMapLoader;
import ServerLogic.Map.Interfaces.IMapParser;

import java.util.Collection;

public class MapLoader implements IMapLoader {

    IMapFileReader _fileReader;
    IMapParser _mapParser;

    public MapLoader() {
        _fileReader = new DummyMapFileReader();
        _mapParser = new MapParser();
    }

    @Override
    public Collection<Kontinent> GetKontinets()
    {
        String fileContent = _fileReader.ReadMapFile();
        return _mapParser.Parse(fileContent);
    }
}
