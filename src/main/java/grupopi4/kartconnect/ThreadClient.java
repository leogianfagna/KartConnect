package grupopi4.kartconnect;

import com.fasterxml.jackson.databind.ObjectMapper;
import grupopi4.kartconnect.model.Classificacao;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.concurrent.TimeUnit;

public class ThreadClient extends Thread {

    private final Socket conexao;

    public ThreadClient(Socket socket) throws Exception {
        if (socket == null) {
            throw new Exception("socket is null");
        }
        this.conexao = socket;
    }

    @Override
    public void run(){

        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(conexao.getInputStream()));
            PrintWriter writer = new PrintWriter(conexao.getOutputStream());

            // Reader lê o que aparece no próprio terminal
            int qtd = Integer.parseInt(reader.readLine());

            Classificacao[] classificacoes = Classificacao.gerarClassificacoes(qtd);

            // Usa a biblioteca jackson para conversão de tipos
            ObjectMapper mapper = new ObjectMapper();
            String classificacoesJson = mapper.writeValueAsString(classificacoes);


            //TimeUnit.SECONDS.sleep(10);

            // Forma de se comunicar com o node
            writer.println(classificacoesJson);
            System.out.println(classificacoesJson);

            writer.flush();
            conexao.close();
        }
        catch (Exception erro) { System.err.println("Erro thread: " + erro.getMessage());}
    }
}
