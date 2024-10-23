package grupopi4.kartconnect.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;

import grupopi4.kartconnect.MongoDBConnection;
import grupopi4.kartconnect.model.Classificacao;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import org.bson.conversions.Bson;

import java.io.*;
import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

public class ClassificacaoHandler implements HttpHandler {

    private final MongoCollection<Classificacao> collection;
    private final ObjectMapper objectMapper;

    public ClassificacaoHandler() {
        this.collection = MongoDBConnection.getDatabase().getCollection("Classificacoes", Classificacao.class);
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {

        setCorsHeaders(exchange);

        String method = exchange.getRequestMethod();
        URI requestURI = exchange.getRequestURI();
        String query = requestURI.getQuery();

        try {
            if ("OPTIONS".equalsIgnoreCase(method)) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("GET".equalsIgnoreCase(method)) {
                if (query != null) {
                    Bson filter = Filters.empty();

                    if (query != null) {
                        // Converte a query string em um mapa de parâmetros
                        Map<String, String> queryParams = queryToMap(query);

                        // Constrói o filtro com base nos parâmetros, decodificando as strings
                        List<Bson> conditions = new ArrayList<>();
                        if (queryParams.containsKey("nome")) {
                            String nomeDecoded = URLDecoder.decode(queryParams.get("nome"),
                                    StandardCharsets.UTF_8.toString());
                            conditions.add(Filters.eq("nome", nomeDecoded));
                        }
                        if (queryParams.containsKey("estado")) {
                            String estadoDecoded = URLDecoder.decode(queryParams.get("estado"),
                                    StandardCharsets.UTF_8.toString());
                            conditions.add(Filters.eq("estado", estadoDecoded));
                        }
                        if (queryParams.containsKey("kartodromo")) {
                            String kartodromoDecoded = URLDecoder.decode(queryParams.get("kartodromo"),
                                    StandardCharsets.UTF_8.toString());
                            conditions.add(Filters.eq("kartodromo", kartodromoDecoded));
                        }

                        // Se houver condições, aplica o filtro combinado
                        if (!conditions.isEmpty()) {
                            filter = Filters.and(conditions);
                        }
                    }

                    getClassificacoesByFilter(exchange, filter);
                } else {
                    getAllClassificacoes(exchange);
                }
            } else if ("POST".equalsIgnoreCase(method)) {
                createClassificacao(exchange);
            } else {
                sendResponse(exchange, 405, "{\"message\":\"Método não permitido\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            sendResponse(exchange, 500, "{\"message\":\"Erro interno do servidor\"}");
        } finally {
            exchange.close();
        }
    }

    private void getClassificacoesByFilter(HttpExchange exchange, Bson filter) throws IOException {
        List<Classificacao> classificacoes = collection.find(filter).into(new ArrayList<>());
        Collections.sort(classificacoes,
                (c1, c2) -> Long.compare(c1.getTempoEmMilissegundos(), c2.getTempoEmMilissegundos()));

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

    private void getAllClassificacoes(HttpExchange exchange) throws IOException {
        List<Classificacao> classificacoes = collection.find().into(new ArrayList<>());
        Collections.sort(classificacoes,
                (c1, c2) -> Long.compare(c1.getTempoEmMilissegundos(), c2.getTempoEmMilissegundos()));
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
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
    }

    private Map<String, String> queryToMap(String query) {
        Map<String, String> result = new HashMap<>();
        String[] pairs = query.split("&");

        for (String pair : pairs) {
            String[] keyValue = pair.split("=");
            try {
                // Decodifica o valor para garantir que os espaços e caracteres especiais sejam tratados
                String key = URLDecoder.decode(keyValue[0], StandardCharsets.UTF_8.toString());
                String value = keyValue.length > 1 ? URLDecoder.decode(keyValue[1], StandardCharsets.UTF_8.toString()) : "";
                result.put(key, value);
            } catch (Exception e) {
                e.printStackTrace();  // Captura e trata possíveis erros de decodificação
            }
        }
        return result;
    }
}
