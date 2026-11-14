# Configuração do Claude Code do Júnior

O que tem aqui e onde colocar cada coisa.

## 1. Skills por departamento (`skills/` e `dist/`)

```
skills/
  instagram/         ig-caption, ig-reel, ig-profile
  agencia-clientes/  agendamento-posts-clientes
  video/             edicao-reels-estilo-junior
```

O que mudou em relação às suas skills atuais:
- A descrição de cada uma agora diz quando usar e qual skill do pacote social-media-skills ela substitui. O Claude escolhe a skill pela descrição, então isso evita que a skill genérica rode no lugar da sua.
- `agendamento-posts-clientes`: hashtags passaram de "4 a 6" para "3 a 5", porque o Instagram aceita no máximo 5.

Para instalar: em claude.ai → Configurações → Capacidades → Skills, substitua cada skill pelo zip correspondente em `dist/`. As skills chegam nas próximas sessões sozinhas.

Sobre "só carregar quando for usada": o Claude Code já funciona assim. No início da sessão entra só o nome e a descrição; o conteúdo completo só carrega quando a skill é chamada. As pastas servem para você se organizar; o ganho real de consistência vem das descrições novas.

## 2. CLAUDE.md global (`CLAUDE.global.md`)

Suas orientações gerais: user stories em tarefas grandes, plano antes de mudanças amplas, qual skill vence quando duas servem, padrões de hashtag e aprovação.

Para instalar no seu computador:

```bash
cp CLAUDE.global.md ~/.claude/CLAUDE.md
```

(Se já existir um `~/.claude/CLAUDE.md`, junte os dois em vez de sobrescrever.)

## 3. CLAUDE.md do projeto

Já está na raiz deste repositório (`../CLAUDE.md`) e vale sempre que o Claude trabalhar no Estúdio JF.

## 4. Pendente: /insights

O relatório do `/insights` é gerado no Claude Code do seu computador. Rode `/insights`, cole ou anexe o relatório numa sessão, e as skills e hooks que ele sugerir entram aqui.
