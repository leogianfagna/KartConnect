import model.Classificacao;

import java.net.*;
import java.io.*;
import com.fasterxml.jackson.databind.ObjectMapper;

public class GeradorServer {
    public static void main(String[] args) {

        final int port = 8080;

        try (ServerSocket serverSocket = new ServerSocket(port)) {

            System.out.println("Server is listening on port " + port);

            while (true) {
                Socket socket = serverSocket.accept();
                System.out.println("New client connected");

                BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));

                PrintWriter writer = new PrintWriter(socket.getOutputStream(), true);

                try {
                    int qtd = Integer.parseInt(reader.readLine());
                    Classificacao[] ret = Classificacao.gerarClassificacoes(qtd);

                    ObjectMapper mapper = new ObjectMapper();
                    String jsonData = mapper.writeValueAsString(ret);

                    writer.println(jsonData);
                    System.out.println("Sent classification data: " + jsonData);
                } catch (Exception e) {
                    System.out.println("Gerador exception: " + e.getMessage());
                    e.printStackTrace();
                }
            }
        } catch (IOException e) {
            System.out.println("Server exception: " + e.getMessage());
            e.printStackTrace();
        }
    }
}