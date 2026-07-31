import {
    buscarPokemon,
    buscarEspecie,
    buscarGeracao,
    buscarRegiao
} from "../api/pokeapi.js";

async function testarAPI() {
    try {
        const pokemon = await buscarPokemon("bulbasaur");
        console.log("Pokémon:", pokemon.name, pokemon.id);

        const especie = await buscarEspecie(1);
        console.log("Espécie:", especie.name);

        const geracao = await buscarGeracao("generation-i");
        console.log(
            "Geração:",
            geracao.name,
            "| Região principal:",
            geracao.main_region.name
        );

        const regiao = await buscarRegiao("kanto");
        console.log(
            "Região:",
            regiao.name,
            "| Geração principal:",
            regiao.main_generation.name
        );
    } catch (erro) {
        console.error("Falha no teste da PokéAPI:", erro);
    }
}

testarAPI();