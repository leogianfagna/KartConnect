package grupopi4.kartconnect.model;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;

public class Teclado {
    private static BufferedReader teclado = new BufferedReader(new InputStreamReader(System.in));

    public static String getString(){
        String ret = null;

        try{
            ret = teclado.readLine();
        } catch (IOException erro) {}

        return ret;
    }

    public static byte getByte() throws Exception {
        byte ret = (byte) 0;

        try{
            ret = Byte.parseByte(teclado.readLine());
        } catch (IOException erro) {}
        catch (NumberFormatException erro) {
            throw new Exception("Byte inválido!");
        }

        return ret;
    }

    public static short getShort() throws Exception {
        short ret = (short) 0;

        try{
            ret = Short.parseShort(teclado.readLine());
        } catch (IOException erro) {}
        catch (NumberFormatException erro) {
            throw new Exception("Short inválido!");
        }

        return ret;
    }

    public static int getInt() throws Exception {
        int ret = 0;

        try{
            ret = Integer.parseInt(teclado.readLine());
        } catch (IOException erro) {}
        catch (NumberFormatException erro) {
            throw new Exception("Int inválido!");
        }

        return ret;
    }

    public static long getLong() throws Exception {
        long ret = (long) 0;

        try{
            ret = Long.parseLong(teclado.readLine());
        } catch (IOException erro) {}
        catch (NumberFormatException erro) {
            throw new Exception("Long inválido!");
        }

        return ret;
    }

    public static float getFloat() throws Exception {
        float ret = (float) 0.0;

        try{
            ret = Float.parseFloat(teclado.readLine());
        } catch (IOException erro) {}
        catch (NumberFormatException erro) {
            throw new Exception("Float inválido!");
        }

        return ret;
    }

    public static double getDouble() throws Exception {
        double ret = (double) 0.0;

        try{
            ret = Double.parseDouble(teclado.readLine());
        } catch (IOException erro) {}
        catch (NumberFormatException erro) {
            throw new Exception("Double inválido!");
        }

        return ret;
    }

    public static char getChar() throws Exception {
        char ret = ' ';

        try {
            String str = teclado.readLine();

            if (str == null)
                throw new Exception("Char inválido!");
            if (str.length() != 1)
                throw new Exception("Char inválido!");

            ret = str.charAt(0);
        } catch (IOException erro) {}

        return ret;
    }

    public static boolean getBoolean() throws Exception {
        boolean ret = false;

        try{
            String str = teclado.readLine();

            if (str==null)
                throw new Exception("Boolean inválido!");
            if (!str.equals("true") && !str.equals("false"))
                throw new Exception("Boolean inválido!");

            ret = Boolean.parseBoolean(str);
        } catch (IOException erro) {}

        return ret;
    }
}
