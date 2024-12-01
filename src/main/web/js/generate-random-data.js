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
    // Gerar um valor aleatório de tempo total em milissegundos (entre 1 minuto e 1 minuto e 6 segundos)
    const totalMilliseconds = Math.floor(Math.random() * 6000) + 60000; // Entre 60.000 e 66.000 milissegundos (1 min a 1 min 6 seg)

    // Converter para minutos, segundos e milissegundos
    const minutes = Math.floor(totalMilliseconds / 60000); // 1 minuto = 60.000 milissegundos
    const seconds = Math.floor((totalMilliseconds % 60000) / 1000); // Segundos restantes
    const milliseconds = totalMilliseconds % 1000; // Milissegundos restantes

    // Formatar para 2 dígitos nos segundos e 3 dígitos nos milissegundos
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;

    return formattedTime;
}


function randomEmail(nome) {
    const emailProviders = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com"];
    const provider = emailProviders[Math.floor(Math.random() * emailProviders.length)];

    const email = nome.toLowerCase().replace(" ", ".") + "@" + provider;
    return email;
}

function randomWeight() {
    const inputWeight = parseInt(document.getElementById('input-category').value) || 80;
    const min = inputWeight;
    const max = inputWeight + 9;

    return (Math.random() * (max - min) + min).toFixed(0)
}

function randomKartodromo() {
    const selectedKart = document.getElementById('input-name').value;

    if (selectedKart === '') {
        const kartodromos = ["Velocitá", "ThunderSpeed", "NitroRace", "TurboKart", "VeloMax"]
        return kartodromos[Math.floor(Math.random() * kartodromos.length)];
    }

    return selectedKart;
}

function randomState() {
    const states = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MS", "MT", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

    return states[Math.floor(Math.random() * states.length)];
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

function isCamposValidos() {
    const elementosComValidacao = document.querySelectorAll('.needs-validation.was-validated');
    return elementosComValidacao.length;
}

function inserirNovaClassificacao(novaClassificacao) {

    fetch('http://localhost:8080/api/classificacoes', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaClassificacao) // Converte os dados em JSON
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Erro ao inserir a classificação');
            }
        })
        .then(data => {
            console.log('Classificação inserida com sucesso:', data);
            document.getElementById('success-message').style.display = 'block';
        })
        .catch(error => {
            console.error('Erro ao inserir classificação:', error);
            document.getElementById('fail-message').style.display = 'block';
        });
}


/*function generateRandomData() {
    const totalSimulations = document.getElementById('input-simulations-total').value || 3;

    for (let i = 0; i < totalSimulations; i++) {
        let novaClassificacao = {
            nome: randomName(),
            tempo: randomTime(),
            kartodromo: randomKartodromo(),
            estado: randomState(),
            peso: randomWeight()
        };

        inserirNovaClassificacao(novaClassificacao);
    }
}*/

function generateRandomData() {
    const qtd = document.getElementById('input-simulations-total').value || 3;
    fetch('http://localhost:3000/classifications', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ qtd: Number(qtd) })
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Erro ao inserir a classificação');
            }
        })
        .then(data => {
            console.log('Classificação inserida com sucesso:', data);
            document.getElementById('success-message').style.display = 'block';
        })
        .catch(error => {
            console.error('Erro ao inserir classificação:', error);
            document.getElementById('fail-message').style.display = 'block';
        });
}