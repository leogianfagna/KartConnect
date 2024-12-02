package grupopi4.kartconnect;

import java.net.ServerSocket;
import java.net.Socket;

public class GeradorServer {
    public static void main(String[] args) {

        final int port = 8000;

        try {
            ServerSocket server = new ServerSocket(port);
            System.out.println("Servidor escutando na porta: " + port);

            while (true) {
                //esperando a conexao
                Socket conexao = server.accept();
                System.out.println("Novo cliente: " + conexao.getRemoteSocketAddress());

                ThreadClient thread = new ThreadClient(conexao);
                thread.start();
            }
        }
        catch (Exception erro) { System.err.println("Erro servidor: " + erro); }

    }
}