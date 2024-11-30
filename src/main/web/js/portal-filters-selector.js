// Script que insere os resultados no portal de classificações no HTML, baseado nos filtros aplicados pelo usuário na página.
// As funções são todas chamadas através dos botões de filtro dentro da página.


// Variáveis globais para identificar os filtros de resultados
const resultsPerPage = 20;
let selectedKartodromo = null;
let selectedCategoria = null;
let selectedPageNumber = 1;
let resultadosBuscados;

// Gettters e setters para resgatar os filtros aplicados pelo usuário na página
function setKartodromo(element) {
    const kartodromoEscolhido = element.id;
    selectedPageNumber = 1;
    selectedKartodromo = kartodromoEscolhido.replace('card-kart-', '');
}

function setCategoria(element) {
    let categoria = (element.id).replace('cat-', '');
    selectedPageNumber = 1;

    if (categoria === 'all') categoria = null;
    selectedCategoria = categoria;
}


// Executado toda vez ao clicar em uma categoria, vai adicionar os estilos necessários e buscar resultados baseado nos filtros
function filtrarCategoria(element) {
    setCategoria(element);
    limparSelecaoCategoria();
    buscarClassificacoes();

    element.classList.add('option-button-selected');
}


// Executado toda vez ao clicar em um kartodromo, vai adicionar os estilos necessários e buscar resultados baseado nos filtros
function filtrarKartodromo(element) {
    setKartodromo(element);
    limparSelecaoKartodromo();
    diminuirOpacidade(element);
    buscarClassificacoes();

    element.classList.add('option-button-selected');
}

function millisecondsToTime(milliseconds) {
    const minutes = Math.floor(milliseconds / (60 * 1000));
    milliseconds %= (60 * 1000);

    const seconds = Math.floor(milliseconds / 1000);
    const remainingMilliseconds = Math.abs(Math.round(milliseconds % 1000));

    // Formatação usada no return: M:SS:mmm
    return `${minutes}:${seconds.toString().padStart(2, '0')}:${remainingMilliseconds.toString().padStart(3, '0')}`;
}

// Função para resgatar os valores do banco de dados, já com os filtros aplicados na página pelo usuário
function buscarClassificacoes() {
    const tbody = document.getElementById('tempos-banco');
    let tdId = 1;

    fetch(`http://localhost:3000/classifications/${selectedKartodromo}/${selectedCategoria}/${null}`, { method: "GET" })
        .then(response => response.json())
        .then(classificacoes => {

            classificacoes.length > 0 ? showNoResults(true) : showNoResults(false);

            showPortal();
            limparTabelaBody(tbody);
            resultadosBuscados = classificacoes;

            classificacoes.forEach((classificacao) => {

                // Cria uma nova linha na tabela
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <th scope="row">${tdId}</th>
                    <td>${classificacao.nome}</td>
                    <td>${classificacao.estado}</td>
                    <td>${classificacao.peso}</td>
                    <td>${millisecondsToTime(classificacao.tempo.totalEmMs)}</td>
                `;

                tdId++;
                if (getNumberOfResults(tdId)) {
                    tbody.appendChild(tr);
                }

            });
        })
        .catch(error => {
            console.error('Erro ao buscar classificações:', error);
        });
}

// É chamado caso a busca em buscarClassificacoes() retorne zero resultados
function showNoResults(status) {
    if (status === true) {
        document.getElementById('no-results').style.display = 'none';
        document.getElementById('results-table').style.visibility = 'visible';
        document.getElementById('pagination-button').style.visibility = 'visible';
    } else {
        document.getElementById('no-results').style.display = 'block';
        document.getElementById('results-table').style.visibility = 'hidden';
        document.getElementById('pagination-button').style.visibility = 'hidden';
    }
    
}

// Funções auxiliares para alterar manipulação visual da página e criar imersão
function limparSelecaoCategoria() {
    const div = document.getElementById('categorias');
    const elementos = div.querySelectorAll('.option-button-selected');
    elementos.forEach(function (elemento) {
        elemento.classList.remove('option-button-selected');
    });
}

function limparSelecaoKartodromo() {
    const div = document.getElementById('kartodromos');
    const elementos = div.querySelectorAll('.option-button-selected');
    elementos.forEach(function (elemento) {
        elemento.classList.remove('option-button-selected');
    });
}

function diminuirOpacidade(element) {
    voltarOpacidade();
    const divPaiElemento = element.parentElement.parentElement;
    const div = document.getElementById('kartodromos');
    const elementos = div.children;

    for (let i = 0; i < elementos.length; i++) {
        if (elementos[i] !== divPaiElemento) {
            elementos[i].style.opacity = 0.5;
        }
    }
}

function voltarOpacidade() {
    const div = document.getElementById('kartodromos');
    const elementos = div.children;

    for (let i = 0; i < elementos.length; i++) {
        elementos[i].style.opacity = 1;
    }
}

function limparTabelaBody(tbody) {
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

// Função que vai mudar de página na tabela dos resultados, que está limitada a "resultsPerPage" resultados. Essa função vai inserior novamente os resultados, mas somente
// aqueles que pertencem ao número da página. Essa função confere se já está na página um (pois não pode ser menor que isso) e também se a página seguinte é valida (possui algum
// resultado nela), para não passar para uma página vazia.
function changePage(i) {
    if (selectedPageNumber === 1 && i < 1) {
        return;
    }

    if (selectedPageNumber + i > maximoPaginas(resultadosBuscados)) {
        return;
    }

    selectedPageNumber = selectedPageNumber + i;
    buscarClassificacoes();
}

// Função auxiliar que retorna o máximo de páginas de resultados que pode haver, para usar como auxilio para não acessar uma página que não há resultados.
function maximoPaginas(results) {
    return Math.ceil(results / resultsPerPage);
}

// Função auxiliar que é usada na hora de inserir um elemento na tabela, que verifica se aquele elemento pertence àquela página. Por exemplo, o piloto de posição 31 não pertence
// à página 1 e isso é calculado baseado na quantia de resultados por página (resultsPerPage) somado com 1, para funcionar corretamente.
function getNumberOfResults(num) {
    const finalResult = selectedPageNumber * resultsPerPage + 1;
    const firstResult = finalResult - (resultsPerPage - 1);

    if (num > finalResult) return false;
    if (num < firstResult) return false;
    return true;
}