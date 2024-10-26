package grupopi4.kartconnect;

import grupopi4.kartconnect.model.Classificacao;
import grupopi4.kartconnect.model.Teclado;

public class Main {
    public static void main(String[] args) {
        try {
            int qtd = Teclado.getInt();
            GeradorClassificacao gerador = new GeradorClassificacao();
            Classificacao[] c = gerador.gerarClassificacoes(qtd);
            for (int i = 0; i < qtd; i++) {
                System.out.println(c[i]);
            }


        } catch (Exception erro) {
            erro.printStackTrace();
        }
    }
}