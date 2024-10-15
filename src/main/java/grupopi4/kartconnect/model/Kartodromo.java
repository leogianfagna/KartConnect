package grupopi4.kartconnect.model;

import org.bson.codecs.pojo.annotations.BsonProperty;
import org.bson.types.ObjectId;

public class Kartodromo {
    @BsonProperty("email")
    private String email;
    @BsonProperty("endereco")
    private String endereco; //fazer obj endereco com cidade, estado, rua e numero (preguiça)
    @BsonProperty("nome")
    private String nome;
    @BsonProperty("telefone")
    private String telefone;

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

    @Override
    public String toString() {
        return "Nome: " + nome + "\n" +
                "Endereço: " + endereco + "\n" +
                "Telefone: " + telefone + "\n" +
                "Email: " + email;
    }
}