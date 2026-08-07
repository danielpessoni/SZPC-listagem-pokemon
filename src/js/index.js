const URL_BASE_API = "https://pokeapi.co/api/v2";

const IDIOMA_PADRAO = "pt-BR";
const IDIOMA_FALLBACK = "en";

// ==========================================================
// API
// ==========================================================

async function buscarDados(url) {
	const resposta = await fetch(url);

	if (!resposta.ok) {
		throw new Error(
			`Erro ao consultar a PokéAPI: ${resposta.status} ${resposta.statusText}`
		);
	}

	return resposta.json();
}

async function buscarPokemon(identificador) {
	return buscarDados(`${URL_BASE_API}/pokemon/${identificador}`);
}

async function buscarEspecie(identificador) {
	return buscarDados(`${URL_BASE_API}/pokemon-species/${identificador}`);
}

async function buscarGeracao(identificador) {
	return buscarDados(`${URL_BASE_API}/generation/${identificador}`);
}

async function buscarRegiao(identificador) {
	return buscarDados(`${URL_BASE_API}/region/${identificador}`);
}

async function buscarPokedex(identificador) {
	return buscarDados(`${URL_BASE_API}/pokedex/${identificador}`);
}

async function buscarTipo(identificador) {
	return buscarDados(`${URL_BASE_API}/type/${identificador}`);
}


// ==========================================================
// CACHE
// ==========================================================

const cache = new Map();

function existe(chave) {
	return cache.has(chave);
}

function obter(chave) {
	return cache.get(chave);
}

function salvar(chave, valor) {
	cache.set(chave, valor);
	return valor;
}

function remover(chave) {
	cache.delete(chave);
}

function limpar() {
	cache.clear();
}

function listarChaves() {
	return [...cache.keys()];
}

function inspecionar() {
	console.table(
		[...cache.entries()].map(([chave, valor]) => ({
			chave,
			itens: Array.isArray(valor) ? valor.length : 1
		}))
	);

	return cache;
}


// ==========================================================
// NORMALIZAÇÃO
// ==========================================================

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
		nomes: organizarTextosPorIdioma(especie.names, "name"),
		descricoes: organizarTextosPorIdioma(especie.flavor_text_entries, "flavor_text"),
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

async function obterPokemon(identificador) {
	const chaveCache = `pokemon:${identificador}`;

	if (existe(chaveCache)) {
		return obter(chaveCache);
	}

	const especie = await buscarEspecie(identificador);
	const pokemon = await buscarPokemon(especie.id);
	const regiao = await obterRegiaoDeOrigem(especie);

	const pokemonNormalizado = normalizarPokemon(
		especie,
		pokemon,
		regiao
	);

	salvar(chaveCache, pokemonNormalizado);

	return pokemonNormalizado;
}

async function obterPokemons(identificadores) {
	return Promise.all(
		identificadores.map(
			(identificador) => obterPokemon(identificador)
		)
	);
}


// ==========================================================
// CONSULTA POR REGIÃO
// ==========================================================

function extrairId(url) {
	return Number(
		url
			.split("/")
			.filter(Boolean)
			.pop()
	);
}

async function consultarPorPokedex(nomeRegiao) {
	const chaveCache = `regiao:${nomeRegiao}`;

	if (!existe(chaveCache)) {
		const regiao = await buscarRegiao(nomeRegiao);

		if (!regiao.pokedexes.length) {
			return [];
		}

		const pokedexId = extrairId(regiao.pokedexes[0].url);
		const pokedex = await buscarPokedex(pokedexId);

		const pokemons = await obterPokemons(
			pokedex.pokemon_entries.map(
				(entry) => entry.pokemon_species.name
			)
		);

		salvar(chaveCache, pokemons);
	}

	return obter(chaveCache);
}

async function consultarPorOrigem(nomeRegiao) {
	const chaveCache = `origem:${nomeRegiao}`;

	if (existe(chaveCache)) {
		return obter(chaveCache);
	}

	const pokemons = await consultarPorPokedex(nomeRegiao);

	const originarios = pokemons.filter(
		(pokemon) => pokemon.regioes.includes(nomeRegiao)
	);

	salvar(chaveCache, originarios);

	return originarios;
}


// ==========================================================
// CONSULTA POR TIPO
// ==========================================================

async function consultarPorTipo(tipo) {
	if (!tipo || tipo.trim() === "") {
		return [];
	}

	const chaveCache = `tipo:${tipo}`;

	if (existe(chaveCache)) {
		return obter(chaveCache);
	}

	const dados = await buscarTipo(
		tipo.trim().toLowerCase()
	);

	const pokemons = dados.pokemon.map(
		(item) => item.pokemon.name
	);

	salvar(chaveCache, pokemons);

	return pokemons;
}


