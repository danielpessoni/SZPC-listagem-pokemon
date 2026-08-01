import { buscarRegiao } from "../api/pokeapi.js";
import { obterPokemon } from "../pokemon/normalizar.js";
import {
	existe,
	obter,
	salvar
} from "../navegacao/cache.js";

function extrairId(url) {
	return Number(
		url
			.split("/")
			.filter(Boolean)
			.pop()
	);
}

export async function consultarPorRegiao(nomeRegiao = "kanto") {

	const chaveCache = `regiao:${nomeRegiao}`;

	if (existe(chaveCache)) {
		console.log("Região carregada do cache.");

		return obter(chaveCache);
	}

	console.log("Consultando PokéAPI...");

	const regiao = await buscarRegiao(nomeRegiao);

	const pokedexId = extrairId(
		regiao.pokedexes[0].url
	);

	const { buscarPokedex } = await import("../api/pokeapi.js");

	const pokedex = await buscarPokedex(pokedexId);

	const pokemons = await Promise.all(

		pokedex.pokemon_entries.map((entry) =>
			obterPokemon(
				entry.pokemon_species.name
			)
		)

	);

	salvar(chaveCache, pokemons);

	return pokemons;
}