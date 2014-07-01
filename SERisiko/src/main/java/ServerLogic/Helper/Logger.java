package ServerLogic.Helper;

/**
 * Created by m.ayasse on 26.06.2014.
 */
public class Logger {
    public static boolean IsActivated = true;

    public static void Write(String message)
    {
        if (!IsActivated)
            return;

        System.out.println("ServerLogik: " + message);
    }
}
