function formatarNumero(numero) {
	return `#${String(numero).padStart(3, "0")}`;
}

function formatarTexto(texto) {
	return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function obterTextoPokemon(pokemon, idioma = "en") {
	return pokemon.nomes[idioma] ?? pokemon.nomes.en;
}

function obterDescricaoPokemon(pokemon, idioma = "en") {
	return pokemon.descricoes[idioma] ?? pokemon.descricoes.en;
}

export function criarCardPokemon(pokemon, idioma = "en") {
	const modeloCard = document.getElementById("modelo-card-pokemon");
	const card = modeloCard.content.cloneNode(true);

	const elementoCard = card.querySelector(".cartao-pokemon");
	const nome = card.querySelector(".nome");
	const numero = card.querySelector(".numero");
	const gif = card.querySelector(".gif");
	const tipos = card.querySelector(".tipos");
	const descricao = card.querySelector(".descricao");

	nome.textContent = obterTextoPokemon(pokemon, idioma);
	numero.textContent = formatarNumero(pokemon.id);

	gif.src = pokemon.gif;
	gif.alt = obterTextoPokemon(pokemon, idioma);

	descricao.textContent = obterDescricaoPokemon(pokemon, idioma);

	pokemon.tipos.forEach((tipo) => {
		const elementoTipo = document.createElement("li");

		elementoTipo.classList.add("tipo", tipo);
		elementoTipo.textContent = formatarTexto(tipo);

		tipos.appendChild(elementoTipo);
	});

	elementoCard.classList.add(pokemon.tipos[0]);

	return card;
}

export function exibirPokemon(pokemon, idioma = "en") {
	const listaPokemon = document.getElementById("lista-pokemon");

	listaPokemon.appendChild(
		criarCardPokemon(pokemon, idioma)
	);
}