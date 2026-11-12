//reúne funções compartilhadas por diferentes páginas do vinyl

//variáveis globais
const MENSAGEM_API_INDISPONIVEL = 'Este recurso estará disponível quando a API for implementada.';
let musicasSelecionadasParaPlaylist = [];
let notaSelecionada = 0;

//função responsável por exibir uma mensagem de aviso quando a API não estiver implementada
function mostrarAvisoApi(elemento, mensagem = MENSAGEM_API_INDISPONIVEL) {
    if (!elemento) return;
    elemento.textContent = mensagem;
}
//remove informação usuario do armazenamento local e redirecionar para a página de login
function logout() {
    localStorage.removeItem('usuario');
    window.location.href = window.location.pathname.includes('/pages/')
        ? '../index.html'
        : 'index.html';
}
//redirecinar o usuário para a tela de login
function exigirLogin() {
    const paginaLogin = window.location.pathname.includes('/pages/')
        ? '../login.html?tab=login'
        : 'login.html?tab=login';
    window.location.href = paginaLogin;
}
//alternar entre as abas de login e cadastro
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
//modificação de função - data: 11.11 - autenticar o usuário
function login() {
    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-senha').value;

    if (!email || !senha) {
        mostrarAvisoApi(
            document.getElementById('erro-login'),
            'Preencha o e-mail e a senha.'
        );
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        mostrarAvisoApi(
            document.getElementById('erro-login'),
            'Digite um e-mail válido.'
        );
        return;
    }
       if (senha.length < 6) {
        mostrarAvisoApi(document.getElementById('erro-login'), 'A senha está incorreta.'
        );
        return;
    }

    mostrarAvisoApi(
        document.getElementById('erro-login'),
        'Dados preenchidos! O login será concluído quando a API estiver disponível.'
    );
}

//modificação de função - data: 11.11 - cadastrar novos usuarios
function cadastrar() {
    //capturar os 4 campos
    const nome = document.getElementById('cad-nome').value.trim();
    const email = document.getElementById('cad-email').value.trim();
    const senha = document.getElementById('cad-senha').value.trim();    
    const data = document.getElementById('cad-data').value.trim();
//verificar se todos os campos foram preenchidos
    if (!nome || !email || !senha || !data) {
        mostrarAvisoApi(
            document.getElementById('erro-cadastro'), 
            'Todos os campos são obrigatórios.'
        );
        return;
    }
    if (senha.length < 6) {
        mostrarAvisoApi(document.getElementById('erro-cadastro'), 'A senha deve ter pelo menos 6 caracteres.'
        );
        return;
    }
    //se faltar @ ou ., mostra mensagem de erro
    if (!email.includes('@') || !email.includes('.')) {
        mostrarAvisoApi(
            document.getElementById('erro-cadastro'),
            'O e-mail não é válido, digite novamente'
        );
        return;
    }

    mostrarAvisoApi(
        document.getElementById('erro-cadastro'),
        'Dados preenchidos'
    );
}
//adicionar ou remover música dos favoritos
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
//verificar se a música é favorita
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
