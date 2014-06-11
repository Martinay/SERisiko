package ServerLogic.Map;

import ServerLogic.Map.Interfaces.IMapFileReader;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.nio.file.Paths;
import java.util.Scanner;

public class MapFileReader implements IMapFileReader {

    @Override
    public String ReadMapFile() {
        StringBuilder builder = new StringBuilder();

        try {
            String path = Paths.get("").toAbsolutePath().toString() + "\\src\\main\\java\\ServerLogic\\Map\\map.txt"; // Possible that you have to change the Path in Netbeans

            Scanner in = new Scanner(new FileReader(path));

            while (in.hasNext())
            {
                builder.append(in.next());
            }
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        return builder.toString();
    }
}
