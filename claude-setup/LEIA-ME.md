# Configuração do Claude Code do Júnior

## Instalação rápida (pelo Claude Code do Mac)

No Terminal:

```bash
cd ~/estudio-jf-config && git pull && claude
```

Dentro do Claude, cole:

```
Leia ~/estudio-jf-config/claude-setup/LEIA-ME.md e faça a seção "Passos para o Claude do Mac". Me mostre o plano antes e espere meu ok.
```

## Passos para o Claude do Mac

1. **CLAUDE.md global:** compare `claude-setup/CLAUDE.global.md` com `~/.claude/CLAUDE.md`. Se o atual for a versão anterior deste mesmo arquivo, substitua. Se tiver conteúdo diferente, junte os dois e mostre o resultado ao Júnior antes de salvar.
2. **Hook de segurança:**
   - copie `claude-setup/hooks/bloqueia-comandos-arriscados.sh` para `~/.claude/hooks/` e dê `chmod +x`;
   - acrescente o conteúdo de `claude-setup/hooks/settings-trecho.json` em `~/.claude/settings.json`, juntando com o que já existir (sem apagar outros hooks ou permissões);
   - teste: `echo '{"tool_input":{"command":"pkill -f prpr"}}' | ~/.claude/hooks/bloqueia-comandos-arriscados.sh; echo $?` deve imprimir a mensagem de bloqueio e `2`. Com `ls` deve dar `0`.
3. **Erro "python: command not found":** encontre os hooks que chamam `python` (em `~/.claude/settings.json` e nos plugins em `~/.claude/plugins/`). Onde a configuração for do Júnior, troque por `python3`. Se estiver dentro de um plugin, diga qual é e se vale desativar ou reinstalar.
4. **Skills:** as skills do Júnior vêm do claude.ai. Abra `claude-setup/dist` no Finder (`open`) e lembre o Júnior de subir os zips em claude.ai → Configurações → Capacidades → Skills (as novas são `edicao-premiere` e `backup-casamento`).
5. Termine com uma tabela: FEITO / PENDENTE / O QUE O JÚNIOR PRECISA FAZER À MÃO.

## O que tem aqui

```
skills/
  instagram/         ig-caption, ig-reel, ig-profile
  agencia-clientes/  agendamento-posts-clientes
  video/             edicao-reels-estilo-junior, edicao-premiere (nova)
  arquivo/           backup-casamento (nova)
dist/                um zip por skill, para subir no claude.ai
hooks/               hook de segurança + trecho do settings.json
CLAUDE.global.md     orientações gerais (vai para ~/.claude/CLAUDE.md)
```

### Vindo do relatório /insights (14/11/2026)

- **edicao-premiere:** lista de takes aprovada antes de montar, XML primeiro, ponte MCP uma chamada por vez, sem matar o prpr nem duplicar o .prproj, conferência final.
- **backup-casamento:** HD somente leitura, confirmação de destino, rsync com verificação, atualização do _CATALOGO e "pode / não pode formatar".
- **Hook de segurança:** bloqueia matar Premiere/prpr, formatar ou apagar volume externo e `apad` sem limite. Não depende de jq nem de python.
- **edicao-reels-estilo-junior:** ganhou as regras de ffmpeg seguro e de nomes com acento.
- **CLAUDE.global.md:** idioma pt-BR, nomes com acento, edição, backups e "definir pronto", todos como orientação com motivo.

Ficaram de fora, para uma próxima etapa: o "guardião" automático do arquivo de casamentos (agente agendado que reescaneia os HDs) e a campanha com agentes em paralelo. As duas são grandes e pedem as suas user stories antes.

### Antes (13/11/2026)

- Descrições das skills próprias passaram a dizer quando usar e qual skill genérica elas substituem.
- `agendamento-posts-clientes`: hashtags de "4 a 6" para "3 a 5" (limite do Instagram).
