function renderizarApp() {
    mostrarAvisoApi(document.getElementById('vitrine-musicas'));
}

function carregarArtistasExplorar() {
    mostrarAvisoApi(document.getElementById('lista-artistas'));
}

function toggleFab() {
    const opcoes = document.getElementById('fab-options');
    if (opcoes) opcoes.style.display = opcoes.style.display === 'flex' ? 'none' : 'flex';
}

function alternarFavoritoDoMain(id) {
    alternarFavoritoGlobal(id);
}

function buscarSugestoesReview() {
    mostrarAvisoApi(document.getElementById('sugestoes-review'));
    const sugestoes = document.getElementById('sugestoes-review');
    if (sugestoes) sugestoes.style.display = 'block';
}

function selecionarMusicaReview(titulo, artista) {
    const musica = document.getElementById('rev-musica');
    const nomeArtista = document.getElementById('rev-artista');
    if (musica) musica.value = titulo;
    if (nomeArtista) nomeArtista.value = artista;
    const sugestoes = document.getElementById('sugestoes-review');
    if (sugestoes) sugestoes.style.display = 'none';
}

function selecionarEstrelas(nota) {
    notaSelecionada = nota;
    document.querySelectorAll('.star').forEach((estrela, indice) => {
        estrela.style.color = indice < nota ? '#e81856' : '#444';
    });
}

function salvarReview() {
    alert(MENSAGEM_API_INDISPONIVEL);
}

function prepararModalReview(titulo = '', artista = '') {
    const musica = document.getElementById('rev-musica');
    const nomeArtista = document.getElementById('rev-artista');
    const modal = document.getElementById('modal-overlay');
    if (musica) musica.value = titulo;
    if (nomeArtista) nomeArtista.value = artista;
    if (modal) modal.style.display = 'flex';
}

function fecharModal() {
    const modal = document.getElementById('modal-overlay');
    if (modal) modal.style.display = 'none';
    notaSelecionada = 0;
    document.querySelectorAll('.star').forEach(estrela => { estrela.style.color = '#444'; });
    const texto = document.getElementById('rev-texto');
    if (texto) texto.value = '';
}

function prepararModalPlaylist() {
    musicasSelecionadasParaPlaylist = [];
    const nome = document.getElementById('play-nome');
    const busca = document.getElementById('busca-musica-playlist');
    const lista = document.getElementById('lista-musicas-selecionadas');
    const modal = document.getElementById('modal-playlist');
    if (nome) nome.value = '';
    if (busca) busca.value = '';
    if (lista) lista.textContent = 'Nenhuma música adicionada';
    if (modal) modal.style.display = 'flex';
}

function buscarMusicasParaPlaylist() {
    const sugestoes = document.getElementById('sugestoes-playlist');
    mostrarAvisoApi(sugestoes);
    if (sugestoes) sugestoes.style.display = 'block';
}

function adicionarMusicaLista(titulo, artista, id) {
    if (musicasSelecionadasParaPlaylist.some(musica => musica.id === id)) return;
    musicasSelecionadasParaPlaylist.push({ id, titulo, artista });
    renderizarMusicasSelecionadas();
}

function renderizarMusicasSelecionadas() {
    const container = document.getElementById('lista-musicas-selecionadas');
    if (!container) return;
    container.replaceChildren();

    if (musicasSelecionadasParaPlaylist.length === 0) {
        container.textContent = 'Nenhuma música adicionada';
        return;
    }

    musicasSelecionadasParaPlaylist.forEach((musica, indice) => {
        const item = document.createElement('div');
        item.className = 'd-flex justify-content-between align-items-center mb-2 p-2';
        const titulo = document.createElement('span');
        titulo.textContent = `${musica.titulo} - ${musica.artista}`;
        const remover = document.createElement('button');
        remover.type = 'button';
        remover.textContent = '✕';
        remover.addEventListener('click', () => removerMusicaLista(indice));
        item.append(titulo, remover);
        container.appendChild(item);
    });
}

function removerMusicaLista(indice) {
    musicasSelecionadasParaPlaylist.splice(indice, 1);
    renderizarMusicasSelecionadas();
}

function salvarPlaylist() {
    alert(MENSAGEM_API_INDISPONIVEL);
}

function fecharModalPlaylist() {
    const modal = document.getElementById('modal-playlist');
    if (modal) modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarApp();
    carregarArtistasExplorar();
});

window.renderizarApp = renderizarApp;
window.carregarArtistasExplorar = carregarArtistasExplorar;
window.toggleFab = toggleFab;
window.alternarFavoritoDoMain = alternarFavoritoDoMain;
window.buscarSugestoesReview = buscarSugestoesReview;
window.selecionarMusicaReview = selecionarMusicaReview;
window.selecionarEstrelas = selecionarEstrelas;
window.salvarReview = salvarReview;
window.prepararModalReview = prepararModalReview;
window.fecharModal = fecharModal;
window.prepararModalPlaylist = prepararModalPlaylist;
window.buscarMusicasParaPlaylist = buscarMusicasParaPlaylist;
window.adicionarMusicaLista = adicionarMusicaLista;
window.removerMusicaLista = removerMusicaLista;
window.salvarPlaylist = salvarPlaylist;
window.fecharModalPlaylist = fecharModalPlaylist;
