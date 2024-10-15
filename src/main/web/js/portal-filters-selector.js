// Variáveis globais para identificar os filtros de resultados
let selectedKartodromo = '';
let selectedCategoria = 'all';


// Gettters e setters para resgatar os filtros aplicados pelo usuário na página
function setKartodromo(element) {
    const kartodromoEscolhido = element.id;
    selectedKartodromo = kartodromoEscolhido.replace('card-kart-', '');
}

function setCategoria(element) {
    const categoria = (element.id).replace('cat-', '');
    selectedCategoria = categoria;
}

function getKartodromo() {
    return selectedKartodromo;
}

function getCategoria() {
    return selectedCategoria;
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

    fetch('http://localhost:8080/api/classificacoes', { method: "GET" })
        .then(response => response.json())
        .then(classificacoes => {
            showPortal();
            const tbody = document.getElementById('tempos-banco');
            limparTabelaBody(tbody);
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
                if (classificacao.kartodromo === selectedKartodromo) {
                    if (selectedCategoria === 'all') {
                        tbody.appendChild(tr);
                        tdId++;
                    } else if (pertenceCategoria(classificacao.peso) === true) {
                        tbody.appendChild(tr);
                        tdId++;
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