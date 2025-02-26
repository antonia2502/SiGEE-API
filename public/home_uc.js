////
async function cadastrarUnidade(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const cep = document.getElementById("cep").value;
    const estado = document.getElementById("estado").value;
    const cidade = document.getElementById("cidade").value;
    const bairro = document.getElementById("bairro").value;
    const logradouro = document.getElementById("logradouro").value;
    const numero = document.getElementById("numero").value;
    const complemento = document.getElementById("complemento").value || null; // Pode ser nulo

    console.log("Enviando dados:", { nome, cep, estado, cidade, bairro, logradouro, numero, complemento });

    const resposta = await fetch('http://localhost:3000/sigee/unidades', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify({ nome, cep, estado, cidade, bairro, logradouro, numero, complemento })
    });

    const respostaJson = await resposta.json();
    console.log("Resposta da API:", respostaJson);

    alert(respostaJson.mensagem);
    if (resposta.ok) {
        listarUnidades(); // Atualiza a lista
        document.getElementById("formCadastroUnidade").reset(); // Limpa o formulário
    }
}


async function listarUnidades() {
    try {
        const resposta = await fetch('http://localhost:3000/sigee/unidades', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token") }
        });

        const unidades = await resposta.json();
        console.log("Dados recebidos:", unidades); // Verifica se a API retorna um array

        if (!Array.isArray(unidades)) {
            throw new Error("Resposta da API não é uma lista.");
        }

        const lista = document.getElementById("listaUnidades");
        lista.innerHTML = "";

        unidades.forEach(unidade => {
            const div = document.createElement("div");
            div.classList.add("unidade-consumidora");
            div.innerHTML = `
                <img src="/icons/casa.png" class="uc-icon">
                <div class="uc-info">
                    <p>Unidade Consumidora</p>
                    <p><strong>${unidade.nome}</strong></p>
                    <p>UC ${unidade.id}</p>
                </div>
                <img src="/icons/lixeira.png" class="delete-icon" onclick="excluirUnidade(${unidade.id})">
            `;

            div.onclick = () => {
                // Salvar a unidade selecionada no localStorage
                localStorage.setItem("unidadeSelecionada", JSON.stringify({ id: unidade.id, nome: unidade.nome }));
                
                abrirModal();
                carregarDadosConsumo(unidade.id);
            };
            lista.appendChild(div);
        });

    } catch (erro) {
        console.error("Erro ao listar unidades consumidoras:", erro);
        alert("Erro ao carregar unidades consumidoras.");
    }
}



async function carregarUnidadesConsumidoras() {
    try {
        const resposta = await fetch("http://localhost:3000/sigee/unidades", {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token") }
        });

        if (!resposta.ok) {
            throw new Error("Erro ao buscar unidades consumidoras");
        }

        const unidades = await resposta.json();
        const select = document.getElementById("unidadeSelect");
        select.innerHTML = "<option value=''>Selecione uma unidade</option>"; // Opção padrão

        unidades.forEach(unidade => {
            const option = document.createElement("option");
            option.value = unidade.id;
            option.textContent = `${unidade.nome} - ${unidade.cidade}/${unidade.estado}`;
            select.appendChild(option);
        });

    } catch (erro) {
        console.error("Erro ao carregar unidades consumidoras:", erro);
    }
}

// Chamar a função quando a página carregar
document.addEventListener("DOMContentLoaded", carregarUnidadesConsumidoras);

function selecionarUnidade(elemento) {
    document.querySelectorAll(".unidade-consumidora").forEach(el => el.classList.remove("active"));
    elemento.classList.add("active");
}

async function excluirUnidade(id) {
    const confirmar = confirm("Tem certeza que deseja excluir esta unidade?");
    if (!confirmar) return; // Se o usuário cancelar, a função para aqui

    const resposta = await fetch(`http://localhost:3000/sigee/unidades/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token") }
    });

    const resultado = await resposta.json();
    alert(resultado.mensagem);
    if (resposta.ok) listarUnidades(); // Atualiza a lista após a exclusão
}