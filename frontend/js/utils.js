const MENSAGEM_API_INDISPONIVEL = 'Este recurso estará disponível quando a API for implementada.';
let musicasSelecionadasParaPlaylist = [];
let notaSelecionada = 0;

function mostrarAvisoApi(elemento, mensagem = MENSAGEM_API_INDISPONIVEL) {
    if (!elemento) return;
    elemento.textContent = mensagem;
}

function logout() {
    localStorage.removeItem('usuario');
    window.location.href = window.location.pathname.includes('/pages/')
        ? '../index.html'
        : 'index.html';
}

function exigirLogin() {
    const paginaLogin = window.location.pathname.includes('/pages/')
        ? '../login.html?tab=login'
        : 'login.html?tab=login';
    window.location.href = paginaLogin;
}

function showTab(aba) {
    const cadastroAtivo = aba === 'cadastro';
    const formCadastro = document.getElementById('form-cadastro');
    const formLogin = document.getElementById('form-login');
    const tabCadastro = document.getElementById('tab-cadastro');
    const tabLogin = document.getElementById('tab-login');

    if (formCadastro) formCadastro.style.display = cadastroAtivo ? 'block' : 'none';
    if (formLogin) formLogin.style.display = cadastroAtivo ? 'none' : 'block';
    if (tabCadastro) tabCadastro.classList.toggle('active', cadastroAtivo);
    if (tabLogin) tabLogin.classList.toggle('active', !cadastroAtivo);
}

function login() {
    mostrarAvisoApi(document.getElementById('erro-login'));
}

function cadastrar() {
    mostrarAvisoApi(document.getElementById('erro-cadastro'));
}

function alternarFavoritoGlobal(id) {
    if (window.event) window.event.stopPropagation();

    let favoritos = JSON.parse(localStorage.getItem('meus_favoritos') || '[]');
    const idNormalizado = String(id);
    const jaFavoritada = favoritos.some(favorito => String(favorito) === idNormalizado);

    favoritos = jaFavoritada
        ? favoritos.filter(favorito => String(favorito) !== idNormalizado)
        : [...favoritos, idNormalizado];

    localStorage.setItem('meus_favoritos', JSON.stringify(favoritos));
    document.querySelectorAll(`[id="btn-fav-${id}"], [id="btn-fav-main-${id}"]`)
        .forEach(botao => { botao.innerText = jaFavoritada ? '🤍' : '❤️'; });

    if (typeof atualizarContadorFavoritos === 'function') atualizarContadorFavoritos();
}

function verificarSeEFavorito(id) {
    const favoritos = JSON.parse(localStorage.getItem('meus_favoritos') || '[]');
    return favoritos.some(favorito => String(favorito) === String(id));
}

document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const nomeUsuario = document.getElementById('nome-usuario');
    if (nomeUsuario && usuario.nome) nomeUsuario.textContent = `Olá, ${usuario.nome}!`;

    if (window.location.pathname.includes('login.html')) {
        const aba = new URLSearchParams(window.location.search).get('tab');
        showTab(aba === 'cadastro' ? 'cadastro' : 'login');
    }
});

window.logout = logout;
window.exigirLogin = exigirLogin;
window.showTab = showTab;
window.login = login;
window.cadastrar = cadastrar;
window.alternarFavoritoGlobal = alternarFavoritoGlobal;
window.verificarSeEFavorito = verificarSeEFavorito;
window.mostrarAvisoApi = mostrarAvisoApi;
