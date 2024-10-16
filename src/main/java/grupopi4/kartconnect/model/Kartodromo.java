package grupopi4.kartconnect.model;

import org.bson.codecs.pojo.annotations.BsonProperty;

public class Kartodromo {
    @BsonProperty("email")
    private String email;
    @BsonProperty("endereco")
    private String endereco; //fazer obj endereco com cidade, estado, rua e numero (preguiça)
    @BsonProperty("nome")
    private String nome;
    @BsonProperty("telefone")
    private String telefone;
    @BsonProperty("whatsapp")
    private String whatsapp;
    @BsonProperty("desc")
    private String desc;
    @BsonProperty("horario_funcionamento")
    private String horario_funcionamento;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDesc() {
        return desc;
    }

    public String getHorario_funcionamento() {
        return horario_funcionamento;
    }

    public String getWhatsapp() {
        return whatsapp;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public void setHorario_funcionamento(String horario_funcionamento) {
        this.horario_funcionamento = horario_funcionamento;
    }

    public void setWhatsapp(String whatsapp) {
        this.whatsapp = whatsapp;
    }

    @Override
    public String toString() {
        return "Nome: " + nome + "\n" +
                "Endereço: " + endereco + "\n" +
                "Telefone: " + telefone + "\n" +
                "Email: " + email + "\n" +
                "Descrição: " + desc + "\n" +
                "Whatsapp: " + whatsapp + "\n" +
                "Horário de funcionamento: " + horario_funcionamento;
    }
}