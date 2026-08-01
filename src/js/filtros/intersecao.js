export function intersecao(...listas) {
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