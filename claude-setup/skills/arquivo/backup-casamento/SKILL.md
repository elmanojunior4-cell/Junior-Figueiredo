---
name: "backup-casamento"
description: "Faz backup seguro de um casamento ou evento a partir de cartão ou HD, verifica a cópia e atualiza o catálogo _CATALOGO. Use quando o Júnior pedir para copiar, fazer backup, escanear um HD novo, descarregar cartão, registrar status de casamento ou saber se pode formatar um cartão."
---

# Backup de casamentos e eventos

Os HDs de casamento guardam material insubstituível de clientes. Um erro aqui não tem conserto, por isso este fluxo é rígido.

## Regras

- **HDs de evento são somente leitura**, a não ser que o Júnior autorize a escrita naquela conversa.
- **Nunca apague, mova, sobrescreva ou formate nada** de HD ou cartão.
- **Nunca diga que um cartão pode ser formatado** sem a verificação completa do passo 5.
- Sempre use aspas nos caminhos. Nomes de volume podem ter espaço no final (ex.: `"/Volumes/NIKON D600 "`). Liste com `ls /Volumes | cat -A` para ver espaços escondidos.

## Passo a passo

1. **Perguntar** qual evento e qual volume de origem.
2. **Escanear a origem só para leitura:** quantidade de arquivos e tamanho total.
3. **Confirmar a pasta de destino com o Júnior** antes de copiar. Verifique o espaço livre no destino (`df -h`).
4. **Copiar** com `rsync -a --progress "<origem>/" "<destino>/"`.
5. **Verificar:** mesma quantidade de arquivos, mesmo tamanho total e checksum (`rsync -a --checksum --dry-run --itemize-changes` sem diferenças, ou comparação de hashes).
6. **Atualizar o _CATALOGO** com evento, HDs onde está, status e data. Aponte qualquer divergência encontrada.
7. **Relatório final, claro:**
   - quantas cópias verificadas o evento tem e em quais HDs;
   - **PODE FORMATAR O CARTÃO** só se a verificação passou; senão **NÃO FORMATE** e o motivo;
   - eventos que continuam com uma cópia só (em risco).

Se uma cópia ainda estiver rodando quando a conversa terminar, diga isso explicitamente.
