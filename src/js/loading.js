// Referências aos elementos que recebem os estados de carregamento.
const telaLoading = document.getElementById("loading-tela");
const listaPokemon = document.getElementById("lista-pokemon");

// Controles que podem iniciar ou alterar uma consulta de Pokémon.
const seletoresControlesConsulta = [
	"#filtro-nome",
	"#lista-regioes input",
	"#lista-tipos input",
	"#somente-origem",
	"#tipos-obrigatorios",
	"#botao-pesquisar"
];

export function esconderLoadingTela() {
	telaLoading.hidden = true;
}

export function mostrarLoadingPokemon() {
	listaPokemon.replaceChildren();
	listaPokemon.setAttribute("aria-busy", "true");

	const indicador = document.createElement("li");
	indicador.className = "loading-pokemon";
	indicador.setAttribute("role", "status");
	indicador.setAttribute("aria-live", "polite");

	const pokebola = document.createElement("img");
	pokebola.className = "loading-pokemon__pokebola";
	pokebola.src = "./src/imagens/pokeball.png";
	pokebola.alt = "";

	const texto = document.createElement("span");
	texto.textContent = "Loading Pokémon...";

	indicador.append(pokebola, texto);
	listaPokemon.appendChild(indicador);
}

export function esconderLoadingPokemon() {
	listaPokemon.removeAttribute("aria-busy");
	listaPokemon
		.querySelector(".loading-pokemon")
		?.remove();
}

export function mostrarErroPokemon(mensagem) {
	listaPokemon.replaceChildren();
	listaPokemon.removeAttribute("aria-busy");

	const aviso = document.createElement("li");
	aviso.className = "mensagem-listagem";
	aviso.setAttribute("role", "alert");
	aviso.textContent = mensagem;

	listaPokemon.appendChild(aviso);
}

export function bloquearControlesConsulta(bloquear) {
	const controles = document.querySelectorAll(
		seletoresControlesConsulta.join(", ")
	);

	controles.forEach((controle) => {
		controle.disabled = bloquear;

		// Marca o rótulo associado para que o CSS também mostre o estado bloqueado.
		const opcaoFiltro = controle.closest(".opcao-filtro");
		opcaoFiltro?.classList.toggle(
			"opcao-filtro--desativada",
			bloquear
		);

		const opcaoExtra = controle.closest(".opcao-extra");
		opcaoExtra?.classList.toggle(
			"opcao-extra--desativada",
			bloquear
		);
	});
}
