package grupopi4.kartconnect.model;

import org.bson.types.ObjectId;

public class Classificacao {
    private String peso;
    private String nome;
    private String tempo;
    private String estado;
    private String kartodromo;

    // Getters e Setters


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

    @Override
    public String toString() {
        return nome + tempo + peso + kartodromo + estado;
    }
}