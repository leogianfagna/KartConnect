// Script que cria "tabs" interativos no header do card, para ver a opção do que quiser ver do kartódromo.
// O script interativamente exibe os elementos escondidos <p>, assim como também trocar as classes de active nos cards
let filtro = null;

// Element recebe um this, que significa cada "tab" para as opções de filtros (Principal, endereço, funcionamento e contato).
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

// Esse elemento é a opção filtrada em filtrarOpcao()
function showContent(card, option) {
  const elementoParaExibir = "kartodromo-" + option;
  const divKartodromoSelecionado = card;

  let element = document.querySelector("#" + divKartodromoSelecionado + " ." + elementoParaExibir);
  element.style.display = 'block';
}

function buscarKartodromos() {
  fetch(`http://localhost:3000/kartTracks/${filtro}`)
    .then(response => response.json())
    .then(kartodromos => {
      criarCardKartodromo(kartodromos);
    })
    .catch(error => {
      console.error('Erro ao buscar kartódromos:', error);
    });
}

function criarCardKartodromo(kartodromosArray) {
  let elementosEncontradosFiltro = 0;
  notFoundMessage('none');

  // KartodromosArray é o resultado da busca do banco de dados
  kartodromosArray.forEach(kartodromo => {

    elementosEncontradosFiltro++;
    const divCard = document.createElement('div');
    divCard.className = 'card text-center shadow mb-5 bg-body-tertiary rounded';
    divCard.style.marginTop = '40px';
    divCard.id = `kartodromo-${(kartodromo.nome).replace(/ /g, '')}`;

    const divCardHeader = document.createElement('div');
    divCardHeader.className = 'card-header';

    const ulNavTabs = document.createElement('ul');
    ulNavTabs.className = 'nav nav-tabs card-header-tabs';

    const opcoes = ['Principal', 'Endereço', 'Funcionamento', 'Contato'];

    opcoes.forEach(opcao => {
      const liNavItem = document.createElement('li');
      liNavItem.className = 'nav-item kartodromo-overview-topic';

      const pNavLink = document.createElement('p');
      pNavLink.className = 'nav-link';
      if (opcao === 'Principal') {
        pNavLink.classList.add('active');
      }
      pNavLink.innerText = opcao;
      pNavLink.setAttribute('onclick', 'filtrarOpcao(this);');

      liNavItem.appendChild(pNavLink);
      ulNavTabs.appendChild(liNavItem);
    });

    divCardHeader.appendChild(ulNavTabs);

    const divCardBody = document.createElement('div');
    divCardBody.className = 'card-body';

    const h4Title = document.createElement('h4');
    h4Title.className = 'card-title';
    h4Title.style.fontFamily = 'ChakraPetchMedium';
    h4Title.innerText = `Kartódromo ${kartodromo.nome}`;

    const pPrincipal = document.createElement('p');
    pPrincipal.className = 'card-text kartodromo-Principal';
    pPrincipal.style.display = 'block';
    pPrincipal.innerText = kartodromo.desc;

    const pEndereco = document.createElement('p');
    pEndereco.className = 'card-text kartodromo-Endereço';
    pEndereco.style.display = 'none';
    pEndereco.innerText = kartodromo.endereco;

    const pFuncionamento = document.createElement('p');
    pFuncionamento.className = 'card-text kartodromo-Funcionamento';
    pFuncionamento.style.display = 'none';
    pFuncionamento.innerHTML = kartodromo.horario_funcionamento;

    const pContato = document.createElement('p');
    pContato.className = 'card-text kartodromo-Contato';
    pContato.style.display = 'none';
    pContato.innerHTML = `Telefone: ${kartodromo.telefone}<br>WhatsApp: ${kartodromo.whatsapp}<br>Email: ${kartodromo.email}`;

    divCardBody.appendChild(h4Title);
    divCardBody.appendChild(pPrincipal);
    divCardBody.appendChild(pEndereco);
    divCardBody.appendChild(pFuncionamento);
    divCardBody.appendChild(pContato);

    divCard.appendChild(divCardHeader);
    divCard.appendChild(divCardBody);

    document.getElementById('lista-kartodromos').appendChild(divCard);
  });

  if (elementosEncontradosFiltro === 0) {
    notFoundMessage('block');
  }

  const content = document.getElementById('lista-kartodromos');

  // Confere se já não está exibido para não exibir novamente ou esconder
  if (!content.classList.contains('show')) {
    content.style.display = 'block';
    content.classList.add('show');
  }

}

