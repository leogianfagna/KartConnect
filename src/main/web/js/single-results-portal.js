const tbody = document.getElementById('tempos-banco');

let filter = { "nome": 0, "kartodromo": "" };
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

            classificacoes.forEach((classificacao) => {

                // Cria uma nova linha na tabela
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${classificacao.nome}</td>
                    <td>${classificacao.peso}</td>
                    <td>${classificacao.kartodromo}</td>
                    <td>${classificacao.tempo}</td>
                `;

                // Cria o botão separadamente
                const td = document.createElement('td');
                const btn = document.createElement('p'); // Usando 'p' como botão
                btn.className = "mb-3 query-simple-button";
                btn.style.fontSize = "1em";
                btn.textContent = "ANALISAR";

                // Adiciona o evento 'onclick' corretamente
                btn.addEventListener('click', function () {
                    showDashboard(classificacao.kartodromo);
                });

                // Adiciona o botão na célula e a célula na linha
                td.appendChild(btn);
                tr.appendChild(td);

                tdId++;
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar classificações:', error);
        });
}


async function showDashboard(kartodromoAnalisado) {
    const newFilter = { "kartodromo": kartodromoAnalisado };
    const queryParams = new URLSearchParams(newFilter).toString();

    let tempoPiloto;
    let pos1Tempo;
    let pos10Tempo;
    let mediaTempoTotal = 0;
    let mediaTempoParcial = 0;
    let mediaTempo;
    let melhorTempo;
    let piorTempo;
    let meioMelhorMedia;
    let meioPiorMedia;
    let i = 0;

    try {
        // Vai buscar todos os resultados relacionado ao kartódromo em questão
        const response = await fetch(`http://localhost:8080/api/classificacoes?${queryParams}`, { method: "GET" });
        const classificacoes = await response.json();

        pos10Tempo = classificacoes[9].tempo;
        pos1Tempo = classificacoes[0].tempo;

        // Iterar apenas os 20 primeiros tempos para informações no dashboard
        const top20Classificacoes = classificacoes.slice(0, 20);
        top20Classificacoes.forEach((classificacao) => {
            mediaTempoParcial += timeToMilliseconds(classificacao.tempo);
        });

        mediaTempo = mediaTempoParcial / top20Classificacoes.length;
        melhorTempo = timeToMilliseconds(top20Classificacoes[0].tempo);
        piorTempo = timeToMilliseconds(top20Classificacoes[top20Classificacoes.length - 1].tempo);
        meioMelhorMedia = (melhorTempo + mediaTempo) / 2;
        meioPiorMedia = (piorTempo + mediaTempo) / 2;

        // Processa os demais tempos para conseguir a média total
        classificacoes.forEach((classificacao) => {
            if (classificacao.nome === document.getElementById('pilot-name').value) {
                tempoPiloto = classificacao.tempo;
                console.log("Tempo do piloto encontrado = " + tempoPiloto);
            }

            i++;
            mediaTempoTotal += timeToMilliseconds(classificacao.tempo);
        });

    } catch (error) {
        // Captura erros no fetch ou no processamento
        console.error('Erro ao buscar classificações:', error);
        // TO-DO: FAZER UM ERRO NO SITE
        return;
    }

    mediaTempoTotal = millisecondsToTime((mediaTempoTotal / i))
    document.getElementById('dif-first').innerHTML = getDifTime(tempoPiloto, pos1Tempo);
    document.getElementById('dif-top10').innerHTML = getDifTime(tempoPiloto, pos10Tempo);
    document.getElementById('dif-media').innerHTML = getDifTime(tempoPiloto, mediaTempoTotal);

    definirVelocimetro(melhorTempo, piorTempo, mediaTempo, meioMelhorMedia, meioPiorMedia, tempoPiloto);
    console.log("Melhor tempo = " + millisecondsToTime(melhorTempo));
    console.log("Pior tempo = " + millisecondsToTime(piorTempo));
    console.log("Média dos 20 tempos = " + millisecondsToTime(mediaTempo));
    console.log("Meio entre o melhor tempo e a média = " + millisecondsToTime(meioMelhorMedia));
    console.log("Meio entre o pior tempo e a média = " + millisecondsToTime(meioPiorMedia));

    // Confere se já não está exibido para não exibir novamente ou esconder
    const content = document.getElementById('dashboard-portal');
    if (!content.classList.contains('show')) {
        content.style.display = 'block';
        content.classList.add('show');
    }
}

// to-do: Fix
function definirVelocimetro(melhorTempo, piorTempo, mediaTempo, meioMelhorMedia, meioPiorMedia, tempoPiloto) {
    switch (true) {
        case (millisecondsToTime(tempoPiloto) < millisecondsToTime(meioMelhorMedia)):
            setScore(2);
            break;
        case (millisecondsToTime(tempoPiloto) < millisecondsToTime(mediaTempo)):
            setScore(1);
            break;
        case (millisecondsToTime(tempoPiloto) < millisecondsToTime(meioPiorMedia)):
            setScore(0);
            break;
        case (millisecondsToTime(tempoPiloto) < millisecondsToTime(piorTempo)):
            setScore(-1);
            break;
        default:
            setScore(-2);
            break;
    }
}

function getDifTime(tempo1, tempo2) {
    tempo1 = timeToMilliseconds(tempo1);
    tempo2 = timeToMilliseconds(tempo2);

    const difference = tempo1 - tempo2;

    // Certifica-se de que estamos lidando com o valor absoluto da diferença e armazenando o sinal
    const isNegative = difference < 0;
    const resultTime = millisecondsToTime(Math.abs(difference));

    // Adiciona o sinal negativo ao resultado se for necessário
    return isNegative ? `-${resultTime}` : resultTime;
}

function timeToMilliseconds(timeString) {
    const [minutes, seconds, milliseconds] = timeString.split(':').map(Number);

    // Converte minutos, segundos e milissegundos para milissegundos totais
    const totalMilliseconds = (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;

    return totalMilliseconds;
}

function millisecondsToTime(milliseconds) {
    const minutes = Math.floor(milliseconds / (60 * 1000));
    milliseconds %= (60 * 1000);

    const seconds = Math.floor(milliseconds / 1000);
    const remainingMilliseconds = Math.abs(Math.round(milliseconds % 1000)); // Arredonda milissegundos e garante que seja positivo

    // Formata o tempo para que sempre tenha dois dígitos em segundos e três em milissegundos
    return `${minutes}:${seconds.toString().padStart(2, '0')}:${remainingMilliseconds.toString().padStart(3, '0')}`;
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