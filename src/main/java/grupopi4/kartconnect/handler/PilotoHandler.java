package grupopi4.kartconnect.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.MongoCollection;
import grupopi4.kartconnect.MongoDBConnection;
import grupopi4.kartconnect.model.Piloto;
import org.bson.types.ObjectId;

import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.mongodb.client.model.Filters.eq;

public class PilotoHandler implements HttpHandler {

    private final MongoCollection<Piloto> collection;
    private final ObjectMapper objectMapper;

    public PilotoHandler() {
        this.collection = MongoDBConnection.getDatabase().getCollection("pilotos", Piloto.class);
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
                    getPilotoById(exchange, id);
                } else {
                    getAllPilotos(exchange);
                }
            } else if ("POST".equalsIgnoreCase(method)) {
                createPiloto(exchange);
            } else if ("PUT".equalsIgnoreCase(method)) {
                if (pathParts.length == 4 && !pathParts[3].isEmpty()) {
                    String id = pathParts[3];
                    updatePiloto(exchange, id);
                } else {
                    sendResponse(exchange, 400, "{\"message\":\"ID inválido\"}");
                }
            } else if ("DELETE".equalsIgnoreCase(method)) {
                if (pathParts.length == 4 && !pathParts[3].isEmpty()) {
                    String id = pathParts[3];
                    deletePiloto(exchange, id);
                } else {
                    sendResponse(exchange, 400, "{\"message\":\"ID inválido\"}");
                }
            } else {
                // Método não suportado
                sendResponse(exchange, 405, "{\"message\":\"Método não permitido\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendResponse(exchange, 500, "{\"message\":\"Erro interno do servidor\"}");
        } finally {
            exchange.close();
        }
    }

    private void getAllPilotos(HttpExchange exchange) throws IOException {
        List<Piloto> pilotos = collection.find().into(new ArrayList<>());
        String response = objectMapper.writeValueAsString(pilotos);
        sendResponse(exchange, 200, response);
    }

    private void getPilotoById(HttpExchange exchange, String id) throws IOException {
        Piloto piloto = collection.find(eq("_id", new ObjectId(id))).first();
        if (piloto != null) {
            String response = objectMapper.writeValueAsString(piloto);
            sendResponse(exchange, 200, response);
        } else {
            sendResponse(exchange, 404, "{\"message\":\"Piloto não encontrado\"}");
        }
    }

    private void createPiloto(HttpExchange exchange) throws IOException {
        String body;
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody()))) {
            body = reader.lines().collect(Collectors.joining("\n"));
        }

        Piloto piloto = objectMapper.readValue(body, Piloto.class);

        collection.insertOne(piloto);
        String response = objectMapper.writeValueAsString(piloto);
        sendResponse(exchange, 201, response);
    }

    private void updatePiloto(HttpExchange exchange, String id) throws IOException {
        String body;
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody()))) {
            body = reader.lines().collect(Collectors.joining("\n"));
        }
        
        Piloto updatedPiloto = objectMapper.readValue(body, Piloto.class);
        updatedPiloto.setId(new ObjectId(id));

        collection.replaceOne(eq("_id", new ObjectId(id)), updatedPiloto);
        String response = objectMapper.writeValueAsString(updatedPiloto);
        sendResponse(exchange, 200, response);
    }

    private void deletePiloto(HttpExchange exchange, String id) throws IOException {
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