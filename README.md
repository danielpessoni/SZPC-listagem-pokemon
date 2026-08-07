# 🔴 Listagem Pokémon — Pokédex Interativa

Aplicação web interativa inspirada em uma Pokédex, desenvolvida inicialmente durante a **Semana do Zero ao Programador Contratado (SZPC)**, promovida pela escola **Dev em Dobro**.

O projeto começou como uma interface de listagem de Pokémon e evoluiu para uma aplicação frontend completa, utilizando consumo de API, filtros dinâmicos, cache de dados e manipulação avançada do DOM.

A aplicação utiliza a **PokéAPI** como fonte de dados para carregar informações dos Pokémon, permitindo explorar criaturas por região, tipo e nome através de uma interface responsiva e temática.

---

## 🕹️ Funcionalidades

### 🔎 Pesquisa por nome

* Busca Pokémon pelo nome utilizando os dados armazenados em cache.
* Caso o Pokémon ainda não esteja carregado, realiza consulta à API.
* A pesquisa considera nomes em diferentes idiomas disponíveis na API, priorizando português brasileiro e inglês.
* Permite pesquisas parciais (ex.: "char" encontra Pokémon como Charmander, Charmeleon e Charizard).

---

### 🌎 Filtros por região

* Carregamento dinâmico das regiões disponíveis através da PokéAPI.
* Consulta dos Pokémon presentes na Pokédex principal de cada região.
* Permite selecionar uma ou mais regiões simultaneamente.
* Possui opção para exibir apenas Pokémon originários da região selecionada.

---

### 🧬 Filtros por tipo

* Carregamento dinâmico dos tipos disponíveis através da API.
* Filtragem dos Pokémon carregados no cache.
* Permite selecionar múltiplos tipos.
* Suporta combinação entre filtros de região, nome e tipo.

---

### 🌙 Alternância de tema

* Alternância entre modo claro e modo escuro.
* Alteração dinâmica das classes CSS e do ícone do botão.
* Persistência visual baseada no estado atual da aplicação.

---

### 🃏 Cards de Pokémon

Cada Pokémon exibido apresenta:

* Número oficial da Pokédex;
* Nome;
* Sprite animado;
* Tipos;
* Descrição;
* Estilização visual baseada no tipo principal.

---

## ⚙️ Recursos técnicos

### Consumo de API

A aplicação utiliza a:

* **PokéAPI**
  https://pokeapi.co/

As informações são obtidas dinamicamente através de requisições HTTP utilizando `fetch()` e funções assíncronas com `async/await`.

---

### Normalização de dados

Como a API retorna informações distribuídas em diferentes endpoints, os dados são tratados e reorganizados antes da exibição.

O processo inclui:

* Associação entre espécie e dados de batalha;
* Organização de nomes por idioma;
* Tratamento das descrições;
* Identificação da região de origem;
* Seleção de sprites animados.

---

### Sistema de cache

Foi implementado um sistema próprio de cache utilizando `Map` do JavaScript.

O objetivo é:

* Evitar consultas repetidas à API;
* Melhorar a velocidade de navegação;
* Permitir que filtros trabalhem sobre dados já carregados;
* Reduzir requisições desnecessárias.

---

### Manipulação dinâmica do DOM

A interface é construída dinamicamente utilizando JavaScript puro:

* Criação dos filtros de região e tipo;
* Renderização dos cards através de `<template>`;
* Controle de eventos;
* Atualização dos resultados conforme os filtros selecionados.

---

## 🛠️ Tecnologias utilizadas

### HTML5

* Estrutura semântica utilizando elementos como:

  * `<header>`;
  * `<main>`;
  * `<section>`;
  * `<template>`;
  * listas para renderização dos Pokémon.

---

### CSS3

Utilização de:

* Variáveis CSS;
* Organização modular de arquivos;
* Responsividade;
* Flexbox;
* Animações e transições;
* Personalização de scrollbar;
* Temas claro e escuro.

---

### JavaScript (Vanilla JS)

Aplicação desenvolvida sem frameworks, utilizando:

* `fetch`;
* `async/await`;
* `Map`;
* Manipulação do DOM;
* Eventos;
* Modularização por responsabilidade;
* Tratamento e transformação de dados.

---

## 📂 Estrutura do projeto

```
/
├── index.html
│
├── src/
│   ├── css/
│   │   ├── base.css
│   │   ├── filtros.css
│   │   ├── pokemon.css
│   │   ├── reset.css
│   │   ├── scrollbar.css
│   │   └── variaveis.css
│   │
│   ├── imagens/
│   │
│   └── js/
│       └── index.js
```

---

## 🎯 Evolução do projeto

Este projeto representa uma evolução de uma aplicação inicialmente focada em interface e estilização para uma aplicação frontend com integração externa e gerenciamento de dados.

Durante o desenvolvimento foram aplicados conceitos como:

* Consumo de APIs REST;
* Organização de código JavaScript;
* Cache de informações;
* Filtragem e transformação de dados;
* Separação de responsabilidades;
* Evolução incremental utilizando Git.

---

## 👨‍💻 Sobre o projeto

Desenvolvido como parte da jornada de aprendizado frontend durante a **Semana do Zero ao Programador Contratado**, evoluindo posteriormente através de melhorias próprias e experimentação com consumo de APIs reais.

O  repositório original desenvolvido na **Semana do Zero ao Programador Contratado** pode ser acessado [aqui](https://github.com/devemdobro/projeto-listagem-pokemon)
