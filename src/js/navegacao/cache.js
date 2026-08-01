const cache = new Map();

/**
 * Verifica se existe um item salvo.
 */
export function existe(chave) {
	return cache.has(chave);
}

/**
 * Obtém um item do cache.
 */
export function obter(chave) {
	return cache.get(chave);
}

/**
 * Salva ou atualiza um item.
 */
export function salvar(chave, valor) {
	cache.set(chave, valor);

	return valor;
}

/**
 * Remove um item do cache.
 */
export function remover(chave) {
	cache.delete(chave);
}

/**
 * Limpa completamente o cache.
 */
export function limpar() {
	cache.clear();
}

/**
 * Lista todas as chaves armazenadas.
 * Muito útil durante o desenvolvimento.
 */
export function listarChaves() {
	return [...cache.keys()];
}

/**
 * Exibe todo o conteúdo do cache.
 * Deve ser usado apenas para testes.
 */
export function inspecionar() {
	console.table(
		[...cache.entries()].map(([chave, valor]) => ({
			chave,
			itens: Array.isArray(valor)
				? valor.length
				: 1
		}))
	);

	return cache;
}