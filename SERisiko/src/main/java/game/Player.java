package Game;

/**
 *
 * @author Steve Kliebisch
 */
public class Player {
    
    private String name;
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String name() {
        return this.name;
    }
    
    
    
    @Override
    public String toString() {
        return this.name;
    }
}
