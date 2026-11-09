function abrirModalConfig() {
    const modal = document.getElementById('modal-config');
    if (modal) modal.style.display = 'flex';
}

function fecharModalConfig() {
    const modal = document.getElementById('modal-config');
    if (modal) modal.style.display = 'none';
}

function mostrarMensagemPerfil(id, mensagem) {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = mensagem;
}

function salvarNome() {
    const nome = document.getElementById('novo-nome').value.trim();
    if (!nome) {
        mostrarMensagemPerfil('msg-nome', 'O nome não pode ficar vazio.');
        return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    usuario.nome = nome;
    localStorage.setItem('usuario', JSON.stringify(usuario));
    document.getElementById('perfil-nome').textContent = `@${nome}`;
    mostrarMensagemPerfil('msg-nome', 'Nome salvo somente neste navegador. A sincronização estará disponível quando a API for implementada.');
}

function salvarEmail() {
    const email = document.getElementById('novo-email').value.trim();
    if (!email) {
        mostrarMensagemPerfil('msg-email', 'O e-mail não pode ficar vazio.');
        return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    usuario.email = email;
    localStorage.setItem('usuario', JSON.stringify(usuario));
    document.getElementById('perfil-email').textContent = email;
    mostrarMensagemPerfil('msg-email', 'E-mail salvo somente neste navegador. A sincronização estará disponível quando a API for implementada.');
}

function confirmarDelecao() {
    const modal = document.getElementById('modal-deletar');
    if (modal) modal.style.display = 'flex';
}

function fecharModalDeletar() {
    const modal = document.getElementById('modal-deletar');
    if (modal) modal.style.display = 'none';
}

function deletarContaDefinitiva() {
    alert('A exclusão de conta estará disponível quando a API for implementada.');
}

function atualizarContadorFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('meus_favoritos') || '[]');
    const contador = document.getElementById('stat-favoritos');
    if (contador) contador.textContent = favoritos.length;
}

function mostrarSecao(tipo) {
    const secoes = {
        reviews: 'perfil-reviews-container',
        playlists: 'perfil-grade-playlists',
        favoritos: 'perfil-favoritos-container'
    };
    const aba = document.getElementById(secoes[tipo]);
    if (!aba) return;

    Object.values(secoes).forEach(id => {
        document.getElementById(id).classList.add('d-none');
    });
    document.querySelectorAll('[id^="btn-aba-"]').forEach(botao => botao.classList.remove('active'));
    aba.classList.remove('d-none');
    document.getElementById(`btn-aba-${tipo}`).classList.add('active');

    const mensagem = tipo === 'favoritos'
        ? 'Os detalhes dos favoritos estarão disponíveis quando a API for implementada.'
        : MENSAGEM_API_INDISPONIVEL;
    aba.textContent = mensagem;
}

window.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    document.getElementById('perfil-nome').textContent = usuario.nome ? `@${usuario.nome}` : '@usuario';
    document.getElementById('perfil-email').textContent = usuario.email || 'email@exemplo.com';
    document.getElementById('novo-nome').value = usuario.nome || '';
    document.getElementById('novo-email').value = usuario.email || '';
    document.getElementById('perfil-reviews-container').textContent = MENSAGEM_API_INDISPONIVEL;
    document.getElementById('perfil-grade-playlists').textContent = MENSAGEM_API_INDISPONIVEL;
    document.getElementById('perfil-favoritos-container').textContent = 'Os detalhes dos favoritos estarão disponíveis quando a API for implementada.';
    atualizarContadorFavoritos();
});

window.abrirModalConfig = abrirModalConfig;
window.fecharModalConfig = fecharModalConfig;
window.salvarNome = salvarNome;
window.salvarEmail = salvarEmail;
window.confirmarDelecao = confirmarDelecao;
window.fecharModalDeletar = fecharModalDeletar;
window.deletarContaDefinitiva = deletarContaDefinitiva;
window.atualizarContadorFavoritos = atualizarContadorFavoritos;
window.mostrarSecao = mostrarSecao;
