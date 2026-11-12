//função responsável por filtrar músicas por gênero
function filtrarPorGenero(genero) {
    const container = document.getElementById('resultado-explorar');
    mostrarAvisoApi(container, `A busca por ${genero} estará disponível quando a API for implementada.`);
}

document.addEventListener('DOMContentLoaded', () => {
    filtrarPorGenero('músicas');
});

window.filtrarPorGenero = filtrarPorGenero;
