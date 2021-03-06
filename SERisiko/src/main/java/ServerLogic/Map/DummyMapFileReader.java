package ServerLogic.Map;

import ServerLogic.Map.Interfaces.IMapFileReader;

/**
 * Created by Martin on 7/15/2014.
 */
public class DummyMapFileReader implements IMapFileReader  {
    @Override
    public String ReadMapFile() {
        return "HEAD:extraUnits=3;" +
                "A1:A2,P13;" +
                "A2:A1,A3;" +
                "A3:A2,A4,A5;" +
                "A4:A3,A5;" +
                "A5:A3,A4,A6;" +
                "A6:A5,B1;" +
                ";" +
                "HEAD:extraUnits=5;" +
                "B1:A6,B2,B3,C1;" +
                "B2:B1,B3,B4,C4;" +
                "B3:B1,B2,B4,P3;" +
                "B4:B2,B3,B5;" +
                "B5:B4,C5,P1;" +
                "C1:C2,B1,P14;" +
                "C2:C1,C3,C4;" +
                "C3:C2,C4,C5;" +
                "C4:C2,C3,C5,B2;" +
                "C5:C3,C4,B5;" +
                ";" +
                "HEAD:extraUnits=4;" +
                "D1:D2,D7,P13;" +
                "D2:D1,D3;" +
                "D3:D2,D4,P15;" +
                "D4:D3,D5;" +
                "D5:D4,D6;" +
                "D6:D5,D7;" +
                "D7:D1,D6,P12;" +
                ";" +
                "HEAD:extraUnits=2;" +
                "E1:E2,E3,P7;" +
                "E2:E1,E3,E4;" +
                "E3:E1,E2,E4;" +
                "E4:E2,E3,P11;" +
                ";" +
                "HEAD:extraUnits=8;" +
                "P1:P2,B5;" +
                "P2:P1,P3,P4,P5,P8,P9;" +
                "P3:P2,P4,P6,B3;" +
                "P4:P2,P3,P5,P6;" +
                "P5:P2,P4,P6;" +
                "P6:P3,P4,P5;" +
                "P7:P8,E1;" +
                "P8:P2,P7,P9,P10;" +
                "P9:P2,P8,P10,P13;" +
                "P10:P8,P9,P11,P12;" +
                "P11:P10,P12,E4;" +
                "P12:P10,P11,D7;" +
                "P13:P9,P14,P15,A1,D1;" +
                "P14:C1,P13;" +
                "P15:P13,D3;" +
                ";";
    }
}
