package grupopi4.kartconnect.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Kartodromo")
public class Kartodromo implements Cloneable{
    private String nome;
    private String email;
    private String desc;
    private String endereco;
    private String horario_funcionamento;
    private String telefone;
    private String whatsapp;

    public Kartodromo( String nome, String email, String desc, String endereco, String horario_funcionamento, String telefone, String whatsapp) {
        this.nome = nome;
        this.email = email;
        this.desc = desc;
        this.endereco = endereco;
        this.horario_funcionamento = horario_funcionamento;
        this.telefone = telefone;
        this.whatsapp = whatsapp;
    }

    public Kartodromo(Kartodromo modelo) {
        this.nome = modelo.nome;
        this.email = modelo.email;
        this.desc = modelo.desc;
        this.endereco = modelo.endereco;
        this.horario_funcionamento = modelo.horario_funcionamento;
        this.telefone = modelo.telefone;
        this.whatsapp = modelo.whatsapp;
    }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDesc() { return desc; }
    public void setDesc(String desc) { this.desc = desc; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public String getHorario_funcionamento() { return horario_funcionamento; }
    public void setHorario_funcionamento(String horario_funcionamento) { this.horario_funcionamento = horario_funcionamento; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }

    @Override
    public String toString() {
        return "Kartodromo [nome=" + nome + ", email=" + email + ", desc=" + desc + ", endereco=" + endereco + ", horario_funcionamento=" + horario_funcionamento + ", telefone=" + telefone + ", whatsapp=" + whatsapp + "]";
    }

    @Override
    public int hashCode() {
        int ret = 1;

        ret = 31 * ret + nome.hashCode();
        ret = 31 * ret + email.hashCode();
        ret = 31 * ret + desc.hashCode();
        ret = 31 * ret + endereco.hashCode();
        ret = 31 * ret + horario_funcionamento.hashCode();
        ret = 31 * ret + telefone.hashCode();
        ret = 31 * ret + whatsapp.hashCode();

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

        Kartodromo k = (Kartodromo) obj;

        if (!this.nome.equals(k.nome)) return false;
        if (!this.email.equals(k.email)) return false;
        if (!this.desc.equals(k.desc)) return false;
        if (!this.endereco.equals(k.endereco)) return false;
        if (!this.horario_funcionamento.equals(k.horario_funcionamento)) return false;
        if (!this.telefone.equals(k.telefone)) return false;
        if (!this.whatsapp.equals(k.whatsapp)) return false;

        return true;
    }

    @Override
    public Kartodromo clone() {
        Kartodromo ret = null;

        try{
            ret = new Kartodromo(this);
        } catch (Exception erro){}

        return ret;
    }
}
