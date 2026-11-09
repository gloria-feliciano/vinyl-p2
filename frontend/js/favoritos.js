function carregarFavoritos() {
    const container = document.getElementById('lista-favoritos');
    if (!container) return;

    const favoritos = JSON.parse(localStorage.getItem('meus_favoritos') || '[]');
    container.textContent = favoritos.length === 0
        ? 'Ainda não tens músicas favoritas.'
        : `${favoritos.length} favorito(s) salvo(s) neste navegador. Os detalhes das músicas estarão disponíveis quando a API for implementada.`;
}

document.addEventListener('DOMContentLoaded', carregarFavoritos);
window.carregarFavoritos = carregarFavoritos;
