package grupopi4.kartconnect;

import com.fasterxml.jackson.databind.ObjectMapper;
import grupopi4.kartconnect.model.Classificacao;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class GeradorServer {
    public static void main(String[] args) {

        final int port = 8000;

        try (ServerSocket serverSocket = new ServerSocket(port)) {

            System.out.println("\nServer listening on port " + port);

            while (true) {
                Socket conexao = serverSocket.accept();
                System.out.println("New client connected");

                BufferedReader reader = new BufferedReader(new InputStreamReader(conexao.getInputStream()));
                PrintWriter writer = new PrintWriter(conexao.getOutputStream());

                //IMPLEMENTAR THREADS PARA A ENTREGA
                

                try {
                    int qtd = Integer.parseInt(reader.readLine());
                    /*for (int i = 0; i < qtd; i++) {
                        Classificacao c = Classificacao.gerarClassificacoes();
                        
                        ObjectMapper mapper = new ObjectMapper();
                        String classificacaoJson = mapper.writeValueAsString(c);
                        writer.println(classificacaoJson);
                        System.out.println("Sent Classificacao data: " + classificacaoJson);
                    }*/
                    Classificacao[] ret = Classificacao.gerarClassificacoes(qtd);

                    ObjectMapper mapper = new ObjectMapper();
                    String jsonData = mapper.writeValueAsString(ret);
                    
                    writer.println(jsonData);
                    writer.flush();
                    System.out.println("Sent Classificacao data: " + jsonData);
                } catch (Exception e) {
                    System.err.println("Gerador exception: " + e.getMessage());
                }
            }
        } catch (IOException e) {
            System.err.println("Gerador exception: " + e.getMessage());
        }
    }
}