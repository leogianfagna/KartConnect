package grupopi4.kartconnect.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.MongoCollection;
import grupopi4.kartconnect.MongoDBConnection;
import grupopi4.kartconnect.model.Classificacao;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class ClassificacaoHandler implements HttpHandler {

    private final MongoCollection<Classificacao> collection;
    private final ObjectMapper objectMapper;

    public ClassificacaoHandler() {
        this.collection = MongoDBConnection.getDatabase().getCollection("Classificacoes", Classificacao.class);
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Configurar CORS
        setCorsHeaders(exchange);

        String method = exchange.getRequestMethod();

        try {
            if ("OPTIONS".equalsIgnoreCase(method)) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if ("GET".equalsIgnoreCase(method)) {
                getAllClassificacoes(exchange);
            }
            else if ("POST".equalsIgnoreCase(method)) {
                createClassificacao(exchange);
            }
            else {
                sendResponse(exchange, 405, "{\"message\":\"Método não permitido\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            sendResponse(exchange, 500, "{\"message\":\"Erro interno do servidor\"}");
        } finally {
            exchange.close();
        }
    }

    private void getAllClassificacoes(HttpExchange exchange) throws IOException {
        List<Classificacao> classificacoes = collection.find().into(new ArrayList<>());
        Collections.sort(classificacoes, (c1, c2) -> Long.compare(c1.getTempoEmMilissegundos(), c2.getTempoEmMilissegundos()));
        if (classificacoes.isEmpty()) {
            System.out.println("Nenhuma classificacao encontrada.");
        } else {
            System.out.println("Classificacoes recuperados do banco de dados:");
            for (Classificacao classificacao : classificacoes) {
                System.out.println(classificacao);
            }
        }
        String response = objectMapper.writeValueAsString(classificacoes);
        sendResponse(exchange, 200, response);
    }

    private void createClassificacao(HttpExchange exchange) throws IOException {
        String body;
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody()))) {
            body = reader.lines().collect(Collectors.joining("\n"));
        }

        Classificacao classificacao = objectMapper.readValue(body, Classificacao.class);
        collection.insertOne(classificacao);
        String response = objectMapper.writeValueAsString(classificacao);
        sendResponse(exchange, 201, response);
    }
    

    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        byte[] bytes = response.getBytes("UTF-8");
        exchange.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }

    private void setCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*"); // URL do front
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
    }
}
