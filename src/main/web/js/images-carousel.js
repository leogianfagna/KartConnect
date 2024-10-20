const kartTracks = [
    {
        name: "Serpente de Prata",
        description: "O Circuito Serpente de Prata é conhecido por suas curvas sinuosas e rápidas, lembrando o movimento ágil de uma serpente deslizando pelo asfalto. Com 1,2 km de extensão, o traçado desafia os pilotos com uma sequência técnica de cinco curvas em 'S' logo após a reta principal, exigindo precisão e controle total do kart. Uma curva de alta velocidade de 180 graus no final da pista põe à prova a coragem dos corredores, enquanto a reta final oferece uma oportunidade para disputas eletrizantes até a linha de chegada.",
        location: "Kartódromo Velocitá"
    },
    {
        name: "Cascata do Vento",
        description: "Seu layout de 1,5 km é composto por subidas e descidas abruptas, levando os pilotos a se adaptarem constantemente à mudança de elevações e ao vento forte que corta o circuito. A 'Curva da Cascata', uma descida íngreme seguida de uma curva fechada, é um dos pontos mais desafiadores, exigindo precisão e freios afiados. Já a seção final do traçado inclui uma longa reta descendente, perfeita para os pilotos ganharem velocidade máxima antes do sprint final.",
        location: "Kartódromo Nitro Race"
    },
    {
        name: "Litoral do Farol",
        description: "O traçado de 900 metros foca em um estilo fluido, com longas curvas de raio constante e trechos rápidos, permitindo que os pilotos sintam o vento do mar enquanto testam suas habilidades. A 'Curva do Farol', uma curva de 90 graus com uma leve inclinação, marca o ponto de maior desafio do circuito, onde a aderência e o equilíbrio do kart são fundamentais. A pista é perfeita para competições de alta velocidade e provas de resistência.",
        location: "Kartódromo Turbo Kart"
    },
    {
        name: "Floresta Negra",
        description: "Imerso em uma densa floresta, o traçado da Floresta Negra é uma prova de resistência e habilidade. Com 1,8 km, o circuito é famoso por suas longas retas cercadas de árvores imponentes, criando um cenário que combina a beleza natural com a adrenalina da competição. As 'Garras da Floresta', uma sequência de curvas apertadas em meio a sombras de árvores gigantes, exige atenção total e controle preciso do acelerador. No final do percurso, uma curva ampla e inclinada leva os pilotos de volta à reta principal, proporcionando uma emocionante batalha pela vitória.",
        location: "Kartódromo Velo Max"
    }
];

// Função que altera a descrição do traçado abaixo da foto dele. Usa um listener para esperar o carrossel terminar de girar para pegar o ID, pois se pegar o ID antes vai
// retornar um número equivocado, seja ele o ID da imagem anterior ou retornar várias vezes a mesma coisa. Pega o ID corretamente e define o innerHTML com a descrição criada
// no object "kartTracks"
function getPage() {
    document.getElementById('tracks-carousel').addEventListener('slid.bs.carousel', function () {
        const activeItem = document.querySelector('#tracks-carousel .carousel-item.active');
        const activeId = activeItem.id;
        const n = parseInt(activeId) - 1;

        document.getElementById('track-name').innerHTML = `<b>${kartTracks[n].name}</b>`;
        document.getElementById('track-desc').innerHTML = kartTracks[n].description;
        document.getElementById('track-location').innerHTML = `<b>${kartTracks[n].location}</b>`;
    });
}

// Como acima só poderá definir o innerHTML quando girar o carrossel, é necessário criar uma função que exibe a primeira mensagem, pois o carrossel não começa girando.
function premadeTrack() {
    document.getElementById('track-name').innerHTML = `<b>${kartTracks[0].name}</b>`;
    document.getElementById('track-desc').innerHTML = kartTracks[0].description;
    document.getElementById('track-location').innerHTML = `<b>${kartTracks[0].location}</b>`;
}

getPage();
premadeTrack();