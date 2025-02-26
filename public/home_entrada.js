function atualizarNomeUsuario() {
    const nomeUsuario = localStorage.getItem("nome");
    if (nomeUsuario) {
        document.querySelectorAll("#username").forEach(el => el.textContent = nomeUsuario);
    }
}

function verificarLogin() {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "login.html";
    atualizarNomeUsuario();
    listarUnidades();
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

function mostrarSecao(secaoId) {
    document.querySelectorAll(".secao").forEach(secao => secao.classList.remove("ativo"));
    document.getElementById(secaoId).classList.add("ativo");

    if (secaoId === "inicio") {
        listarUnidades();
    }
}

// Carregar foto salva no localStorage
window.onload = function () {
    const fotoSalva = localStorage.getItem("fotoPerfil");
    if (fotoSalva) {
        document.getElementById("fotoHome").src = fotoSalva;
    }
};