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
            GeradorClassificacao.gerarClassificacoes(-100);

        } catch (Exception erro) {
            erro.printStackTrace();
        }
    }
}