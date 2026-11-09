# Vinyl

Frontend estático do projeto Vinyl, feito com HTML, CSS e JavaScript.

## Executar

Sirva a pasta `frontend` com qualquer servidor HTTP estático. Por exemplo, com Python:

```powershell
python -m http.server 3000 --directory frontend
```

Abra `http://localhost:3000` no navegador. Não é necessário instalar dependências npm.

O Bootstrap é carregado por CDN, então a conexão com a internet é necessária para os estilos correspondentes. A API ainda não foi implementada; autenticação, catálogo, reviews e playlists dependem dela.

## Estrutura

- `frontend/`: páginas, estilos e scripts do frontend existente.
- `api/`: estrutura inicial reservada para a futura API; nenhuma tecnologia de backend foi definida.
