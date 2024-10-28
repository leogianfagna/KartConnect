package grupopi4.kartconnect;

import grupopi4.kartconnect.model.Classificacao;
import grupopi4.kartconnect.model.Tempo;

import java.util.Random;

// Após a realização dos testes, adaptar a classe para rodar na página administrativa.
public class GeradorClassificacao {

    /*private String[] popularVetor() throws Exception {
        int qtd = 0;
        System.out.print("Quantidade a ser inserida: ");

        while (qtd <= 0) {
            try{
                qtd = Teclado.getInt();
                if (qtd > 0)
                    break;
                else
                    System.out.print("Quantidade inválida! Digite novamente: ");
            } catch (Exception erro){
                System.out.print(erro + "Digite novamente: ");
            }
        }

        String[] str = new String[qtd];

        for (int i = 0; i < qtd; i++){
            System.out.print("[" + (i + 1) + "]: ");
            str[i] = Teclado.getString();
        }

        return str;
    }*/

    public Classificacao[] gerarClassificacoes(int qtd) throws Exception {

        Classificacao[] classificacoes = new Classificacao[qtd];

        final String[] kartodromos = {"VeloMax","TurboKart","NitroRace","ThunderSpeed","Velocitá"};
        final String[] estados = {"AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MS", "MT", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"};
        final String[] nomes = {"Gabriel", "Felipe", "Lucas", "André", "Bruno", "Thiago", "Mateus", "Rafael", "Ricardo", "Pedro", "Daniel", "Caio", "Vitor", "Gustavo", "Rodrigo", "Fernando", "Eduardo", "Alexandre", "Marcelo", "Igor", "Diego", "Paulo", "Murilo", "Bruno", "Henrique", "Vinícius", "João", "Antônio", "Miguel", "Beatriz", "Gabriela"};
        final String[] sobrenomes = {"Silva", "Santos", "Oliveira", "Pereira", "Souza", "Costa", "Ferreira", "Rodrigues", "Almeida", "Nascimento", "Lima", "Carvalho", "Araujo", "Ribeiro", "Martins", "Rocha", "Mendes", "Barros", "Vieira", "Cavalcanti", "Gomes", "Monteiro", "Correia", "Moura", "Batista", "Freitas", "Andrade", "Dias", "Teixeira", "Barbosa"};
        final int minimoSegundos = 50;
        final int maximoSegundos = 300;
        final int pesoMin = 60;
        final int pesoMax = 110;

        for (int i = 0; i < qtd; i++){
            final String nome = nomes[new Random().nextInt(nomes.length)] + " " + sobrenomes[new Random().nextInt(sobrenomes.length)];
            final Tempo tempo = Tempo.randomPorSegundos(minimoSegundos, maximoSegundos);
            final int peso = new Random().nextInt(pesoMax-pesoMin)+pesoMin;
            final String kartodromo = kartodromos[new Random().nextInt(kartodromos.length)];
            final String estado = estados[new Random().nextInt(estados.length)];

            Classificacao c = new Classificacao(nome,peso,tempo,kartodromo,estado);
            classificacoes[i] = c;
        }

        return classificacoes;
    }

    /*private static int validarIntPositivo() {
        int ret = 0;

        while (ret <= 0) {
            try{
                ret = Teclado.getInt();
                if (ret > 0)
                    break;
                else
                    System.out.print("Quantidade inválida! Digite novamente: ");
            } catch (Exception erro){
                System.out.print(erro + "Digite novamente: ");
            }
        }

        return ret;
    }*/

}
