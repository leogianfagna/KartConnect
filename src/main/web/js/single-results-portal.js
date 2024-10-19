// Função para resgatar os valores do banco de dados, já com os filtros aplicados na página pelo usuário
let dados;


async function buscarClassificacoes() {
    try {
        const response = await fetch('http://localhost:8080/api/classificacoes', { method: "GET" });
        const classificacoes = await response.json();
        const arrayFiltrado = classificacoes.filter(obj => obj.nome === "Gustavo Andrade");

        console.log(classificacoes);
        console.log(arrayFiltrado);

        return arrayFiltrado;
    } catch (error) {
        console.error('Erro ao buscar classificações:', error);
    }
}

async function searchResults() {
    const a = document.getElementById('pilot-name').value;
    const dados = await buscarClassificacoes();
    console.log("-> ", dados[0]);
}

searchResults();


