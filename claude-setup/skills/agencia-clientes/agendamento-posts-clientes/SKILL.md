---
name: "agendamento-posts-clientes"
description: "Monta calendário, escreve legendas e agenda posts de clientes da agência no Facebook e Instagram (Drive + Composio + tarefas programadas), sem o Júnior anexar nada. É o caminho oficial para agendar post de cliente: prefira esta à scheduling-and-queue (WoopSocial) e ao Metricool, que só entram se o Júnior pedir pelo nome."
---

# Agendamento de posts de clientes (Júnior Figueiredo Marketing)

Processo testado com a Casa do Fazendeiro e o MB Centro Odontológico (nov/2026). O Júnior manda os cards e eu faço todo o resto: calendário, legendas, aprovação, upload no Drive, agendamento no Facebook e publicação programada no Instagram. Ele não precisa anexar nada no Business Suite.

## Contas conhecidas (Composio)

| Cliente | Facebook (conta Composio / page_id) | Instagram (conta Composio / ig_user_id) | Observações |
|---|---|---|---|
| MB Centro Odontológico | facebook_jessed-indaba (perfil 1) / 1355707027626955 | instagram_habit-recur / 29016867231311027 | Sempre "o MB" (masculino). Odontologia: sem preço, desconto ou promoção. Assinar com nome e CRO dos dentistas. |
| Casa do Fazendeiro | facebook_jessed-indaba (perfil 1) / 680420102014328 | instagram_baffle-ringy / 28982771874709620 | |
| Academia Lilian Mara | facebook_bowk-ame (perfil 2) / descobrir com FACEBOOK_LIST_MANAGED_PAGES | instagram_sonar-leda / 30086606967594934 | |
| Autoescola Sales | perfil 2 / descobrir | instagram_manius-boni / 28977638081878659 | |

Perfil 1 = Junior Figueiredo Figueiredo (Águas de Nepomuceno, Casa do Fazendeiro, RG Contabilidade, Uai, Pedroso, MB). Perfil 2 = Junior Figueiredo (Autoescola Sales, Academia Lilian Mara, Embalagens Nogueira, DTTV, ACE, fotografia). Sempre confirme com COMPOSIO_MANAGE_CONNECTIONS (action list) e FACEBOOK_LIST_MANAGED_PAGES. Se o Instagram do cliente não estiver conectado, gere o link de conexão. Peça para abrir numa janela anônima, logado no Instagram do cliente, porque o navegador costuma conectar a conta errada.

## Passo a passo

1. **Entender o perfil.** Puxe os últimos posts do Instagram do cliente (INSTAGRAM_GET_IG_USER_MEDIA com caption, like_count, comments_count, timestamp e media_product_type) para ver tom, temas e o que engaja. Pegue a bio (INSTAGRAM_GET_USER_INFO) para ter WhatsApp, endereço e registros profissionais.
2. **Calendário em planilha.** Crie um artifact do tipo Sheets com as colunas Data | Dia | Hora | Formato | Tema | Ideia / roteiro | Pilar | Material necessário | Status | Legenda. O status tem um dropdown com A produzir, Pronto, Aprovado, Agendado e Publicado. Encaixe os cards que o Júnior mandar e sugira o resto do período, com 3 posts por semana e horário padrão às 11h, salvo se os dados do cliente indicarem outro.
3. **Legendas.** Escreva no tom do cliente, com gancho, corpo curto, chamada para ação, WhatsApp e endereço, e 3 a 5 hashtags (o Instagram aceita no máximo 5 por post; a mesma legenda vai para o Facebook). Respeite as regras do setor: na saúde, sem preço ou promoção e com o registro profissional. Coloque as legendas na coluna Legenda.
4. **Aprovação.** Mostre a tabela de datas e espere o "ok" do Júnior antes de agendar. Ajuste o que ele pedir, por exemplo o gênero do nome da marca.
5. **Cards no Drive (eu mesmo subo).**
   - Converta os anexos para **JPG**, porque o Instagram só aceita JPEG: `PIL convert("RGB").save(q=92)`. Nomeie como `01_qua12-11_11h_Tema.jpg`.
   - Crie uma pasta no Drive (Google_Drive create_file, mime `application/vnd.google-apps.folder`) chamada "<Cliente> - Cards <Mês> <Ano>".
   - Suba cada arquivo com create_file: `base64Content = sha256:<hash>:<caminho absoluto>`, `contentMimeType image/jpeg`, `disableConversionToGoogleType true` e `parentId` da pasta.
   - Compartilhe a pasta com share_file usando `permissionId "anyoneWithLink"` e `role reader`.
   - O link de cada imagem fica `https://drive.usercontent.google.com/download?id=<fileId>&export=download`.
