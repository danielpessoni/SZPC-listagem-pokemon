import { consultarPorRegiao } from "../filtros/regiao.js";

console.time("Primeira consulta");

const primeira = await consultarPorRegiao();

console.timeEnd("Primeira consulta");

console.log(
	`${primeira.length} Pokémon`
);

console.time("Segunda consulta");

const segunda = await consultarPorRegiao();

console.timeEnd("Segunda consulta");

console.log(
	`${segunda.length} Pokémon`
);