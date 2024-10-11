/*
    Código que executa a função generateRandomData(), que serve para gerar dados aleatórios que entrarão para o banco de dados da plataforma.

    O sistema tem como objetivo filtrar os dados do kartódromo. Como não há integração com nenhum kartódromo e isso é apenas uma simulação, execute esse código para
    gerar dados aleatórios e inserir no banco de dados.
*/

function randomName() {
    const firstNames = ["Gabriel", "Felipe", "Lucas", "André", "Bruno", "Thiago", "Mateus", "Rafael", "Ricardo", "Pedro", "Daniel", "Caio", "Vitor", "Gustavo", "Rodrigo", "Fernando", "Eduardo", "Alexandre", "Marcelo", "Igor", "Diego", "Paulo", "Murilo", "Bruno", "Henrique", "Vinícius", "João", "Antônio", "Miguel", "Beatriz", "Gabriela"];
    const lastNames = ["Silva", "Santos", "Oliveira", "Pereira", "Souza", "Costa", "Ferreira", "Rodrigues", "Almeida", "Nascimento", "Lima", "Carvalho", "Araujo", "Ribeiro", "Martins", "Rocha", "Mendes", "Barros", "Vieira", "Cavalcanti", "Gomes", "Monteiro", "Correia", "Moura", "Batista", "Freitas", "Andrade", "Dias", "Teixeira", "Barbosa"];

  
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
    return `${firstName} ${lastName}`;
}

function randomTime() {
    const min = 49.9;
    const max = 51.9;
  
    return (Math.random() * (max - min) + min).toFixed(3) + "s";
}

function randomEmail(nome) {
    const emailProviders = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com"];
    const provider = emailProviders[Math.floor(Math.random() * emailProviders.length)];
  
    const email = nome.toLowerCase().replace(" ", ".") + "@" + provider;
    return email;
}

function randomIdade() {
    return Math.floor(Math.random() * (50 - 19 + 1)) + 19;
}

function randomCelular() {
    const ddds = [19, 11];
    const ddd = ddds[Math.floor(Math.random() * ddds.length)];
  
    const firstPart = Math.floor(90000 + Math.random() * 10000);
    const secondPart = Math.floor(1000 + Math.random() * 9000);
  
    return `(${ddd}) 9${firstPart}-${secondPart}`;
}

function generateRandomData() {
    for (let i = 0; i < 25; i++) {
        let name = randomName();
        let lapTime = randomTime();
        let email = randomEmail(name);
        let age = randomIdade();
        let phone = randomCelular();

        console.log(name + ", " + lapTime + ", " + email + ", " + age + ", " + phone);
    }
}

generateRandomData();