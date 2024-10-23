package grupopi4.kartconnect;

import grupopi4.kartconnect.model.Classificacao;
import grupopi4.kartconnect.model.Teclado;
import grupopi4.kartconnect.model.Tempo;

import java.util.Random;

// Após a realização dos testes, adaptar a classe para rodar na página administrativa.
public class GeradorClassificacao {

    private static String[] popularVetor() throws Exception {
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
    }

    public static void gerarClassificacoes(int qtd) throws Exception {
        if (qtd <= 0)
            System.out.print("Quantidade inválida! Digite novamente: ");
        while (qtd <= 0){
            try{
                qtd = Teclado.getInt();
                if (qtd<=0)
                    System.out.print("Quantidade inválida! Digite novamente: ");
            } catch (Exception erro){
                System.out.print(erro + "Digite novamente: ");
            }
        }
        final String[] kartodromos = {"VeloMax","TurboKart","NitroRace","ThunderSpeed","Velocitá"};
        final String[] estados = {"AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MS", "MT", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"};
        System.out.println("Populando vetor de nomes");
        final String[] nomes = popularVetor();
        System.out.println("Populando vetor de sobrenomes");
        final String[] sobrenomes = popularVetor();
        System.out.print("Tempo minimo em segundos: ");
        final int tempoMin = Teclado.getInt();
        System.out.print("Tempo maximo em segundos: ");
        final int tempoMax = Teclado.getInt();
        System.out.print("Peso minimo: ");
        final int pesoMin = Teclado.getInt();
        System.out.print("Peso maximo: ");
        final int pesoMax = Teclado.getInt();

        for (int i = 0; i < qtd; i++){
            final String nome = nomes[new Random().nextInt(nomes.length)] + " " + sobrenomes[new Random().nextInt(sobrenomes.length)];
            final Tempo tempo = Tempo.randomPorSegundos(tempoMin, tempoMax);
            final int peso = new Random().nextInt(pesoMax-pesoMin)+pesoMin;
            final String kartodromo = kartodromos[new Random().nextInt(kartodromos.length)];
            final String estado = estados[new Random().nextInt(estados.length)];

            Classificacao c = new Classificacao(nome,peso,tempo,kartodromo,estado);

            System.out.println("["+i+"] "+c);
        }


    }

}