// Função chamada ao clicar no botão "Buscar", que inicia todo o sistema de busca
function filtrarLista() {
  const form = document.querySelector('.needs-validation');
  const buscaUsuario = document.getElementById('user-query').value;

  // Campo inválido
  if (!form.checkValidity()) { // checkValidity() é uma função do Boostrap
    form.classList.add('was-validated');
    return;
  }

  // Campo válido
  if (buscaUsuario.length >= 1) {
    filtro = buscaUsuario.toLowerCase();
    mostrarElemento();
    limparConteudo();
    buscarKartodromos();
  }
}


function notFoundMessage(style) {
  document.getElementById('not-found').style.display = style;
}

// Função executada em caso de busca bem sucedida, portanto, mostra o botão para remover filtros aplicados e tira as validações do Bootstrap
function mostrarElemento() {
  document.getElementById('remove-filters').style.display = 'inline';
  const form = document.querySelector('.needs-validation');
  form.classList.remove('was-validated');
}

// Botão estático na página que ao clicado, volta a mostrar todos os kartódromos
function removerFiltro() {
  document.getElementById('user-query').value = '';
  document.getElementById('remove-filters').style.display = 'none';
  filtro = null;

  notFoundMessage('none');
  limparConteudo();
  buscarKartodromos();
}

function limparConteudo() {
  const divListaKarts = document.getElementById('lista-kartodromos');
  divListaKarts.innerHTML = '';
}

// Chama a função quando a página carregar
document.addEventListener('DOMContentLoaded', function () {
  buscarKartodromos();
});

/* Feito para reproduzir esse elemento aqui
    <div class="card text-center" style="margin-top: 40px; margin-bottom: 100px;" id="kartodromo-velomax">
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item kartodromo-overview-topic">
            <p class="nav-link active" onclick="filtrarOpcao(this);">Principal</p>
          </li>
          <li class="nav-item kartodromo-overview-topic">
            <p class="nav-link" onclick="filtrarOpcao(this);">Endereço</p>
          </li>
          <li class="nav-item kartodromo-overview-topic">
            <p class="nav-link" onclick="filtrarOpcao(this);">Funcionamento</p>
          </li>
          <li class="nav-item kartodromo-overview-topic">
            <p class="nav-link" onclick="filtrarOpcao(this);">Contato</p>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <h4 class="card-title" style="font-family: ChakraPetchMedium;">Center VeloMax</h4>
        <p class="card-text kartodromo-Principal" style="display: block;">Focado em corridas off-road, o Terra Rápida
          oferece adrenalina em um circuito misto de terra e asfalto, perfeito para quem busca aventura.</p>
        <p class="card-text kartodromo-Endereço" style="display: none;">Rodovia KM 120, s/n - Área Rural, Belo
          Horizonte, MG, CEP 65432-109</p>
        <p class="card-text kartodromo-Funcionamento" style="display: none;">
          Segunda-feira: fechado.<br>
          Terça à sexta: 7h às 21h.<br>
          Sábados e domingos: 7h às 22h.
        </p>
        <p class="card-text kartodromo-Contato" style="display: none;">
          Telefone: (31) 3422-7788<br>
          WhatsApp: (31) 99812-3456<br>
          Email: contato@kartodromovelomax.com
        </p>
      </div>
    </div>
*/