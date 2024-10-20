const tbody = document.getElementById('tempos-banco');

let filter = { "nome": 0 , "kartodromo": "" };
let kartFilter = undefined;

function getFiltros() {
    const name = document.getElementById('pilot-name').value;

    if (kartFilter === undefined) {
        delete filter.kartodromo;
    } else {
        filter.kartodromo = kartFilter;
    }
    
    filter.nome = name;

    const queryParams = new URLSearchParams(filter).toString();
    return queryParams;
}

// Função para resgatar os valores do banco de dados, já com os filtros aplicados na página pelo usuário
function buscarClassificacoes() {
    let tdId = 1;
    const filtro = getFiltros();
    limparTabelaBody();
    console.log("Filtro aplicado = " + filtro);

    fetch(`http://localhost:8080/api/classificacoes?${filtro}`, { method: "GET" })
        .then(response => response.json())
        .then(classificacoes => {
            showPortal();

            classificacoes.forEach((classificacao, index) => {

                // Cria uma nova linha na tabela
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${classificacao.nome}</td>
                    <td>${classificacao.peso}</td>
                    <td>${classificacao.kartodromo}</td>
                    <td>${classificacao.tempo}</td>
                    <td>ANALISAR</td>
                `;

                tdId++;
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar classificações:', error);
        });
}

// Seleção de opções
// Executado toda vez ao clicar em uma categoria, vai adicionar os estilos necessários e buscar resultados baseado nos filtros
function filtrarCategoria(element) {
    setKartodromo(element);
    limparSelecaoCategoria();
    buscarClassificacoes();

    element.classList.add('option-button-selected');
}

function setKartodromo(element) {
    const kartodromoSelecionado = (element.id).replace('kart-', '');
    if (kartodromoSelecionado === 'all') {
        kartFilter = undefined;
    } else {
        kartFilter = kartodromoSelecionado;
    }
}

// Funções auxiliares para alterar manipulação visual da página e criar imersão
function limparSelecaoCategoria() {
    const div = document.getElementById('kartodromos-filtro');
    const elementos = div.querySelectorAll('.option-button-selected');
    elementos.forEach(function (elemento) {
        elemento.classList.remove('option-button-selected');
    });
}

function limparTabelaBody() {
    tbody.innerHTML = '';
}

function showPortal() {
    const content = document.getElementById('table-portal');

    // Confere se já não está exibido para não exibir novamente ou esconder
    if (!content.classList.contains('show')) {
        content.style.display = 'block';
        content.classList.add('show');
    }
}

// Velocímetro
const speedometerNeedle = document.querySelector('.speedometer-needle');
const statusText = document.getElementById("status-txt");
const background = document.getElementById("speedometer-background");

function setSpeedometerValue(degrees) {
    if (degrees == -72) {
        speedometerNeedle.style.transform = `rotate(${degrees}deg) translateX(-50%)`;
        statusText.innerHTML = "Strong Sell";
        statusText.style.color = "#f44336";
        background.style.backgroundImage = "radial-gradient(#f4433600,#f443361c, #f443365b)";


    } else if (degrees == -36) {
        speedometerNeedle.style.transform = `rotate(${degrees}deg) translateX(-50%)`;
        statusText.innerHTML = "Sell";
        statusText.style.color = "#d33a2f";
        background.style.backgroundImage = "radial-gradient(#d33a2f00,#d33a2f0c, #d33a2f5b)";


    } else if (degrees == 0) {
        speedometerNeedle.style.transform = `rotate(${degrees}deg) translateX(-50%)`;
        statusText.innerHTML = "Neutral";
        statusText.style.color = "#787B86";
        background.style.backgroundImage = "radial-gradient(#787B8600,#787B860c, #787B865b)";


    } else if (degrees == 36) {
        speedometerNeedle.style.transform = `rotate(${degrees}deg) translateX(-50%)`;
        statusText.innerHTML = "Buy";
        statusText.style.color = "#2457e6";
        background.style.backgroundImage = "radial-gradient(#2457e600,#2457e60c, #2457e65b)";


    } else if (degrees == 72) {
        speedometerNeedle.style.transform = `rotate(${degrees}deg) translateX(-50%)`;
        statusText.innerHTML = "Strong Buy";
        statusText.style.color = "#2962ff";
        background.style.backgroundImage = "radial-gradient(#2962ff00,#2962ff1c, #2962ff5b)";

    } else {
        alert("Invalid Value");
    }
    speedometerNeedle.style.transform = `rotate(${degrees}deg) translateX(-50%)`;
}

function setScore(score) {
    var degrees;
    if (score == 0) {
        degrees = 0;
    } else if (score == 1) {
        degrees = 36;
    } else if (score >= 2) {
        degrees = 72;
    } else if (score == -1) {
        degrees = -36;
    } else if (score <= -2) {
        degrees = -72;
    } else {
        alert("Invalid Score");
    }
    setSpeedometerValue(degrees);
}


setScore(1);//Input Score