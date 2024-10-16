package grupopi4.kartconnect.model;

public class Classificacao {
    private String peso;
    private String nome;
    private String tempo;
    private String estado;
    private String kartodromo;

    
    public String getEstado() {
        return estado;
    }

    public String getKartodromo() {
        return kartodromo;
    }

    public String getNome() {
        return nome;
    }

    public String getPeso() {
        return peso;
    }

    public String getTempo() {

        return tempo;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public void setKartodromo(String kartodromo) {
        this.kartodromo = kartodromo;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setPeso(String peso) {
        this.peso = peso;
    }

    public void setTempo(String tempo) {
        this.tempo = tempo;
    }

    public long getTempoEmMilissegundos() {
        String[] parts = tempo.split(":");
        int minutos = Integer.parseInt(parts[0]);
        int segundos = Integer.parseInt(parts[1]);
        int milissegundos = Integer.parseInt(parts[2]);

        return (minutos * 60 * 1000) + (segundos * 1000) + milissegundos;
    }

    @Override
    public String toString() {
        return nome + tempo + peso + kartodromo + estado;
    }
}