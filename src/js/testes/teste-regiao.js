import { consultarPorRegiao } from "../filtros/regiao.js";

const REGIAO = "paldea";
// Exemplos:
// "kanto"
// "johto"
// "hoenn"
// "sinnoh"
// "unova"
// "kalos"
// "alola"
// "galar"
// "paldea"

async function testarRegiao(nomeRegiao) {
	try {
		console.log(`\n===== ${nomeRegiao.toUpperCase()} =====`);

		console.time("Tempo da consulta");

		const pokemons = await consultarPorRegiao(nomeRegiao);

		console.timeEnd("Tempo da consulta");

		console.log(
			`Pokémon encontrados: ${pokemons.length}`
		);

		if (pokemons.length === 0) {
			console.warn("Nenhum Pokémon encontrado.");

			return;
		}

		console.log("\nPrimeiros 10 Pokémon:");

		console.table(
			pokemons
				.slice(0, 10)
				.map((pokemon) => ({
					id: pokemon.id,
					nome:
						pokemon.nomes.pt ??
						pokemon.nomes.en,
					tipos: pokemon.tipos.join(", "),
					regiao: pokemon.regioes.join(", ")
				}))
		);

		console.log(
			"\nÚltimo Pokémon da lista:"
		);

		const ultimo = pokemons.at(-1);

		console.table([
			{
				id: ultimo.id,
				nome:
					ultimo.nomes.pt ??
					ultimo.nomes.en,
				tipos: ultimo.tipos.join(", "),
				regiao: ultimo.regioes.join(", ")
			}
		]);

	} catch (erro) {
		console.error(
			`Erro ao consultar ${nomeRegiao}:`,
			erro.message
		);
	}
}

await testarRegiao(REGIAO);