---
name: "ig-profile"
description: "Dá nota de 0 a 100 a um perfil de Instagram numa rubrica de 12 itens e reescreve o que perde pontos: campo de nome, bio, link, destaques, fixados e grade. Use para otimizar perfil ou bio do Instagram; prefira esta à profile-optimization quando a rede for Instagram."
---

# ig-profile

(Adapted from github.com/Jakeschincariol/instagram-agent-skill, MIT.)

Almost everybody optimises the wrong thing here. The profile is not a storefront people browse. It is a **decision screen**, arrived at from one reel, and it gets about three seconds to answer one question: is there more of that here, and is it for me.

## Input

Ask the user to paste or screenshot: the name field, the handle, the bio, what the link points to, the highlight names, what is pinned, and the first nine grid covers. A screenshot of the top of the profile plus the first two grid rows is enough for a first pass.

Do not log into Instagram on their behalf.

## Score it

Use the rubric at the end of this skill. Twelve items, 100 points. Score every item, show the table, give the total. Be honest. Most profiles land in the 30s and 40s on the first pass and a generous score is useless.

```
PROFILE SCORE  38/100

  name field       2/12   name only, no words anyone searches
  bio first line   3/12   three nouns and a coffee emoji
  pinned three     0/10   nothing pinned
  highlights       2/8    "Random", "Life", "2023"
  grid legibility  4/8    six of nine covers are a face mid-sentence
  ...
```

## Then rewrite, in this order

Fix in descending order of points lost. Do not rewrite everything at once, the user has to actually go and change each of these.

**1. The name field (30 characters).** The bold line under the photo, not the handle. This is the field Instagram search matches against. Format that works: `{Name} | {what you do, in searched words}`. Give three options.

**2. Bio line one.** Who this is for and what changes. Not a job title, not adjectives, not a pipe-separated list of identities. The rest of the 150 characters carries one piece of proof or one plain offer.

**3. The pinned three.** Three slots, three different jobs: the best proof, the clearest explanation of the offer, the best introduction to the person. The highest-leverage fix on the whole profile.

**4. Highlights.** Four to six, named for the questions a buyer asks: Pricing, Results, How it works, About. Not "Random". Delete the rest.

**5. The link.** One destination that matches what the bio just promised. Two is already a menu and a menu converts worse than a door.

**6. Grid covers.** The first nine at thumbnail size. Reel covers get chosen, not left as frame one. Four words of text on a cover makes a grid readable in one glance.

## Output

Score table, then the rewrites as copy-ready blocks in fix-first order. Re-score at the end and show the delta honestly. If the rewrite reaches 84 and not 98, say 84, and say what the rest needs (usually a grid, a story habit and a pinned post that does not exist yet).

Nothing is saved to Instagram by this skill. The user edits each field. Write in the language the user writes in.

## Rubric (100 points)

Score each honestly. The name field, the first bio line and the pinned three are worth more than the photo, because they are what a stranger arriving from one reel processes before deciding to follow.

- **name_field (12)** - Full marks: name plus what they do in searched words ('Dana Ruiz | Proposal templates'). Fail: just a name, or a name with an emoji.
- **bio_first_line (12)** - Full marks: who this is for and what changes for them, in their words. Fail: 'Entrepreneur | Coffee lover | Dog dad'.
- **bio_body (8)** - Full marks: one piece of proof or one specific offer, as sentences. Fail: keyword soup, or blank.
- **pinned_three (10)** - Full marks: three pinned posts doing three jobs (proof, offer, introduction). Fail: nothing pinned.
- **link (8)** - Full marks: one destination matching the bio's promise. Fail: link tree with eleven options, or no link.
- **highlights (8)** - Full marks: 4-6 named for buyer questions, consistent covers, nothing stale up front. Fail: 'Random', 'Life', or 14 in no order.
- **grid_legibility (8)** - Full marks: first nine covers legible at thumbnail size, chosen deliberately. Fail: nine faces mid-word with no text.
- **photo (6)** - Full marks: face fills ~60% of the circle, eyes visible, recent, clean background. Fail: full-body shot, logo for a personal brand, dark arm's-length photo.
- **handle (6)** - Full marks: readable, sayable, same across platforms. Fail: a handle nobody can spell after hearing it once.
- **category_contact (6)** - Full marks: professional account, matching category, working contact buttons. Fail: personal account.
- **recent_activity (10)** - Full marks: posted in the last seven days and replied to recent comments. Fail: five-week gap or unanswered comments.
- **story_presence (6)** - Full marks: a story up now, or most days. Fail: no ring, ever.