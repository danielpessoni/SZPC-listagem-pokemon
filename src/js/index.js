import { consultarPorRegiao } from "./filtros/regiao.js";
import { exibirPokemon } from "./pokemon/renderizar.js";

const botaoAlterarTema = document.getElementById("botao-alterar-tema");
const body = document.body;
const imagemBotaoTrocaDeTema = document.querySelector(".imagem-botao");

botaoAlterarTema.addEventListener("click", () => {
	const modoEscuroEstaAtivo = body.classList.contains("modo-escuro");

	body.classList.toggle("modo-escuro");

	imagemBotaoTrocaDeTema.src = modoEscuroEstaAtivo
		? "./src/imagens/sun.png"
		: "./src/imagens/moon.png";
});

async function iniciar() {
	try {
		const pokemons = await consultarPorRegiao("kanto");

		pokemons.forEach((pokemon) => {
			exibirPokemon(pokemon);
		});
	} catch (erro) {
		console.error(
			"Erro ao carregar os Pokémon:",
			erro
		);
	}
}

iniciar();