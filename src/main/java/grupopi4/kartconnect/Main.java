package grupopi4.kartconnect;

import com.sun.net.httpserver.HttpServer;
import grupopi4.kartconnect.handler.KartodromoHandler;
import grupopi4.kartconnect.handler.ClassificacaoHandler;
import grupopi4.kartconnect.handler.PilotoHandler;

import java.io.IOException;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) {
        try {
            int port = 8080;

            HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

            server.createContext("/api/kartodromos", new KartodromoHandler());
            server.createContext("/api/classificacoes", new ClassificacaoHandler());
            server.createContext("/api/participantes", new PilotoHandler());

            server.setExecutor(null);

            System.out.println("Servidor iniciado na porta " + port);
            server.start();
        } catch (IOException e) {
            e.printStackTrace();
            System.err.println("Falha ao iniciar o servidor.");
        }
    }
}