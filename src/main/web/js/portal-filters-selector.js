// Script que insere os resultados no portal de classificações no HTML, baseado nos filtros aplicados pelo usuário na página.
// As funções são todas chamadas através dos botões de filtro dentro da página.


// Variáveis globais para identificar os filtros de resultados
const resultsPerPage = 20;
let selectedKartodromo = '';
let selectedCategoria = 'all';
let selectedPageNumber = 1;
let resultadosBuscados;

// Gettters e setters para resgatar os filtros aplicados pelo usuário na página
function setKartodromo(element) {
    const kartodromoEscolhido = element.id;
    selectedPageNumber = 1;
    selectedKartodromo = kartodromoEscolhido.replace('card-kart-', '');
}

function setCategoria(element) {
    const categoria = (element.id).replace('cat-', '');
    selectedPageNumber = 1;
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

// Função para resgatar os valores do banco de dados, já com os filtros aplicados na página pelo usuário
function buscarClassificacoes() {
    let tdId = 1;

    //Exemplo de utilização do fetch com um filtro

    //let filter = {nome: "Felipe Almeida"};
    //const queryParams = new URLSearchParams(filter).toString();
    //fetch(`http://localhost:8080/api/classificacoes?${queryParams}`, { method: "GET" })

    fetch('http://localhost:8080/api/classificacoes', { method: "GET" })
        .then(response => response.json())
        .then(classificacoes => {
            console.log(classificacoes);
            showPortal();
            
            const tbody = document.getElementById('tempos-banco');
            limparTabelaBody(tbody);

            resultadosBuscados = classificacoes.filter(classificacao => 
                classificacao.kartodromo === selectedKartodromo && pertenceCategoria(classificacao.peso)
            ).length;

            classificacoes.forEach((classificacao, index) => {

                // Cria uma nova linha na tabela
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <th scope="row">${tdId}</th>
                    <td>${classificacao.nome}</td>
                    <td>${classificacao.estado}</td>
                    <td>${classificacao.peso}</td>
                    <td>${classificacao.tempo}</td>
                `;

                // Filtragem de resultados baseado nos filtros do usuário
                if (classificacao.kartodromo === selectedKartodromo && pertenceCategoria(classificacao.peso) === true) {
                    tdId++;
                    if (getNumberOfResults(tdId)) {
                        tbody.appendChild(tr);
                    }
                    
                }
            });
        })
        .catch(error => {
            console.error('Erro ao buscar classificações:', error);
        });
}

function pertenceCategoria(kg) {
    if (selectedCategoria === 'all') return true; // Todos pertencem

    const pesoPiloto = parseInt(kg);
    let pesoMinimoPiloto, pesoMaximoPiloto;

    (selectedCategoria === '60' ? pesoMinimoPiloto = 0 : pesoMinimoPiloto = parseInt(selectedCategoria));
    (selectedCategoria === '100' ? pesoMaximoPiloto = 300 : pesoMaximoPiloto = parseInt(selectedCategoria) + 10);

    if (pesoPiloto >= pesoMinimoPiloto && pesoPiloto < pesoMaximoPiloto) {
        return true;
    } else {
        return false;
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