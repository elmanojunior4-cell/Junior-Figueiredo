# Estúdio JF — Galeria, seleção e venda de fotos extras

Sistema próprio da Júnior Figueiredo Fotografia para substituir o Alboom Proof.

**Módulo 1 (este):** galeria do casal por momentos, seleção das fotos do álbum, cobrança automática das fotos extras (Mercado Pago) e lista pronta para o Lightroom.
**Próximos módulos:** CRM com funil e Google Agenda, avisos por WhatsApp, diagramador de álbum integrado.

## Como funciona

1. Na área do estúdio (`/admin`), crie a galeria do casal com o limite do pacote e o preço das extras.
2. Suba as fotos tratadas por seção (Pré-wedding, Making of, Cerimônia, Recepção). O navegador gera a versão web com marca d'água e a miniatura; o original vai em alta para o R2.
3. Publique e envie o link + senha pelo WhatsApp (a mensagem já vem pronta para copiar).
4. O casal marca as fotos com o coração. Ao finalizar:
   - dentro do pacote → a seleção fecha na hora;
   - acima do pacote → abre o checkout do Mercado Pago (Pix ou cartão em até 12x) e a seleção fecha quando o pagamento é aprovado.
5. Na galeria, copie a lista "Para o Lightroom" e cole no Filtro da Biblioteca → Texto → Nome do arquivo → Contém.

## Instalação

### 1. Supabase (banco de dados)
1. Crie um projeto em supabase.com.
2. Em **SQL Editor**, rode o arquivo `supabase/migrations/0001_galeria.sql`.
3. Em **Project Settings → API**, copie a URL e a `service_role key`.

### 2. Cloudflare R2 (fotos)
1. Crie o bucket `estudio-jf-fotos` (privado).
2. Em **Manage API tokens**, crie um token com *Object Read & Write* nesse bucket.
3. Em **Settings → CORS policy** do bucket, cole:
```json
[
  {
    "AllowedOrigins": ["https://galeria.seudominio.com.br", "http://localhost:3000"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

### 3. Mercado Pago
1. Em **Suas integrações**, crie uma aplicação e copie o *Access Token de produção*.
2. Em **Webhooks**, cadastre `https://galeria.seudominio.com.br/api/mp/webhook` com o evento **Pagamentos** e copie a assinatura secreta.

### 4. Vercel
1. Importe este repositório na Vercel.
2. Em **Settings → Environment Variables**, preencha as variáveis do `.env.example`.
3. Em **Settings → Domains**, adicione `galeria.seudominio.com.br` e crie o registro CNAME indicado no seu provedor de domínio.

### Rodar no computador
```bash
cp .env.example .env.local   # preencha os valores
npm install
npm run dev                  # http://localhost:3000
```

## Estrutura

```
src/app/admin/            painel do estúdio (lista, nova galeria, detalhe)
src/app/g/[slug]/         galeria do casal (senha, seleção, lightbox, checkout)
src/app/api/admin/        URLs assinadas de upload e registro de fotos
src/app/api/g/[slug]/     seleção, finalização e download em alta
src/app/api/mp/webhook    confirmação de pagamento do Mercado Pago
src/lib/                  banco, R2, sessão, preços e Mercado Pago
supabase/migrations/      esquema do banco
```

A tabela `gallery_events` registra cada passo do casal (início da seleção, finalização, pagamento). Ela vai alimentar o CRM e os avisos de WhatsApp nos próximos módulos.