// ==========================================================
// CONSULTA POR NOME
// ==========================================================

async function pesquisarPokemonPorNome(nome) {

	if (!nome || nome.trim() === "") {
		return null;
	}

	const pesquisa = nome
		.trim()
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");

	// Procura primeiro em todo o cache
	for (const valor of cache.values()) {

		if (!Array.isArray(valor)) {
			continue;
		}

		const encontrado = valor.find((pokemon) =>
			obterNomePesquisa(pokemon)
				.some((nomePokemon) =>
					nomePokemon.includes(pesquisa)
				)
		);

		if (encontrado) {
			return encontrado;
		}
	}

	// Não encontrou.
	// Tenta diretamente na API.
	try {
		return await obterPokemon(pesquisa);
	}

	catch {
		return null;
	}
}

// ==========================================================
// INTERSEÇÃO DE FILTROS
// ==========================================================

function intersecao(...listas) {
	const listasValidas = listas.filter(
		(lista) => Array.isArray(lista) && lista.length > 0
	);

	if (listasValidas.length === 0) {
		return [];
	}

	if (listasValidas.length === 1) {
		return listasValidas[0];
	}

	return listasValidas.reduce(
		(resultado, listaAtual) =>
			resultado.filter(
				(identificador) =>
					listaAtual.includes(identificador)
			)
	);
}


// ==========================================================
// MENU DE FILTROS
// ==========================================================

const listaRegioes = document.getElementById("lista-regioes");
const listaTipos = document.getElementById("lista-tipos");

function criarOpcao({
	classe,
	grupo,
	valor,
	texto,
	marcado = false,
	ultimo = false
}) {
	const label = document.createElement("label");

	label.className = "opcao-filtro";

	label.innerHTML = `
		<input
			type="checkbox"
			class="${grupo}"
			value="${valor}"
			${marcado ? "checked" : ""}
		>

		<span class="botao-opcao ${classe}">
			${texto}
		</span>

		${ultimo ? "" : '<span class="divisor">|</span>'}
	`;

	return label;
}

async function carregarRegioes() {
	const resposta = await buscarDados(
		`${URL_BASE_API}/region`
	);

	listaRegioes.innerHTML = "";

	for (const regiaoResumo of resposta.results) {

		const regiao = await buscarRegiao(regiaoResumo.name);

		if (regiao.pokedexes.length === 0) {
			continue;
		}

		listaRegioes.appendChild(
			criarOpcao({
				classe: "regiao",
				grupo: "filtro-regiao",
				valor: regiao.name,
				texto:
					regiao.name.charAt(0).toUpperCase() +
					regiao.name.slice(1),
				marcado: regiao.name === "kanto"
			})
		);
	}
}

async function carregarTipos() {
	const resposta = await buscarDados(
		`${URL_BASE_API}/type`
	);

	listaTipos.innerHTML = "";

	const tipos = resposta.results.filter(
		(tipo) =>
			!["unknown", "shadow"].includes(tipo.name)
	);

	tipos.forEach(
		(tipo, indice) => {

			listaTipos.appendChild(
				criarOpcao({
					classe: tipo.name,
					grupo: "filtro-tipo",
					valor: tipo.name,
					texto:
						tipo.name.charAt(0).toUpperCase() +
						tipo.name.slice(1),
					ultimo:
						indice === tipos.length - 1
				})
			);
		}
	);
}

async function carregarMenu() {
	await carregarRegioes();
	await carregarTipos();
}

// ==========================================================
// RENDERIZAÇÃO DOS CARDS
// ==========================================================

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

function obterNomePesquisa(pokemon) {
	const nomes = pokemon.nomes;

	const nomePrincipal =
		nomes[IDIOMA_PADRAO] ??
		nomes[IDIOMA_FALLBACK] ??
		"";

	const nomeIngles =
		nomes[IDIOMA_FALLBACK] ??
		"";

	return [
		nomePrincipal,
		nomeIngles
	]
		.map((nome) =>
			nome
				.toLowerCase()
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "")
		);
}

