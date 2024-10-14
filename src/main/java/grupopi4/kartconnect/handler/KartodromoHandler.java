package grupopi4.kartconnect.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.MongoCollection;
import grupopi4.kartconnect.MongoDBConnection;
import grupopi4.kartconnect.model.Kartodromo;
import org.bson.types.ObjectId;

import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.mongodb.client.model.Filters.eq;

public class KartodromoHandler implements HttpHandler {

    private final MongoCollection<Kartodromo> collection;
    private final ObjectMapper objectMapper;

    public KartodromoHandler() {
        this.collection = MongoDBConnection.getDatabase().getCollection("kartodromos", Kartodromo.class);
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
                    getKartodromoById(exchange, id);
                } else {
                    getAllKartodromos(exchange);
                }
            } else if ("POST".equalsIgnoreCase(method)) {
                createKartodromo(exchange);
            } else if ("PUT".equalsIgnoreCase(method)) {
                if (pathParts.length == 4 && !pathParts[3].isEmpty()) {
                    String id = pathParts[3];
                    updateKartodromo(exchange, id);
                } else {
                    sendResponse(exchange, 400, "{\"message\":\"ID inválido\"}");
                }
            } else if ("DELETE".equalsIgnoreCase(method)) {
                if (pathParts.length == 4 && !pathParts[3].isEmpty()) {
                    String id = pathParts[3];
                    deleteKartodromo(exchange, id);
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

    private void getAllKartodromos(HttpExchange exchange) throws IOException {
        List<Kartodromo> kartodromos = collection.find().into(new ArrayList<>());
        String response = objectMapper.writeValueAsString(kartodromos);
        sendResponse(exchange, 200, response);
    }

    private void getKartodromoById(HttpExchange exchange, String id) throws IOException {
        Kartodromo kartodromo = collection.find(eq("_id", new ObjectId(id))).first();
        if (kartodromo != null) {
            String response = objectMapper.writeValueAsString(kartodromo);
            sendResponse(exchange, 200, response);
        } else {
            sendResponse(exchange, 404, "{\"message\":\"Kartódromo não encontrado\"}");
        }
    }

    private void createKartodromo(HttpExchange exchange) throws IOException {
        String body = new BufferedReader(new InputStreamReader(exchange.getRequestBody()))
                .lines().collect(Collectors.joining("\n"));
        Kartodromo kartodromo = objectMapper.readValue(body, Kartodromo.class);
        collection.insertOne(kartodromo);
        String response = objectMapper.writeValueAsString(kartodromo);
        sendResponse(exchange, 201, response);
    }

    private void updateKartodromo(HttpExchange exchange, String id) throws IOException {
        String body = new BufferedReader(new InputStreamReader(exchange.getRequestBody()))
                .lines().collect(Collectors.joining("\n"));
        Kartodromo updatedKartodromo = objectMapper.readValue(body, Kartodromo.class);
        updatedKartodromo.setId(new ObjectId(id));
        collection.replaceOne(eq("_id", new ObjectId(id)), updatedKartodromo);
        String response = objectMapper.writeValueAsString(updatedKartodromo);
        sendResponse(exchange, 200, response);
    }

    private void deleteKartodromo(HttpExchange exchange, String id) throws IOException {
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