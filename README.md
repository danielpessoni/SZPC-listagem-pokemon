# 🔴 Listagem Pokémon — Pokédex Interativa

Aplicação web interativa estilo **Pokédex** desenvolvida durante a **Semana do Zero ao Programador Contratado (SZPC)**, promovida pela escola **Dev em Dobro**. O projeto apresenta uma vitrine dos primeiros Pokémon da região de Kanto em formato de cartões animados, contando com sistema de alternância de tema (Dark Mode / Light Mode) e estilização personalizada por tipo elemental.

---

## 🕹️ Funções Existentes

A interface combina elementos visuais nostálgicos com controle de estado e usabilidade:

*   **Alternância de Tema (Dark Mode / Light Mode):** Botão no cabeçalho que alterna o visual da página entre modo claro e escuro, atualizando dinamicamente a cor de fundo do `body`, o tom dos cards e o ícone do botão (Sol/Lua).
*   **Cards Animados com Ilustrações `.gif`:** Exibição dos Pokémon com sprites animados clássicos da franquia e numeração oficial da Pokédex (`#001`, `#002`, etc.).
*   **Estilização Temática por Tipo Elemental:** Badges e efeitos de *hover* estilizados com cores associadas aos tipos dos Pokémon (Grama, Veneno, Fogo, Água e Inseto).
*   **Scrollbar Personalizada:** Barra de rolagem customizada via CSS para o conteúdo descritivo dos cartões e para a página principal.

---

## 💻 Recursos de Código

A aplicação utiliza técnicas de controle de classe no DOM e regras CSS reutilizáveis:

*   **Gerenciamento de Estado Dinâmico:** Uso de `classList.contains()` e `classList.toggle()` no JavaScript para verificar o estado ativo do tema e alterar a propriedade `src` da imagem do botão (`sun.png` / `moon.png`).
*   **Customização Avançada de Scrollbar:** Uso das pseudo-classes `-webkit-scrollbar`, `-webkit-scrollbar-track` e `-webkit-scrollbar-thumb` para harmonizar o design das barras de rolagem com a paleta de cores do projeto.
*   **Efeitos Micro-interativos com CSS:** Aplicação do efeito `transform: scale(1.05)` no *hover* dos cartões e ícones, criando uma sensação tátil de elevação.
*   **Grid Fluido com Flexbox:** Organização dos cards em um contêiner flexível com `flex-wrap: wrap` e espaçamento uniforme (`gap: 30px`), garantindo adaptação natural a telas de diferentes resoluções.

---

## 🛠️ Stacks Utilizadas

*   **HTML5:** Estruturação semântica com tags `<header>`, `<main>` e listas não ordenadas (`<ul>`, `<li>`) para a grade de cartões.
*   **CSS3 Tradicional:** Estilização baseada em variáveis de classe, seletores encadeados, transições de estado (`transition: 0.2s ease-in-out`), pseudo-elementos de scrollbar e responsividade via Flexbox.
*   **JavaScript (Vanilla JS):** Seleção de elementos (`getElementById`, `querySelector`), escuta de eventos de clique e alternância de classes/atributos no DOM.

---

## 🎯 Contexto e Propósito Histórico

Este repositório registra o aprendizado inicial na implementação de sistemas de alternância de temas (*Dark/Light Mode*) e manipulação dinâmica de assets via JavaScript. O projeto serviu para consolidar a integração entre lógica procedural simples e estilização CSS modular, preservando a essência do exercício prático realizado durante a formação.
