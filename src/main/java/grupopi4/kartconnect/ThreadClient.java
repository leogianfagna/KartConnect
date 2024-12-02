package grupopi4.kartconnect;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

import com.fasterxml.jackson.databind.ObjectMapper;

import grupopi4.kartconnect.model.Classificacao;


class ClientHandler extends Thread {
    private final Socket socket;

    public ClientHandler(Socket socket) {
        this.socket = socket;
    }

    @Override
    public void run() {
        try (
            BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter writer = new PrintWriter(socket.getOutputStream(), true)
        ) {
            int qtd = Integer.parseInt(reader.readLine());

            for (int i = 0; i < qtd; i++) {
                Classificacao classificacao = Classificacao.gerarClassificacao();
                ObjectMapper mapper = new ObjectMapper();
                String jsonData = mapper.writeValueAsString(classificacao);
                writer.println(jsonData); // Envia cada classificação
            }

            writer.println("END"); // Indica o fim da transmissão
            System.out.println("Processed " + qtd + " classifications for a client.");
        } catch (Exception e) {
            System.err.println("Client handler exception: " + e.getMessage());
        } finally {
            try {
                socket.close();
            } catch (IOException e) {
                System.err.println("Error closing socket: " + e.getMessage());
            }
        }
    }
}