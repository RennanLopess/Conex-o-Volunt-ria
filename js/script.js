// Função para validar CPF
function validarCPF(cpf) {
    // Remove tudo que não for número
    cpf = cpf.replace(/[^\d]+/g, '');

    // Verifica se o CPF tem 11 dígitos ou se são todos iguais
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    // Validação do primeiro dígito verificador
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++)
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 1; i <= 10; i++)
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    // CPF válido
    return true;
}



// Cadastrar necessidade
if (document.getElementById('necessidadeForm')) {
    document.getElementById('necessidadeForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // Captura e limpa os dados do formulário
        const instituicao = document.getElementById("instituicao").value.trim();
        const cpf = document.getElementById("cpf").value.trim();
        const tipoAjuda = document.getElementById("tipoAjuda").value;
        const titulo = document.getElementById("titulo").value.trim();
        const descricao = document.getElementById("descricao").value.trim();
        const cep = document.getElementById("cep").value.trim();
        const rua = document.getElementById("rua").value.trim();
        const bairro = document.getElementById("bairro").value.trim();
        const cidade = document.getElementById("cidade").value.trim();
        const estado = document.getElementById("estado").value.trim();
        const contato = document.getElementById("contato").value.trim();
        const mensagem = document.getElementById("mensagem");

        // Valida o CPF antes de continuar
        if (!validarCPF(cpf)) {
            mensagem.textContent = "CPF inválido.";
            mensagem.style.color = "red";
            return;
        }

        // Verifica se todos os campos obrigatórios estão preenchidos
        if (!instituicao || !tipoAjuda || !titulo || !descricao || !cep || !rua || !bairro || !cidade || !estado || !contato) {
            mensagem.textContent = "Por favor, preencha todos os campos obrigatórios.";
            mensagem.style.color = "red";
            return;
        }

        // Cria objeto com os dados da necessidade
        const necessidade = {
            instituicao,
            cpf,
            tipoAjuda,
            titulo,
            descricao,
            cep,
            rua,
            bairro,
            cidade,
            estado,
            contato
        };

        // Salva no localStorage
        let lista = JSON.parse(localStorage.getItem("necessidades")) || [];
        lista.push(necessidade);
        localStorage.setItem("necessidades", JSON.stringify(lista));

        // Exibe mensagem de sucesso e limpa o formulário
        mensagem.textContent = "Necessidade cadastrada com sucesso!";
        mensagem.style.color = "green";
        this.reset();
    });
}

// Exibir necessidades
function exibirNecessidades(lista) {
  const container = document.getElementById("listaNecessidades");
  const mensagemVazia = document.getElementById("mensagemVazia");

  if (!container) return;

  container.innerHTML = "";

  if (lista.length === 0) {
    // Se a lista estiver vazia, exibe a mensagem
    mensagemVazia.textContent = "Nenhuma necessidade encontrada.";
    return;
  }

  mensagemVazia.textContent = "";

  // Para cada necessidade, cria um card e exibe os dados
  lista.forEach((n) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${n.titulo}</h3>
      <p><strong>Instituição:</strong> ${n.instituicao}</p>
      <p><strong>Tipo:</strong> ${n.tipoAjuda}</p>
      <p><strong>Descrição:</strong> ${n.descricao}</p>
      <p><strong>Endereço:</strong> ${n.rua}, ${n.bairro}, ${n.cidade} - ${n.estado}</p>
      <p><strong>Contato:</strong> ${n.contato}</p>
    `;
    container.appendChild(card);
  });
}

// Filtro e Busca
if (document.getElementById("listaNecessidades")) {
  const todas = JSON.parse(localStorage.getItem("necessidades")) || [];
  const inputBusca = document.getElementById("busca");
  const filtroTipo = document.getElementById("filtroTipo");

  // Aplica o filtro baseado no texto digitado e no tipo escolhido
  function aplicarFiltros() {
    const termo = inputBusca.value.toLowerCase();
    const tipoSelecionado = filtroTipo.value;

    const filtradas = todas.filter((n) => {
      const correspondeBusca =
        n.titulo.toLowerCase().includes(termo) ||
        n.descricao.toLowerCase().includes(termo);

      const correspondeTipo = !tipoSelecionado || n.tipoAjuda === tipoSelecionado;

      return correspondeBusca && correspondeTipo;
    });

    // Exibe somente as necessidades filtradas
    exibirNecessidades(filtradas);
  }

  // Executa a filtragem a cada mudança nos campos
  inputBusca.addEventListener("input", aplicarFiltros);
  filtroTipo.addEventListener("change", aplicarFiltros);
  
  // Mostra todas ao carregar a página
  exibirNecessidades(todas);
}