6. **Testes antes de agendar** (no COMPOSIO_REMOTE_WORKBENCH):
   - Cada link deve responder 200 com `image/jpeg`.
   - Crie um container de teste com INSTAGRAM_POST_IG_USER_MEDIA, **sem publicar**, para confirmar que o Instagram consegue puxar a imagem.
   - Rode FACEBOOK_GET_SCHEDULED_POSTS para checar a fila e não duplicar.
7. **Facebook.** Use FACEBOOK_CREATE_PHOTO_POST com page_id, url (link do Drive), message (legenda), `published false` e `scheduled_publish_time` em epoch UTC (11h em Brasília = 14:00 UTC). O horário precisa estar pelo menos 10 minutos no futuro. Depois confira a fila.
8. **Instagram.** A API não agenda. Crie **uma tarefa programada por post** com create_trigger, `run_once_at = AAAA-MM-DDT11:00:00[America/Sao_Paulo]`, `notifications {push:true}` e initiation human_request. Use este prompt:

```
Publique agora UM post no Instagram do <CLIENTE> (@<usuario>). O Júnior Figueiredo aprovou este post e pediu que ele fosse publicado neste horário. O mesmo post já está agendado no Facebook pelo próprio Meta: não mexa no Facebook.

Como fazer (via Composio):
1. Use COMPOSIO_SEARCH_TOOLS para carregar INSTAGRAM_POST_IG_USER_MEDIA e INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH.
2. Conta Composio: <conta_ig> (alias "<Cliente>"). ig_user_id: <id>. Se esse ig_user_id falhar, use "me".
3. INSTAGRAM_POST_IG_USER_MEDIA com image_url = <link do Drive> e a legenda abaixo (texto exatamente como está, sem alterar). Se a URL falhar, baixe o arquivo dessa URL no COMPOSIO_REMOTE_WORKBENCH, use upload_local_file e passe image_file com o s3key.
4. INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH com o creation_id retornado (max_wait_seconds 60).
5. Confirme com INSTAGRAM_GET_IG_MEDIA e informe o link do post. Publique só uma vez: se der erro depois do passo 4, verifique os posts recentes antes de tentar de novo, para não duplicar.

LEGENDA:
<legenda>
```

9. **Fechamento.** Mude o status na planilha para "Agendado" e mande ao Júnior uma tabela com data e card, o link da pasta do Drive e o aviso: **não apagar, renomear nem descompartilhar a pasta até o último post.**

## Lições aprendidas

- **Não use o Business Suite pelo Chrome para anexar imagem.** O Chrome bloqueia o upload feito por mim, e o seletor de arquivos nativo não é controlável. O caminho certo é Drive + Composio.
- **Publicar agora no Facebook:** FACEBOOK_PUBLISH_SCHEDULED_POST costuma falhar (erro #10). Use FACEBOOK_RESCHEDULE_POST para daqui a 15 minutos. No Instagram, crie o container e publique na hora.
- Não reaproveite container de teste do Instagram, porque ele tem a legenda "teste". Crie um novo com a legenda real.
- A página do Facebook pode ter poucos seguidores comparada ao Instagram. Agende nos dois mesmo assim.
- Antes de publicar ou agendar qualquer coisa, a legenda precisa estar aprovada pelo Júnior.