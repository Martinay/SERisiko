package ServerLogicTests;

import GameLogic.Kontinent;
import ServerLogic.Map.Interfaces.IMapParser;
import junit.framework.TestCase;

import java.util.Collection;

public class MapParserTests extends TestCase {

    public void testMap() throws Exception {

        //Arrange

        //Act
        IMapParser mapParser = new ServerLogic.Map.MapParser();
        Collection<Kontinent> collection = mapParser.Parse("A5:A6,B2;A6:A5,B1;;B1:A6,A5,B2;B2:B1;");

        //Assert
        assertEquals(collection.size(),2);
    }
}