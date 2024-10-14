package grupopi4.kartconnect.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.MongoCollection;
import grupopi4.kartconnect.MongoDBConnection;
import grupopi4.kartconnect.model.Usuario;
import org.bson.types.ObjectId;
import org.mindrot.jbcrypt.BCrypt;

import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.mongodb.client.model.Filters.eq;

public class UsuarioHandler implements HttpHandler {

    private final MongoCollection<Usuario> collection;
    private final ObjectMapper objectMapper;

    public UsuarioHandler() {
        this.collection = MongoDBConnection.getDatabase().getCollection("usuarios", Usuario.class);
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
                    getUsuarioById(exchange, id);
                } else {
                    getAllUsuarios(exchange);
                }
            } else if ("POST".equalsIgnoreCase(method)) {
                createUsuario(exchange);
            } else if ("PUT".equalsIgnoreCase(method)) {
                if (pathParts.length == 4 && !pathParts[3].isEmpty()) {
                    String id = pathParts[3];
                    updateUsuario(exchange, id);
                } else {
                    sendResponse(exchange, 400, "{\"message\":\"ID inválido\"}");
                }
            } else if ("DELETE".equalsIgnoreCase(method)) {
                if (pathParts.length == 4 && !pathParts[3].isEmpty()) {
                    String id = pathParts[3];
                    deleteUsuario(exchange, id);
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

    private void getAllUsuarios(HttpExchange exchange) throws IOException {
        List<Usuario> usuarios = collection.find().into(new ArrayList<>());
        String response = objectMapper.writeValueAsString(usuarios);
        sendResponse(exchange, 200, response);
    }

    private void getUsuarioById(HttpExchange exchange, String id) throws IOException {
        Usuario usuario = collection.find(eq("_id", new ObjectId(id))).first();
        if (usuario != null) {
            String response = objectMapper.writeValueAsString(usuario);
            sendResponse(exchange, 200, response);
        } else {
            sendResponse(exchange, 404, "{\"message\":\"Usuário não encontrado\"}");
        }
    }

    private void createUsuario(HttpExchange exchange) throws IOException {
        String body = new BufferedReader(new InputStreamReader(exchange.getRequestBody()))
                .lines().collect(Collectors.joining("\n"));
        Usuario usuario = objectMapper.readValue(body, Usuario.class);

        // criptografia
        String senhaCriptografada = BCrypt.hashpw(usuario.getSenha(), BCrypt.gensalt());
        usuario.setSenha(senhaCriptografada);

        collection.insertOne(usuario);
        String response = objectMapper.writeValueAsString(usuario);
        sendResponse(exchange, 201, response);
    }

    private void updateUsuario(HttpExchange exchange, String id) throws IOException {
        String body = new BufferedReader(new InputStreamReader(exchange.getRequestBody()))
                .lines().collect(Collectors.joining("\n"));
        Usuario updatedUsuario = objectMapper.readValue(body, Usuario.class);
        updatedUsuario.setId(new ObjectId(id));

        // criptografia ao atualizar senha
        if (updatedUsuario.getSenha() != null && !updatedUsuario.getSenha().isEmpty()) {
            String senhaCriptografada = BCrypt.hashpw(updatedUsuario.getSenha(), BCrypt.gensalt());
            updatedUsuario.setSenha(senhaCriptografada);
        }

        collection.replaceOne(eq("_id", new ObjectId(id)), updatedUsuario);
        String response = objectMapper.writeValueAsString(updatedUsuario);
        sendResponse(exchange, 200, response);
    }

    private void deleteUsuario(HttpExchange exchange, String id) throws IOException {
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