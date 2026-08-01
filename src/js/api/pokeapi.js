const URL_BASE_API = "https://pokeapi.co/api/v2";

async function buscarDados(url) {
	const resposta = await fetch(url);

	if (!resposta.ok) {
		throw new Error(
			`Erro ao consultar a PokéAPI: ${resposta.status} ${resposta.statusText}`
		);
	}

	return resposta.json();
}

export async function buscarPokemon(identificador) {
	return buscarDados(`${URL_BASE_API}/pokemon/${identificador}`);
}

export async function buscarEspecie(identificador) {
	return buscarDados(`${URL_BASE_API}/pokemon-species/${identificador}`);
}

export async function buscarGeracao(identificador) {
	return buscarDados(`${URL_BASE_API}/generation/${identificador}`);
}

export async function buscarRegiao(identificador) {
	return buscarDados(`${URL_BASE_API}/region/${identificador}`);
}

export async function buscarPokedex(identificador) {
	return buscarDados(`${URL_BASE_API}/pokedex/${identificador}`);
}

export async function buscarTipo(identificador) {
    return buscarDados(`${URL_BASE_API}/type/${identificador}`);
}