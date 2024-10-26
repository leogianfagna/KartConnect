package grupopi4.kartconnect.model;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.LinkedList;
import java.util.Queue;

public class Teclado {
    private static BufferedReader teclado = new BufferedReader(new InputStreamReader(System.in));
    private static Queue<String> inputQueue = new LinkedList<>();

    public static void setInput(String input) {
        String[] inputs = input.split("\n");
        for (String str : inputs) {
            inputQueue.add(str);
        }
    }

    public static String getString() {
        String ret = null;

        try {
            if (!inputQueue.isEmpty()) {
                ret = inputQueue.poll();
            } else {
                ret = teclado.readLine();
            }
        } catch (IOException erro) {
            System.err.println("Erro ao ler a entrada: " + erro.getMessage());
        }

        return ret;
    }

    // Mantenha os métodos restantes iguais, mas substitua o teclado.readLine() por inputQueue.poll()
    // na implementação de cada método para permitir entrada simulada
    public static int getInt() throws Exception {
        int ret = 0;

        try {
            if (!inputQueue.isEmpty()) {
                ret = Integer.parseInt(inputQueue.poll());
            } else {
                ret = Integer.parseInt(teclado.readLine());
            }
        } catch (IOException erro) {
            System.err.println("Erro ao ler a entrada: " + erro.getMessage());
        } catch (NumberFormatException erro) {
            throw new Exception("Int inválido!");
        }

        return ret;
    }

    // Repita o mesmo padrão para os outros métodos
}
