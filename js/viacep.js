document.getElementById("cep").addEventListener("blur", function () {

  // Remove todos os caracteres que não são números
  const cep = this.value.replace(/\D/g, "");

  // Verifica se o CEP possui exatamente 8 dígitos
  if (cep.length !== 8) {
    alert("CEP inválido.");
    return;
  }

  // Faz requisição à API ViaCEP usando o CEP informado
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then((resposta) => {
      // Verifica se a resposta da API foi bem-sucedida
      if (!resposta.ok) throw new Error("Erro ao buscar o CEP.");
      return resposta.json();
    })
    .then((dados) => {
      // Se a API retornar erro, significa que o CEP não existe
      if (dados.erro) {
        alert("CEP não encontrado.");
        return;
      }

      // Preenche automaticamente os campos com os dados retornados da API
      document.getElementById("rua").value = dados.logradouro || "";
      document.getElementById("bairro").value = dados.bairro || "";
      document.getElementById("cidade").value = dados.localidade || "";
      document.getElementById("estado").value = dados.uf || "";
    })
    .catch((erro) => {
      // Captura qualquer erro ocorrido durante a requisição ou no processamento
      alert("Erro ao buscar o endereço.");
      console.error(erro);
    });
});
