package grupopi4.kartconnect;

import java.io.*;
import java.net.Socket;
import com.fasterxml.jackson.databind.ObjectMapper;
import grupopi4.kartconnect.model.Classificacao;

//Somente para teste

public class GeradorClientTeste {

    public static void main(String[] args) {
        final String host = "localhost";
        final int port = 8080;

        try (Socket socket = new Socket(host, port)) {
            System.out.println("Connected to server on port " + port);

            // Send `qtd` to the server
            int qtd = 5; // Define the quantity you want to generate
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
            out.println(qtd);

            // Receive JSON data from the server
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            String jsonData = in.readLine();
            System.out.println("Received JSON data: " + jsonData);

            // Convert JSON data to array of Classificacao objects
            ObjectMapper mapper = new ObjectMapper();
            Classificacao[] classificacoes = mapper.readValue(jsonData, Classificacao[].class);

            // Print received classifications
            System.out.println("Received classifications:");
            for (Classificacao classificacao : classificacoes) {
                System.out.println(classificacao);
            }

        } catch (IOException e) {
            System.out.println("Client exception: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
