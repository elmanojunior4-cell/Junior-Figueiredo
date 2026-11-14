# Estúdio JF — galeria, seleção e venda de fotos extras

App Next.js 15 (App Router, React 19, TypeScript, Tailwind 4) que substitui o Alboom Proof. O casal acessa a galeria com senha, marca as fotos do álbum e, se passar do pacote, paga as extras pelo Mercado Pago. Detalhes de instalação estão no README.md.

## Mapa rápido

- `src/app/admin/`: painel do estúdio (protegido por `src/lib/auth.ts`).
- `src/app/g/[slug]/`: galeria do casal e checkout.
- `src/app/api/mp/webhook`: confirmação de pagamento; é o que fecha a seleção acima do pacote.
- `src/lib/`: banco (Supabase), R2, preços, Mercado Pago e variáveis de ambiente (`env.ts`, validado com zod).
- `supabase/migrations/`: esquema do banco. Mudança de tabela vai num arquivo novo numerado, para não quebrar bancos que já rodaram os anteriores.

## Comandos

- `npm run dev`: servidor local em http://localhost:3000 (precisa do `.env.local`).
- `npm run lint` e `npm run build`: rode os dois antes de dar uma mudança por pronta. O build pega erros de tipo que o lint não pega.

## Orientações

- Código que usa chaves secretas (service role do Supabase, token do R2 e do Mercado Pago) fica em arquivos do servidor, com `import "server-only"`. Motivo: se for parar no navegador, a chave vaza.
- Valores de dinheiro e limite de fotos são calculados no servidor (`src/lib/pricing.ts`), a partir do banco e não do que o navegador manda. Motivo: o casal poderia alterar o preço pela requisição.
- O webhook do Mercado Pago pode chegar repetido ou fora de ordem; trate cada evento de forma que processar duas vezes dê o mesmo resultado.
- Os textos da interface são em português do Brasil, falando com o casal de forma calorosa e simples.

## Tarefas grandes

Para um módulo novo (CRM, avisos de WhatsApp, diagramador de álbum) ou uma mudança que atravesse várias telas, comece pedindo as user stories ("quando eu fizer X, quero ver Y"). Elas viram o critério de pronto; o caminho técnico é com você. Motivo: o Júnior sabe o que quer ver na tela, não necessariamente como construir.
