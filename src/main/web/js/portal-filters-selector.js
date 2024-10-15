function filtrarCategoria(element) {
    limparSelecaoCategoria();
    element.classList.add('option-button-selected');
}

function filtrarKartodromo(element) {
    limparSelecaoKartodromo();
    diminuirOpacidade(element);
    buscarClassificacoes(element.id);

    element.classList.add('option-button-selected');
}

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

function buscarClassificacoes(kartodromoFiltrado) {
    kartodromoFiltrado = kartodromoFiltrado.replace('card-kart-', '');

    fetch('http://localhost:8080/api/classificacoes', { method: "GET" })
        .then(response => response.json())
        .then(classificacoes => {
            toggleContent();
            const tbody = document.getElementById('tempos-banco');
            limparTabelaBody(tbody);
            classificacoes.forEach((classificacao, index) => {

                // Cria uma nova linha na tabela
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <th scope="row">${index + 1}</th>
                    <td>${classificacao.nome}</td>
                    <td>${classificacao.estado}</td>
                    <td>${classificacao.peso}</td>
                    <td>${classificacao.tempo}</td>
                `;

                if (classificacao.kartodromo == kartodromoFiltrado) {
                    tbody.appendChild(tr); // Adicionar linha
                }

            });
            console.log("classificações carregadas:", classificacoes);
        })
        .catch(error => {
            console.error('Erro ao buscar classificações:', error);
        });
}

function limparTabelaBody(tbody) {
    tbody.innerHTML = '';
}

function toggleContent() {
    const content = document.getElementById('table-portal');

    // Confere se já não está exibido para não exibir novamente ou esconder
    if (!content.classList.contains('show')) {
        content.style.display = 'block';
        content.classList.add('show');
    }
}