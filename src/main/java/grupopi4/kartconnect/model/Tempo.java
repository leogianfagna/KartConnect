package grupopi4.kartconnect.model;

import java.util.Random;

public class Tempo implements Cloneable {

    private int minutos;
    private int segundos;
    private int milissegundos;
    private int totalEmMs;

    public static Tempo randomPorSegundos(int minSeg, int maxSeg) throws Exception {
        if (minSeg < 0)
            throw new Exception("Segundos negativos");

        if (maxSeg < 0)
            throw new Exception("Segundos negativos");

        if (minSeg > maxSeg)
            throw new Exception("Valor mínimo maior que máximo");

        if (maxSeg - minSeg == 0)
            throw new Exception("Valores não devem ser iguais");

        int minMilisseg = minSeg * 1000;
        int maxMilisseg = maxSeg * 1000;

        int total = new Random().nextInt(maxMilisseg - minMilisseg) + minMilisseg;

        int milissegundos = total % 1000;
        total = (total - milissegundos) / 1000;

        int segundos = total % 60;
        total = (total - segundos) / 60;

        int minutos = total % 60;

        return new Tempo(minutos, segundos, milissegundos);
    }

    public Tempo(int minutos, int segundos, int milissegundos) {
        this.minutos = minutos;
        this.segundos = segundos;
        this.milissegundos = milissegundos;
        this.totalEmMs = (minutos * 60000) + (segundos * 1000) + milissegundos;
    }

    public Tempo(Tempo modelo) throws Exception {
        if (modelo == null)
            throw new Exception("Modelo ausente");

        this.minutos = modelo.minutos;
        this.segundos = modelo.segundos;
        this.milissegundos = modelo.milissegundos;
        this.totalEmMs = modelo.totalEmMs;
    }

    public int getMinutos() {
        return this.minutos;
    }

    public void setMinutos(int minutos) throws Exception {
        if (minutos < 0 || minutos > 59)
            throw new Exception("Quantidade de minutos inválida");

        this.minutos = minutos;
    }

    public int getSegundos() {
        return this.segundos;
    }

    public void setSegundos(int segundos) throws Exception {
        if (segundos < 0 || segundos > 59)
            throw new Exception("Quantidade de segundos inválida");

        this.segundos = segundos;
    }

    public int getMilissegundos() {
        return this.milissegundos;
    }

    public void setMilissegundos(int milissegundos) throws Exception {
        if (milissegundos < 0 || milissegundos > 999)
            throw new Exception("Quantidade de milissegundos inválida");

        this.milissegundos = milissegundos;
    }

    public int getTotalEmMs() {
        return this.totalEmMs;
    }

    @Override
    public String toString() {
        return "models.Tempo: " + (this.minutos < 10 ? "0" : "") + this.minutos + ":"
                + (this.segundos < 10 ? "0" : "") + this.segundos + "."
                + (this.milissegundos < 100 ? "0" : "") + (this.milissegundos < 10 ? "0" : "") + this.milissegundos;
    }

    @Override
    public int hashCode() {
        int ret = 42;
        ret = 9 * ret + Integer.valueOf(minutos).hashCode();
        ret = 3 * ret + Integer.valueOf(segundos).hashCode();
        ret = 7 * ret + Integer.valueOf(milissegundos).hashCode();

        if (ret < 0)
            ret = -ret;

        return ret;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null) return false;
        if (getClass() != obj.getClass()) return false;

        Tempo t = (Tempo) obj;
        if (this.minutos != t.minutos) return false;
        if (this.segundos != t.segundos) return false;
        if (this.milissegundos != t.milissegundos) return false;

        return true;
    }

    @Override
    public Tempo clone() {
        Tempo ret = null;

        try {
            ret = new Tempo(this);
        } catch (Exception erro) {}

        return ret;
    }
}
