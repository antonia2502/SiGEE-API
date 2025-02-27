document.addEventListener("DOMContentLoaded", () => {
    carregarDadosConsumo();
});

function abrirModal() {
    document.getElementById("modalGrafico").style.display = "block";
    
    setTimeout(() => {
        carregarDadosConsumo();
    }, 300); // Pequeno atraso para garantir que o modal e o canvas sejam carregados
}


function fecharModal() {
    document.getElementById("modalGrafico").style.display = "none";
}

function mostrarAba(aba) {
    document.querySelectorAll(".conteudo-aba").forEach(div => div.classList.remove("ativo"));
    document.getElementById(aba).classList.add("ativo");

    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("ativo"));
    document.querySelector(`[onclick="mostrarAba('${aba}')"]`).classList.add("ativo");
}

const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

let mesSelecionado = new Date().getMonth(); // Começa no mês atual

document.getElementById("mesAtual").textContent = meses[mesSelecionado];

// Event listeners para avançar e retroceder entre os meses
document.getElementById("btnAnterior").addEventListener("click", () => mudarMes(-1));
document.getElementById("btnProximo").addEventListener("click", () => mudarMes(1));

async function carregarDadosConsumo() {
    const unidade = JSON.parse(localStorage.getItem("unidadeSelecionada"));
    if (!unidade) {
        if (!sessionStorage.getItem("redirecionado")) {
            alert("Nenhuma unidade selecionada!");
            sessionStorage.setItem("redirecionado", "true"); // Impede múltiplos redirecionamentos
            window.location.href = "home.html";
        }
        return;
    }
    

    try {
        const resposta = await fetch(`http://localhost:3000/sigee/consumo/${unidade.id}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token") }
        });

        if (!resposta.ok) {
            throw new Error("Erro ao carregar os dados de consumo.");
        }

        const consumos = await resposta.json();

        // Filtrar apenas os dados do mês selecionado
        const dadosFiltrados = consumos.filter(c => {
            const data = new Date(c.data_registro);
            return data.getMonth() === mesSelecionado;
        });

        // Atualizar o gráfico
        atualizarGrafico(dadosFiltrados);

        // Atualizar o relatório
        atualizarRelatorio(dadosFiltrados);

    } catch (erro) {
        console.error("Erro ao buscar os dados de consumo:", erro);
    }
}

function atualizarGrafico(dadosFiltrados) {
    const labels = dadosFiltrados.map(c => c.data_registro);
    const valores = dadosFiltrados.map(c => c.consumo_kwh);

    const ctx = document.getElementById("graficoConsumo")?.getContext("2d");

    if (!ctx) {
        console.error("Elemento 'graficoConsumo' não encontrado!");
        return;
    }

    if (window.grafico instanceof Chart) {
        window.grafico.destroy();
    }

    window.grafico = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Consumo (kWh)",
                data: valores,
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                borderWidth: 2,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Data" } },
                y: { title: { display: true, text: "Consumo (kWh)" } }
            }
        }
    });
}

function atualizarRelatorio(dadosFiltrados) {
    const listaConsumo = document.getElementById("listaConsumo");
    listaConsumo.innerHTML = "";

    // Se não houver registros, evitar erro e exibir mensagem
    if (!dadosFiltrados || dadosFiltrados.length === 0) {
        document.getElementById("periodo").textContent = "Sem registros no mês selecionado.";
        document.getElementById("mediaConsumo").textContent = "0.00 kWh";
        return;
    }

    let consumoTotal = 0;
    let dataInicial = new Date(dadosFiltrados[0].data_registro);
    let dataFinal = new Date(dadosFiltrados[dadosFiltrados.length - 1].data_registro);

    dadosFiltrados.forEach(c => {
        let consumo = parseFloat(c.consumo_kwh) || 0; // Garante que é um número
        consumoTotal += consumo;

        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${formatarData(c.data_registro)}</td><td>${consumo.toFixed(2)}</td>`;
        listaConsumo.appendChild(tr);
    });

    let mediaConsumo = (consumoTotal / dadosFiltrados.length).toFixed(2);

    document.getElementById("periodo").textContent = 
        `${formatarData(dataInicial)} a ${formatarData(dataFinal)}`;
    document.getElementById("mediaConsumo").textContent = `${mediaConsumo}`;
}

// Função para formatar a data e remover a hora
function formatarData(data) {
    return new Date(data).toLocaleDateString("pt-BR");
}


// Função para mudar o mês
function mudarMes(direcao) {
    mesSelecionado += direcao;

    // Garante que o mês não ultrapasse os limites de janeiro a dezembro
    if (mesSelecionado < 0) mesSelecionado = 11;
    if (mesSelecionado > 11) mesSelecionado = 0;

    document.getElementById("mesAtual").textContent = meses[mesSelecionado];

    carregarDadosConsumo(); // Recarregar os dados ao mudar o mês
}

// Carregar o gráfico ao iniciar a página
carregarDadosConsumo();

function imprimirRelatorio() {
    window.print();
}

