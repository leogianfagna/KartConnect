// Script que cria "tabs" interativos no header do card, para ver a opção do que quiser ver do kartódromo.
// O script interativamente exibe os elementos escondidos <p>, assim como também trocar as classes de active nos cards

function filtrarOpcao(element) {
    const cardElement = element.closest('.card'); // Mesma coisa que "element.parentElement.parentElement.parentElement.parentElement"
    clearSelection(cardElement);
    showContent(cardElement.id, element.innerText);
    element.classList.add('active');
}

function clearSelection(element) {
    let div = element;

    // Limpa os demais tabs selecionados, da div element (que é o kart do kartódromo), removendo o estilo active
    const todosCardTab = div.querySelectorAll('.active');
    todosCardTab.forEach(function (elemento) {
        elemento.classList.remove('active');
    });

    // Esconde o texto antigo, da div element (que é o kart do kartódromo), para aparecer o texto respectivo ao tab selecionado
    const todosCardText = div.querySelectorAll('.card-text');
    todosCardText.forEach(function (elemento) {
        elemento.style.display = 'none';
    });
}

function showContent(card, option) {
    const elementoParaExibir = "kartodromo-" + option;
    const divKartodromoSelecionado = card;

    let element = document.querySelector("#" + divKartodromoSelecionado + " ." + elementoParaExibir);
    element.style.display = 'block';
}