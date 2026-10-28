# DevMetrics

Plataforma web para explorar e comparar perfis públicos do GitHub: estatísticas, linguagens, repositórios e comparação lado a lado.

> **Aviso:** as análises usam apenas dados públicos da GitHub REST API e **não medem a qualidade nem a capacidade profissional** de quem desenvolve.

## Funcionalidades

- Busca por usuário (botão ou Enter), com validação e links compartilháveis (`/u/:usuario`).
- Perfil: avatar, bio, localização, empresa, site, data e idade da conta, botão de copiar link.
- Cards: repositórios, seguidores, seguindo, estrelas, forks e atividade em 30 dias (os três últimos calculados só sobre os repositórios carregados, e a interface avisa).
- Gráfico de rosca de linguagens (linguagem principal por repositório; sem linguagem = "Não definida") e resumo analítico.
- Lista de repositórios com busca, filtro por linguagem, ordenação e "Carregar mais".
- Comparação de dois perfis (`/comparar?a=...&b=...`) com barras proporcionais, diferença absoluta e repositórios mais estrelados.
- Tema escuro/claro persistido localmente; tratamento de 404, limite de requisições (403/429), erro de rede e timeout.

## Tecnologias

React 18, TypeScript (strict), Vite, Tailwind CSS, Recharts, Lucide React, React Router, Vitest + Testing Library, ESLint.

## Como executar

Requisitos: Node.js 18+ e npm.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # typecheck + build de produção
npm run lint
npm test
```

## Estrutura

`src/services` (API), `src/utils` (análises, validação, formatação), `src/hooks`, `src/pages`, `src/components/{layout,ui,charts,repositories,profile}`, `src/types`.

## Integração com a GitHub REST API

Endpoints: `GET /users/{usuario}` e `GET /users/{usuario}/repos?sort=updated&per_page=100`. Seguidores e seguindo vêm do próprio objeto do usuário.

- **Paginação:** só a primeira página (até 100 repositórios) é carregada. Quando o perfil tem mais, a interface exibe um aviso; as estatísticas não representam o total.
- **Rate limit:** sem token, o limite é baixo (60 requisições/hora por IP). Ao atingi-lo, o app mostra o horário de liberação informado pela API.
- **Cache:** em memória, 5 minutos por usuário. Requisições obsoletas são canceladas com `AbortController`, com timeout de 15 s.
- **Token:** o app não usa token e não lê variáveis `VITE_*` com segredos. Para limites maiores, seria necessário um proxy no servidor (não incluído).

## Deploy

`npm run build` gera `dist/`, publicável em qualquer hospedagem estática. Configure o fallback de rotas para `index.html` (SPA).

## Melhorias futuras

Favoritos, histórico de pesquisas, exportação em JSON, gráficos de repositórios por período e de estrelas × forks, gráfico comparativo de linguagens, testes de componentes e screenshots reais.
