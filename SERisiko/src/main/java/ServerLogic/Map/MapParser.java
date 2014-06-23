package ServerLogic.Map;

import GameLogic.Kontinent;
import GameLogic.Land;
import ServerLogic.Map.Interfaces.IMapParser;
import net.hydromatic.linq4j.Grouping;
import net.hydromatic.linq4j.Linq4j;
import net.hydromatic.linq4j.function.Function1;

import java.util.*;
import java.util.function.BiConsumer;
import java.util.function.Consumer;

public class MapParser implements IMapParser {
    private Mapper _mapper = new Mapper();

    @Override
    public Collection<Kontinent> Parse(String content) {
        String[] lines = content.split(";");

        List<List<String>> continentLines = SplitIntoContinents(lines);

        List<ParseCountry> continents = GetCountriesWithContinent(continentLines);

        return _mapper.Map(continents);
    }

    private List<ParseCountry> GetCountriesWithContinent(List<List<String>> continentLines) {
        List<ParseCountry> countries = new LinkedList<>();


        for (int i = 0; i < continentLines.size(); i++) {
            List<String> lines = continentLines.get(i);
            ParseContinent parseContinent = ParseHeaderToParseContinent(lines.get(0));

            for (int j = 1; j < lines.size(); j++) {
                countries.add(ParseLand(lines.get(j), parseContinent));
            }
        }

        return countries;
    }

    private ParseContinent ParseHeaderToParseContinent(String headerLine) {
        ParseContinent continent = new ParseContinent();

        if (!headerLine.matches("^HEAD:.*"))
            throw new RuntimeException("Ungültiger HEADER in map.txt");

        String extraUnits = headerLine.replaceFirst("HEAD:extraUnits=","");
        continent.extraUnits = Integer.parseInt(extraUnits);

        return continent;
    }

    private ParseCountry ParseLand(String line, ParseContinent parseContinent) {
        ParseCountry country = new ParseCountry();

        String[] firstSplit = line.split(":");
        String neighborsString = firstSplit[1].replaceAll(";", "");
        String[] neighbors = neighborsString.split(",");

        Collections.addAll(country.Neighbors, neighbors);

        country.continent = parseContinent;
        country.id = firstSplit[0];
        return country;
    }

    private List<List<String>> SplitIntoContinents(String[] lines) {
        List<List<String>> continentLines = new LinkedList<>();

        List<String> currentContinentLines = new LinkedList<>();

        for (String line : lines) {
            if (line.equals("")) {
                continentLines.add(currentContinentLines);
                currentContinentLines = new LinkedList<>();
                continue;
            }

            currentContinentLines.add(line);
        }

        continentLines.add(currentContinentLines);
        return continentLines;
    }

    private class ParseCountry {
        List<String> Neighbors = new LinkedList<>();
        String id;
        ParseContinent continent;
    }

    private class ParseContinent {
        int id;
        int extraUnits;
    }

    private class Mapper {

        private Collection<Kontinent> Map(List<ParseCountry> countries) {
            HashMap<Land, ParseCountry> mappedCountries = MapCountries(countries);
            AddNeighbours(mappedCountries);

            return AddToContinents(mappedCountries);
        }

        private Collection<Kontinent> AddToContinents(final HashMap<Land, ParseCountry> mappedCountries) {
            final Collection<Kontinent> continents = new LinkedList<>();

            final HashMap<ParseCountry, Land> parseCountryLandHashMap = new HashMap<>();

            mappedCountries.forEach(new BiConsumer<Land, ParseCountry>() {
                @Override
                public void accept(Land land, ParseCountry parseCountry) {
                    parseCountryLandHashMap.put(parseCountry, land);
                }
            });

            Linq4j.asEnumerable(mappedCountries.values())
                    .groupBy(new Function1<ParseCountry, Object>() {
                        @Override
                        public Object apply(ParseCountry a0) {
                            return a0.continent;
                        }
                    })
                    .forEach(new Consumer<Grouping<Object, ParseCountry>>() {
                        @Override
                        public void accept(Grouping<Object, ParseCountry> parseCountries) {

                            final Kontinent continent = new Kontinent(parseCountries.first().continent.extraUnits);
                            parseCountries.forEach(new Consumer<ParseCountry>() {
                                @Override
                                public void accept(ParseCountry parseCountry) {
                                    continent.AddLand(parseCountryLandHashMap.get(parseCountry));
                                }
                            });
                            continents.add(continent);
                        }
                    });

            return continents;
        }

        private void AddNeighbours(HashMap<Land, ParseCountry> values) {
            HashMap<String, Land> stringCountryMapping = new HashMap<>();
            for (Land country : values.keySet()) {
                stringCountryMapping.put(country.gib_bezeichnung(), country);
            }

            for (Map.Entry<Land, ParseCountry> set : values.entrySet()) {
                List<Land> neighbors = new LinkedList<>();
                for (String neighbor : set.getValue().Neighbors) {
                    neighbors.add(stringCountryMapping.get(neighbor));
                }
                set.getKey().setze_angrenzende_Laender(neighbors.toArray(new Land[neighbors.size() - 1]));
            }
        }

        private HashMap<Land, ParseCountry> MapCountries(List<ParseCountry> mappedContinent) {
            HashMap<Land, ParseCountry> mapping = new HashMap<>();

            for (ParseCountry parseCountry : mappedContinent) {
                Land country = new Land(parseCountry.id);
                mapping.put(country, parseCountry);
            }

            return mapping;
        }
    }
}
