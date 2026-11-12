//função de busca de músicas ou artistas
function buscar() {
    const campo = document.getElementById('campo-busca');
    const resultados = document.getElementById('resultados');
    const estadoVazio = document.getElementById('estado-vazio');
    if (!campo || !resultados || !estadoVazio) return;

    resultados.textContent = '';
    estadoVazio.style.display = 'block';
    estadoVazio.textContent = campo.value.trim().length < 2
        ? 'Digite algo para começar a explorar...'
        : 'A busca estará disponível quando a API for implementada.';
}

window.buscar = buscar;
