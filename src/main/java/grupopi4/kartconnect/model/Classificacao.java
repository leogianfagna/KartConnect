package grupopi4.kartconnect.model;

import org.bson.types.ObjectId;

public class Classificacao {
    private ObjectId id;
    private String categoria;
    private String piloto;
    private String tempo;
    private String kartodromoId;

    // Getters e Setters

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getPiloto() {
        return piloto;
    }

    public void setPiloto(String piloto) {
        this.piloto = piloto;
    }

    public String getTempo() {
        return tempo;
    }

    public void setTempo(String tempo) {
        this.tempo = tempo;
    }

    public String getKartodromoId() {
        return kartodromoId;
    }

    public void setKartodromoId(String kartodromoId) {
        this.kartodromoId = kartodromoId;
    }
}