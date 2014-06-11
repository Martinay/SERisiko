package ServerLogic.Map.Interfaces;

import GameLogic.Kontinent;

public interface IMapParser {
    java.util.Collection<Kontinent> Parse(String content);
}
