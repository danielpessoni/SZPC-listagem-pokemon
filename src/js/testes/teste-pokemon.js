import { obterPokemon } from "../pokemon/pokemon.js";

async function testarPokemon() {
	try {
		const bulbasaur = await obterPokemon("bulbasaur");

		console.log("Pokémon normalizado:");
		console.log(bulbasaur);
	} catch (erro) {
		console.error(
			"Não foi possível obter e normalizar o Pokémon:",
			erro
		);
	}
}

testarPokemon();