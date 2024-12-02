package grupopi4.kartconnect;

import com.fasterxml.jackson.databind.ObjectMapper;
import grupopi4.kartconnect.model.Classificacao;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

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

            int qtd = Integer.parseInt(reader.readLine());

            Classificacao[] classificacoes = Classificacao.gerarClassificacoes(qtd);

            ObjectMapper mapper = new ObjectMapper();
            String classificacoesJson = mapper.writeValueAsString(classificacoes);

            writer.println(classificacoesJson);
            System.out.println(classificacoesJson);

            writer.flush();
            conexao.close();
        }
        catch (Exception erro) { System.err.println("Erro thread: " + erro.getMessage());}
    }
}