function criarCardPokemon(pokemon, idioma = "en") {
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

function exibirPokemon(pokemon, idioma = "en") {
	const listaPokemon = document.getElementById("lista-pokemon");

	listaPokemon.appendChild(
		criarCardPokemon(pokemon, idioma)
	);
}


// ==========================================================
// TEMA
// ==========================================================

const botaoAlterarTema = document.getElementById("botao-alterar-tema");
const body = document.body;
const imagemBotaoTrocaDeTema = document.querySelector(".imagem-botao");

botaoAlterarTema.addEventListener("click", () => {

	const modoEscuroEstaAtivo =
		body.classList.contains("modo-escuro");

	body.classList.toggle("modo-escuro");

	imagemBotaoTrocaDeTema.src = modoEscuroEstaAtivo
		? "./src/imagens/sun.png"
		: "./src/imagens/moon.png";
});


// ==========================================================
// INICIALIZAÇÃO
// ==========================================================

function obterTiposSelecionados() {

	return [
		...document.querySelectorAll(
			".filtro-tipo:checked"
		)
	].map(
		(item) => item.value
	);

}


function obterRegioesSelecionadas() {
	return [...document.querySelectorAll(".filtro-regiao:checked")]
		.map(item => item.value);
}

async function pesquisarPorRegioes() {

	const listaPokemon =
		document.getElementById("lista-pokemon");

	listaPokemon.innerHTML = "";

	const regioes =
		obterRegioesSelecionadas();

	if (!regioes.length) {
		return;
	}

	const somenteOrigem =
		document.getElementById("somente-origem").checked;

	const nome =
		document.getElementById("filtro-nome")
			.value
			.trim()
			.toLowerCase();

	const tiposSelecionados =
		obterTiposSelecionados();

	const exigirTodosTipos =
		document.getElementById("tipos-obrigatorios")
			.checked;

	const pokemons = [];

	for (const regiao of regioes) {

		const resultado = somenteOrigem
			? await consultarPorOrigem(regiao)
			: await consultarPorPokedex(regiao);

		pokemons.push(...resultado);
	}

	const filtrados = nome
		? pokemons.filter((pokemon) =>
			obterNomePesquisa(pokemon)
				.some((nomePokemon) =>
					nomePokemon.includes(nome)
				)
		)
		: pokemons;

	const filtradosPorTipo =
		tiposSelecionados.length
			? filtrados.filter((pokemon) =>
				exigirTodosTipos
					? tiposSelecionados.every((tipo) =>
						pokemon.tipos.includes(tipo)
					)
					: tiposSelecionados.some((tipo) =>
						pokemon.tipos.includes(tipo)
					)
			)
			: filtrados;

	const ids = new Set();

	filtradosPorTipo.forEach((pokemon) => {

		if (ids.has(pokemon.id)) {
			return;
		}

		ids.add(pokemon.id);

		exibirPokemon(pokemon);

	});
}

async function pesquisarPorNome() {

	const nome = campoPesquisa.value.trim();

	if (!nome) {
		await pesquisarPorRegioes();
		return;
	}

	const pokemon =
		await pesquisarPokemonPorNome(nome);

	if (!pokemon) {

		console.log("Nenhum Pokémon encontrado");

		return;
	}

	// Marca apenas a região de origem
	document
		.querySelectorAll(".filtro-regiao")
		.forEach((checkbox) => {

			checkbox.checked =
				checkbox.value === pokemon.regioes[0];

		});

	// Atualiza a listagem daquela região
	await pesquisarPorRegioes();
}


async function iniciar() {
	try {
		await carregarMenu();

		document.querySelectorAll(".filtro-regiao").forEach((checkbox) => {
			checkbox.addEventListener("change", pesquisarPorRegioes);
		});
		document.querySelectorAll(".filtro-tipo").forEach((checkbox) => {
			checkbox.addEventListener(
				"change",
				pesquisarPorRegioes
			);
		});

		await pesquisarPorRegioes();

	} catch (erro) {
		console.error(
			"Erro ao carregar aplicação:",
			erro
		);
	}
}

document.getElementById("somente-origem").addEventListener(
	"change",
	pesquisarPorRegioes
);

document.querySelectorAll(".filtro-tipo")
	.forEach((checkbox) => {
		checkbox.addEventListener(
			"change",
			pesquisarPorRegioes
		);
	});

document
	.getElementById("tipos-obrigatorios")
	.addEventListener(
		"change",
		pesquisarPorRegioes
	);


const botaoPesquisar = document.getElementById("botao-pesquisar");
const campoPesquisa = document.getElementById("filtro-nome");


botaoPesquisar.addEventListener(
	"click",
	pesquisarPorNome
);

campoPesquisa.addEventListener("keydown", (evento) => {

	if (evento.key === "Enter") {
		pesquisarPorNome();
	}

});

iniciar();