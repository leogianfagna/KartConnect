package model;

import java.util.Random;

public class Classificacao implements Cloneable{
    private String nome;
    private int peso;
    private Tempo tempo;
    private String kartodromo;
    private String estado;

    public static Classificacao[] gerarClassificacoes(int qtd) throws Exception {

        Classificacao[] classificacoes = new Classificacao[qtd];

        final String[] kartodromos = {"VeloMax","TurboKart","NitroRace","ThunderSpeed","Velocita"};
        final String[] estados = {"AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MS", "MT", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"};
        final String[] nomes = {"Gabriel", "Felipe", "Lucas", "Andre", "Bruno", "Thiago", "Mateus", "Rafael", "Ricardo", "Pedro", "Daniel", "Caio", "Vitor", "Gustavo", "Rodrigo", "Fernando", "Eduardo", "Alexandre", "Marcelo", "Igor", "Diego", "Paulo", "Murilo", "Bruno", "Henrique", "Vinícius", "Joao", "Antonio", "Miguel", "Beatriz", "Gabriela"};
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

    //Verificar com andré
    public Classificacao(String nome, int peso, Tempo tempo, String kartodromo, String estado) throws Exception {
        if (tempo == null)
            throw new Exception("models.Tempo não pode ser nulo");
        this.nome = nome;
        this.peso = peso;
        this.tempo = new Tempo(tempo);
        this.kartodromo = kartodromo;
        this.estado = estado;
    }

    //Verificar com andré
    public Classificacao(Classificacao modelo) throws Exception {
        if (modelo == null) throw new Exception("Modelo ausente");

        this.nome = modelo.getNome();
        this.peso = modelo.getPeso();
        this.tempo = modelo.getTempo();
        this.kartodromo = modelo.getKartodromo();
        this.estado = modelo.getEstado();
    }
    public String getNome() { return this.nome; }

    public void setNome(String nome) { this.nome = nome; }
    public int getPeso() { return peso; }

    public void setPeso(int peso) { this.peso = peso; }
    //Verificar com André
    public Tempo getTempo() throws Exception {
        return new Tempo(this.tempo);
    }
    //Verificar com André

    public void setTempo(Tempo tempo) throws Exception {
        if (tempo == null)
            throw new Exception("models.Tempo não pode ser nulo");
        this.tempo = new Tempo(tempo);
    }
    public String getKartodromo() { return this.kartodromo; }

    public void setKartodromo(String kartodromo) { this.kartodromo = kartodromo;}
    public String getEstado() { return this.estado; }

    public void setEstado(String estado) { this.estado = estado; }

    @Override
    public String toString() {
        return "models.Classificacao [nome=" + nome + ", peso=" + peso + ", tempo=" + tempo + ", kartodromo=" + kartodromo + ", estado=" + estado + "]";
    }
    //Verificar com André

    @Override
    public int hashCode() {
        int ret = 1;

        ret = 31 * ret + this.nome.hashCode();
        ret = 31 * ret + Integer.valueOf(peso).hashCode();
        ret = 31 * ret + tempo.hashCode();
        ret = 31 * ret + this.kartodromo.hashCode();
        ret = 31 * ret + this.estado.hashCode();

        if (ret<0){
            ret = -ret;
        }

        return ret;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null) return false;
        if (this.getClass() != obj.getClass()) return false;

        Classificacao c = (Classificacao) obj;

        if (!this.nome.equals(c.nome)) return false;
        if (this.peso != c.peso) return false;
        if (!this.tempo.equals(c.tempo)) return false;
        if (!this.kartodromo.equals(c.kartodromo)) return false;
        if (!this.estado.equals(c.estado)) return false;

        return true;
    }

    @Override
    public Classificacao clone() {
        Classificacao ret = null;

        try {
            ret = new Classificacao(this);
        } catch (Exception erro){}

        return ret;
    }

    public int getTempoEmMilissegundos(){
        return this.tempo.getMilissegundos() +this.tempo.getSegundos() * 1000 + this.tempo.getMinutos() * 60000;
    }
}