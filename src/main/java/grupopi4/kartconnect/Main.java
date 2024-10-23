package grupopi4.kartconnect;

import com.sun.net.httpserver.HttpServer;
import grupopi4.kartconnect.handler.KartodromoHandler;
import grupopi4.kartconnect.handler.ClassificacaoHandler;
import grupopi4.kartconnect.handler.PilotoHandler;
import grupopi4.kartconnect.model.Classificacao;
import grupopi4.kartconnect.model.Teclado;

import java.io.IOException;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) {
        try {
            int qtd = Teclado.getInt();
            Classificacao[] c = GeradorClassificacao.gerarClassificacoes(qtd);
            for (int i = 0; i < qtd; i++) {
                System.out.println(c[i]);
            }


        } catch (Exception erro) {
            erro.printStackTrace();
        }
    }
}