const tbody = document.getElementById('tempos-banco');
let kartFilter = null;
let nameFilter = null;

// Setters de filtro: vão setar a variável global para o filtro selecionado dinamicamente durante o uso da página.
function setName(value) {
    nameFilter = value;
}

function setKartodromo(element) {
    const kartodromoSelecionado = (element.id).replace('kart-', '');
    if (kartodromoSelecionado === 'all') {
        kartFilter = null;
    } else {
        kartFilter = kartodromoSelecionado;
    }
}

// Busca todos os dados no banco da coleção classificacoes baseado no que está no filtro. Passar como parâmetro um filtro vazio (filter = {}) vai buscar todos os dados do banco.
async function queryClassificacoes() {
    try {
        const response = await fetch(`http://localhost:3000/classifications/${kartFilter}/${null}/${nameFilter}`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar classificações:', error);
    }
}

async function queryKartodromos() {
    const filtro = null; // Status: Quer listar todos kartódromos então não precisa de filtro algum

    try {
        const response = await fetch(`http://localhost:3000/kartTracks/${filtro}`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar classificações:', error);
    }
}

// Função executada toda vez que clica em procurar com o nome do usuário ou toda vez com um novo filtro de kartódromo. 
async function listarResultadosIndividuais() {
    setName(document.getElementById('pilot-name').value);

    const dados = await queryClassificacoes();
    limparTabelaBody();
    refreshDivs();
    showPortal();

    if (dados.length === 0) return showNothingFound();

    dados.forEach((classificacao) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${classificacao.nome}</td>
            <td>${classificacao.peso}</td>
            <td>${classificacao.kartodromo}</td>
            <td>${millisecondsToTime(classificacao.tempo.totalEmMs)}</td>
        `;

        const td = document.createElement('td');
        const btn = document.createElement('p');
        btn.className = "mb-3 query-simple-button";
        btn.style.fontSize = "1em";
        btn.style.marginTop = "16px";
        btn.textContent = "ANALISAR";
        btn.addEventListener('click', () => showDashboard(classificacao.kartodromo));

        td.appendChild(btn);
        tr.appendChild(td);
        tr.className = "align-middle";
        tbody.appendChild(tr);
    });
}

function showNothingFound() {
    document.getElementById('tabela-resultados').style.display = 'none';
    document.getElementById('nothing-found').style.display = 'block';
}

function refreshDivs() {
    document.getElementById('tabela-resultados').style.display = 'block';
    document.getElementById('nothing-found').style.display = 'none';
}

async function showDashboard(kartodromoParaAnalise) {
    kartFilter = kartodromoParaAnalise;
    nameFilter = null;
    const classificacoes = await queryClassificacoes();

    let tempoPiloto;
    let mediaTempoTotal = 0;
    let mediaTempoParcial = 0;
    let i = 0;

    let pos10Tempo = classificacoes[9].tempo.totalEmMs;
    let pos1Tempo = classificacoes[0].tempo.totalEmMs;

    // Iterar apenas os 20 primeiros tempos para informações no dashboard
    const top20Classificacoes = classificacoes.slice(0, 20);
    top20Classificacoes.forEach((classificacao) => {
        mediaTempoParcial += classificacao.tempo.totalEmMs;
    });

    let mediaTempo = mediaTempoParcial / top20Classificacoes.length;
    let melhorTempo = top20Classificacoes[0].tempo.totalEmMs;
    let piorTempo = top20Classificacoes[top20Classificacoes.length - 1].tempo.totalEmMs;
    let meioMelhorMedia = (melhorTempo + mediaTempo) / 2;
    let meioPiorMedia = (piorTempo + mediaTempo) / 2;

    // Processa os demais tempos para conseguir a média total
    classificacoes.forEach((classificacao) => {
        if (classificacao.nome === document.getElementById('pilot-name').value) {
            tempoPiloto = classificacao.tempo.totalEmMs;
        }

        i++;
        mediaTempoTotal += classificacao.tempo.totalEmMs;
    });

    mediaTempoTotal = mediaTempoTotal / i;
    const diferencaPrimeiro = getDifTime(tempoPiloto, pos1Tempo);
    const diferencaTop10 = getDifTime(tempoPiloto, pos10Tempo);
    const diferencaDaMedia = getDifTime(tempoPiloto, mediaTempoTotal);
    document.getElementById('dif-first').innerHTML = millisecondsToTime(diferencaPrimeiro);
    document.getElementById('dif-top10').innerHTML = millisecondsToTime(diferencaTop10);
    document.getElementById('dif-media').innerHTML = millisecondsToTime(diferencaDaMedia);
    document.getElementById('dif-first-icon').innerHTML = getRespectiveStyle(diferencaPrimeiro, 'icon');
    document.getElementById('dif-top10-icon').innerHTML = getRespectiveStyle(diferencaTop10, 'icon');
    document.getElementById('dif-media-icon').innerHTML = getRespectiveStyle(diferencaDaMedia, 'icon');
    document.getElementById('dif-first-icon').style.backgroundColor = getRespectiveStyle(diferencaPrimeiro, 'color');
    document.getElementById('dif-top10-icon').style.backgroundColor = getRespectiveStyle(diferencaTop10, 'color');
    document.getElementById('dif-media-icon').style.backgroundColor = getRespectiveStyle(diferencaDaMedia, 'color');


    definirVelocimetro(piorTempo, mediaTempo, meioMelhorMedia, meioPiorMedia, tempoPiloto);

    // Confere se já não está exibido para não exibir novamente ou esconder
    const content = document.getElementById('dashboard-portal');
    if (!content.classList.contains('show')) {
        content.style.display = 'block';
        content.classList.add('show');
    }

    scrollToBottom();
}

// Função que resgata os estilos que serão usados para os ícones do dashboard, aqueles que indicam positivo, negativo ou neutro em relação ao tempo
function getRespectiveStyle(time, type) {
    const compare = time;
    let icon = "trending_down";
    let color = "#de3b26";

    // Precisa comparar com sinal de negativo pois a diferença em milissegundos não consegue reconher o negativo
    if (time < 0 || compare === 0) {
        icon = "trending_up";
        color = "#8dfa4d";
    } else if (compare < 1000) {
        icon = "timeline";
        color = "#fae039";
    }

    if (type === 'color') return color;
    if (type === 'icon') return icon;
}


function definirVelocimetro(piorTempo, mediaTempo, meioMelhorMedia, meioPiorMedia, tempoPiloto) {

    switch (true) {
        case (tempoPiloto < meioMelhorMedia):
            setScore(2);
            break;
        case (tempoPiloto < mediaTempo):
            setScore(1);
            break;
        case (tempoPiloto < meioPiorMedia):
            setScore(0);
            break;
        case (tempoPiloto < piorTempo):
            setScore(-1);
            break;
        default:
            setScore(-2);
            break;
    }
}

function getDifTime(tempo1, tempo2) {
    return tempo1 - tempo2;
}

function timeToMilliseconds(timeString) {
    const [minutes, seconds, milliseconds] = timeString.split(':').map(Number);
    const totalMilliseconds = (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;

    return totalMilliseconds;
}

function millisecondsToTime(milliseconds) {
    const sign = milliseconds < 0 ? '-' : '';
    milliseconds = Math.abs(milliseconds); // Torna o valor positivo para cálculo

    const minutes = Math.floor(milliseconds / (60 * 1000));
    milliseconds %= (60 * 1000);

    const seconds = Math.floor(milliseconds / 1000);
    const remainingMilliseconds = Math.round(milliseconds % 1000);

    // Formatação usada no return: -M:SS:mmm
    return `${sign}${minutes}:${seconds.toString().padStart(2, '0')}:${remainingMilliseconds.toString().padStart(3, '0')}`;
}


// Seleção de opções
// Executado toda vez ao clicar em uma categoria, vai adicionar os estilos necessários e buscar resultados baseado nos filtros
function filtrarCategoria(element) {
    setKartodromo(element);
    limparSelecaoCategoria();
    listarResultadosIndividuais();

    element.classList.add('option-button-selected');
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

// Recebe todos os kartódromos registrados no banco de dados e impreme todos em lista para o usuário usar como filtro na tabela
async function listarKartodromos() {
    const dados = await queryKartodromos();
    const container = document.getElementById('kartodromos-filtro');

    dados.forEach(kartodromo => {
        const button = document.createElement('button');
        button.type = 'submit';
        button.className = 'btn btn-primary card-submit-button';
        button.textContent = kartodromo.nome;
        button.id = `kart-${kartodromo.nome.replace(/\s+/g, '')}`; // Define o ID do botão baseado no nome do kartódromo

        // Adicionar o evento de clique em cada botão (que é cada kartódromo)
        button.addEventListener('click', function () {
            filtrarCategoria(this);
        });

        container.appendChild(button);
    });
}


// Velocímetro
const speedometerNeedle = document.querySelector('.speedometer-needle');
const statusText = document.getElementById("status-txt");
const background = document.getElementById("speedometer-background");

function setSpeedometerValue(degrees) {
    if (degrees == -72) {
        speedometerNeedle.style.transform = `rotate(${degrees}deg) translateX(-50%)`;
        statusText.innerHTML = "Ruim";
        statusText.style.color = "#f44336";
        background.style.backgroundImage = "radial-gradient(#f4433600,#f443361c, #f443365b)";


    } else if (degrees == -36) {
        speedometerNeedle.style.transform = `rotate(${degrees}deg) translateX(-50%)`;
        statusText.innerHTML = "Precário";
        statusText.style.color = "#d33a2f";
        background.style.backgroundImage = "radial-gradient(#d33a2f00,#d33a2f0c, #d33a2f5b)";


    } else if (degrees == 0) {
        speedometerNeedle.style.transform = `rotate(${degrees}deg) translateX(-50%)`;
        statusText.innerHTML = "Regular";
        statusText.style.color = "#787B86";
        background.style.backgroundImage = "radial-gradient(#787B8600,#787B860c, #787B865b)";


    } else if (degrees == 36) {
        speedometerNeedle.style.transform = `rotate(${degrees}deg) translateX(-50%)`;
        statusText.innerHTML = "Bom";
        statusText.style.color = "#2457e6";
        background.style.backgroundImage = "radial-gradient(#2457e600,#2457e60c, #2457e65b)";


    } else if (degrees == 72) {
        speedometerNeedle.style.transform = `rotate(${degrees}deg) translateX(-50%)`;
        statusText.innerHTML = "Excelente";
        statusText.style.color = "#2962ff";
        background.style.backgroundImage = "radial-gradient(#2962ff00,#2962ff1c, #2962ff5b)";

    } else {
        alert("Invalid Value");
    }
    speedometerNeedle.style.transform = `rotate(${degrees}deg) translateX(-50%)`;
}

function setScore(score) {
    const degreeMap = { "-2": -72, "-1": -36, "0": 0, "1": 36, "2": 72 };
    setSpeedometerValue(degreeMap[score] ?? 0);
}

function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

listarKartodromos();