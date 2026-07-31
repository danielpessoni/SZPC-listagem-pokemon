import {
	buscarPokemon,
	buscarEspecie,
	buscarGeracao
} from "../api/pokeapi.js";

const cacheGeracoes = new Map();

function organizarTextosPorIdioma(lista, propriedade) {
	return Object.fromEntries(
		lista.map((item) => [
			item.language.name,
			item[propriedade]
				.replace(/\n|\f/g, " ")
				.replace(/\s+/g, " ")
				.trim()
		])
	);
}

function obterGifAnimado(pokemon) {
	return (
		pokemon.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.front_default ??
		pokemon.sprites?.other?.showdown?.front_default ??
		pokemon.sprites?.front_default ??
		null
	);
}

async function obterRegiaoDeOrigem(especie) {
	const urlGeracao = especie.generation.url;

	if (!cacheGeracoes.has(urlGeracao)) {
		const geracao = await buscarGeracao(especie.generation.name);

		cacheGeracoes.set(
			urlGeracao,
			geracao.main_region.name
		);
	}

	return cacheGeracoes.get(urlGeracao);
}

function normalizarPokemon(especie, pokemon, regiao) {
	return {
		id: pokemon.id,

		nomes: organizarTextosPorIdioma(
			especie.names,
			"name"
		),

		descricoes: organizarTextosPorIdioma(
			especie.flavor_text_entries,
			"flavor_text"
		),

		tipos: [...pokemon.types]
			.sort((a, b) => a.slot - b.slot)
			.map((item) => item.type.name),

		gif: obterGifAnimado(pokemon),

		altura: pokemon.height / 10,

		peso: pokemon.weight / 10,

		habilidades: pokemon.abilities.map((item) => ({
			nome: item.ability.name,
			url: item.ability.url,
			oculta: item.is_hidden
		})),

		regioes: [regiao]
	};
}

export async function obterPokemon(identificador) {
	const especie = await buscarEspecie(identificador);

	const pokemon = await buscarPokemon(especie.id);

	const regiao = await obterRegiaoDeOrigem(especie);

	return normalizarPokemon(
		especie,
		pokemon,
		regiao
	);
}