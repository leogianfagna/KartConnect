package grupopi4.kartconnect.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.MongoCollection;
import grupopi4.kartconnect.MongoDBConnection;
import grupopi4.kartconnect.model.Classificacao;
import org.bson.types.ObjectId;

import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.mongodb.client.model.Filters.eq;

public class ClassificacaoHandler implements HttpHandler {

    private final MongoCollection<Classificacao> collection;
    private final ObjectMapper objectMapper;

    public ClassificacaoHandler() {
        this.collection = MongoDBConnection.getDatabase().getCollection("classificacoes", Classificacao.class);
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // configurar CORS
        setCorsHeaders(exchange);

        String method = exchange.getRequestMethod();
        URI requestURI = exchange.getRequestURI();
        String path = requestURI.getPath();
        String[] pathParts = path.split("/");

        try {
            if ("OPTIONS".equalsIgnoreCase(method)) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if ("GET".equalsIgnoreCase(method)) {
                if (pathParts.length == 4 && !pathParts[3].isEmpty()) {
                    String id = pathParts[3];
                    getClassificacaoById(exchange, id);
                } else {
                    getAllClassificacoes(exchange);
                }
            } else if ("POST".equalsIgnoreCase(method)) {
                createClassificacao(exchange);
            } else if ("PUT".equalsIgnoreCase(method)) {
                if (pathParts.length == 4 && !pathParts[3].isEmpty()) {
                    String id = pathParts[3];
                    updateClassificacao(exchange, id);
                } else {
                    sendResponse(exchange, 400, "{\"message\":\"ID inválido\"}");
                }
            } else if ("DELETE".equalsIgnoreCase(method)) {
                if (pathParts.length == 4 && !pathParts[3].isEmpty()) {
                    String id = pathParts[3];
                    deleteClassificacao(exchange, id);
                } else {
                    sendResponse(exchange, 400, "{\"message\":\"ID inválido\"}");
                }
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

    private void getAllClassificacoes(HttpExchange exchange) throws IOException {
        List<Classificacao> classificacoes = collection.find().into(new ArrayList<>());
        String response = objectMapper.writeValueAsString(classificacoes);
        sendResponse(exchange, 200, response);
    }

    private void getClassificacaoById(HttpExchange exchange, String id) throws IOException {
        Classificacao classificacao = collection.find(eq("_id", new ObjectId(id))).first();
        if (classificacao != null) {
            String response = objectMapper.writeValueAsString(classificacao);
            sendResponse(exchange, 200, response);
        } else {
            sendResponse(exchange, 404, "{\"message\":\"Classificação não encontrada\"}");
        }
    }

    private void createClassificacao(HttpExchange exchange) throws IOException {
        String body = new BufferedReader(new InputStreamReader(exchange.getRequestBody()))
                .lines().collect(Collectors.joining("\n"));
        Classificacao classificacao = objectMapper.readValue(body, Classificacao.class);
        collection.insertOne(classificacao);
        String response = objectMapper.writeValueAsString(classificacao);
        sendResponse(exchange, 201, response);
    }

    private void updateClassificacao(HttpExchange exchange, String id) throws IOException {
        String body = new BufferedReader(new InputStreamReader(exchange.getRequestBody()))
                .lines().collect(Collectors.joining("\n"));
        Classificacao updatedClassificacao = objectMapper.readValue(body, Classificacao.class);
        updatedClassificacao.setId(new ObjectId(id));
        collection.replaceOne(eq("_id", new ObjectId(id)), updatedClassificacao);
        String response = objectMapper.writeValueAsString(updatedClassificacao);
        sendResponse(exchange, 200, response);
    }

    private void deleteClassificacao(HttpExchange exchange, String id) throws IOException {
        collection.deleteOne(eq("_id", new ObjectId(id)));
        sendResponse(exchange, 204, "");
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
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*"); // url do front
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
    }
}
