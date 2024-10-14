// Script que cria "tabs" interativos no header do card, para ver a opção do que quiser ver do kartódromo.
// O script interativamente exibe os elementos escondidos <p>, assim como também trocar as classes de active nos cards

function filtrarOpcao(element) {
    const cardElement = element.closest('.card'); // Mesma coisa que "element.parentElement.parentElement.parentElement.parentElement"
    clearSelection(cardElement);
    showContent(element.innerText);
    element.classList.add('active');
}

function clearSelection(element) {
    let div = element;
    const elementos = div.querySelectorAll('.active');
    elementos.forEach(function (elemento) {
        elemento.classList.remove('active');
    });

    div = document.getElementById('info-dos-kartodromos');
    const elementos2 = div.querySelectorAll('.card-text');
    elementos2.forEach(function (elemento) {
        elemento.style.display = 'none';
    });
}

function showContent(option) {
    const elementoParaExibir = "kartodromo-" + option;
    document.getElementById(elementoParaExibir).style.display = 'block';
}