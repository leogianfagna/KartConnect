function filtrarCategoria(element) {
    limparSelecaoCategoria();
    element.classList.add('option-button-selected');
}

function filtrarKartodromo(element) {
    limparSelecaoKartodromo();
    diminuirOpacidade(element);
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