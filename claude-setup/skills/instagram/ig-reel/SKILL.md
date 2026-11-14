---
name: "ig-reel"
description: "Transforma uma ideia crua em roteiro de Reel: três ganchos (de 26 fórmulas) com nota, fala, texto na tela e mapa de tempos. Use para roteiro de Reels, ganchos ou locução. Para Instagram, prefira esta à reels-script, hook-writer e short-form-video-script. Editar um vídeo já gravado é com a edicao-reels-estilo-junior."
---

# ig-reel

Turns one raw idea into a Reel that somebody finishes. (Adapted from github.com/Jakeschincariol/instagram-agent-skill, MIT.)

## Before you write

1. Read the user's voice from what you already know about them (memory, past chats) or from examples they share. If there is nothing, ask for three of their own reels or captions and infer the voice. Always write in the language the user writes in (e.g. Brazilian Portuguese).
2. Use the hook formulas listed at the end of this skill. 26 formulas, each with a template, a filled example, the on-screen version, what it is for, and how it gets ruined.
3. If the idea is thin, do not pad it. Ask one batched question: what happened, to whom, and what did it cost or return. A Reel needs one specific true thing. Get it before writing.
4. If the user has a swipe file or a list of hooks that are working in their niche, prefer those formulas.

## The shape

A Reel is decided in the first two seconds and kept by the next five.

```
0:00 - 0:02   HOOK        the claim. Spoken line and on-screen line, written
                          separately. Motion in the first frame, not a static face.
0:02 - 0:07   THE STAKE   why this matters to the person watching. One line.
0:07 - ...    THE BODY    one idea per beat, and the frame changes every beat.
LAST 3s       THE PAYOFF  deliver what the hook promised, then the single ask.
LAST LINE     THE LOOP    echo one word from the hook so the replay lands clean.
```

Length: 15 to 45 seconds is the working range. Reels run to 3 minutes and almost nobody should use it. Under 7 seconds the loop counts inflate and nothing else does.

## The loop

**1. Pick three hooks, not one.** Run the idea through the formula list below, choose three formulas that genuinely fit it, and write the spoken line plus the on-screen line for each. Different formulas, not three rewrites of one.

**2. Score them** with the hook scorecard below and show the ranking. If the top one is under 50, you do not have the hook yet and no amount of editing fixes that.

**3. Write the script** on the winning hook. Plain spoken language, the way the user actually talks. Contractions. Short lines. No sentence they would have to rehearse.

**4. Time it.** Estimate at ~150 words per minute (Portuguese) / 165 (English). Flag and fix: a hook past 3 seconds, any beat over 4 seconds, a run of beats with nothing concrete in them, no loop.

**5. Humanize it.** Read it as the user would say it out loud. Cut anything written-sounding: em dashes, corporate words, rhetorical triads.

**6. Print the block.** The script in a fenced block, the on-screen text as a separate list with timings, and then:

```
REEL READY
hook:       #3 Nobody Tells You, scored 86 STRONG
length:     28.4s across 9 beats at 165 wpm
on-screen:  6 cards
caption:    run /ig-caption next

Tell me what to change.
```

**7. Never publish.** This skill produces a script. The user shoots it and posts it.

## On-screen text is a separate script

Write it separately, every time. It is read before it is heard.

- **Six words or fewer per card.** It is being read at arm's length by someone who is not listening yet.
- **The hook card is up at frame 1**, not after a beat of silence.
- **Keep it inside the safe zone.** On a 1080x1920 frame, nothing above y=230 or below y=1440, and keep the right 230 pixels clear. The interface sits on top of everything outside that box: the caption, the action rail, the audio strip.
- **Never put the hook where the caption sits.** That is the bottom of the frame and it is covered.
- **Burn in captions for the body.** Most people watch muted first.

## Rules that make the difference

- **One idea per Reel.** If the script has two, you have two Reels. Say so.
- **Numbers over adjectives.** "$4,200" beats "a lot". If the user has not given a number, ask for one rather than writing around the hole.
- **Cut the intro.** No greeting, no "in this video", no name, no logo sting. The video starts at the sentence you would normally reach at second six.
- **Change the frame every beat.** A static shot for 8 seconds is where people leave.
- **One ask at the end.** Comment a keyword, save it, or follow. One.
- **Never fabricate.** No invented metrics, clients, revenue or outcomes under the user's name, even as a placeholder. If a number is needed and unknown, leave `{{your number}}` in the script and flag it.
- **Do not write a script around a trending audio the user cannot use.** If the idea needs the user's own voice, say so.

## Example

```
/ig-reel we cut proposal time from 5 hours to 20 minutes with one template
```

```
HOOKS  (scored)
  86  STRONG  #5  Time Collapse   "Proposals used to take me five hours. Twenty minutes now."
                                  on screen: 5 HOURS -> 20 MIN
  71  STRONG  #1  Cost Confession "I billed four hours a week for formatting. For two years."
                                  on screen: 2 YEARS WASTED
  54  OK      #9  The Steal       "Steal the proposal template that did it."
                                  on screen: STEAL THIS

Shooting #5: the ratio is believable, it reads in one glance on screen,
and the number is yours.
```

## Hook scorecard (0-100 each, then overall = 0.6*mean + 0.4*lowest)

- **Length**: 5-12 words, sayable in under ~3 s. Penalise outside that range.
- **Specificity**: concrete markers (numbers, money, time, names, places). None = ~15.
- **Stakes**: something lost, gained, risked or wrong. None = ~20.
- **Front-load**: the payload is in the first words, not after a preamble or greeting.
- **Address**: aimed at a viewer (you / a specific person), not at nobody.

Subtract 15 for any greeting, 'in this video', or preamble. STRONG = 70+ with no check under 55; OK = 50-69; WEAK below 50. This catches bad hooks well; it does not predict which of two decent hooks will travel.

## Hook rules

- Write the spoken line and the on-screen line separately. On screen is the shorter, blunter one, six words or fewer, no punctuation it does not need.
- No setup. The video starts at the sentence you would normally reach at second six.
- Say the number. 'A lot' is not a number and neither is 'so much time'.
- The first frame is a hook too. A static talking head at 0:00 with no motion and no text is three hooks wasted.
- If the hook would work for anyone else in your niche, it is not your hook. Put the thing only you can say in it.
- A hook promises something. Deliver it before the halfway mark or the retention you bought gets handed back.

## The 26 hook formulas

**#1 Cost Confession** - `{Specific amount} is what {one mistake} cost me.`
  e.g. "$18,000 is what one missing clause cost me." | on screen: $18,000 MISTAKE
  for: Trust, fast. People finish the videos where you are the one who looks bad. | trap: A fake cost. 'It cost me my peace of mind' is not a number.

**#2 Negative Command** - `Stop {common action}. Do {alternative} instead.`
  e.g. "Stop posting three times a day. Post twice and reply to every comment for an hour." | on screen: STOP POSTING DAILY
  for: Saves and arguments. | trap: Telling people to stop doing something nobody does.

**#3 Nobody Tells You** - `Nobody tells you that {uncomfortable truth about the thing they want}.`
  e.g. "Nobody tells you that your first 30 reels are supposed to flop." | on screen: YOUR FIRST 30 WILL FLOP
  for: New audiences. | trap: Picking a truth everybody already says.

**#4 The Replacement** - `{This thing} replaced {expensive thing} for {price}.`
  e.g. "This $12 tool replaced the editor I was paying $2,000 a month." | on screen: $2,000 -> $12
  for: Demos and tool videos. | trap: Overstating the replacement.

**#5 Time Collapse** - `This used to take me {long time}. It now takes {short time}.`
  e.g. "Proposals used to take me five hours. They take twenty minutes now." | on screen: 5 HOURS -> 20 MIN
  for: Process videos where the payoff is speed. | trap: A ratio nobody believes.

**#6 The Receipt** - `I {did thing} for {N days}. Here are the actual numbers.`
  e.g. "I posted one reel a day for 60 days. Here is what it did to my DMs." | on screen: 60 DAYS. REAL NUMBERS.
  for: Experiments, with a screen recording of the real dashboard. | trap: Not showing the screen.

**#7 Wrong Way, Right Way** - `You are doing {thing} wrong, and it is not your fault. {The fix}.`
  e.g. "You are writing captions wrong, and it is not your fault. Instagram hides everything after line one." | on screen: YOUR CAPTIONS ARE CUT
  for: Teaching. | trap: Skipping the absolution.

**#8 Insider Leak** - `I spent {N years} {inside the thing}. Here is what we never said out loud.`
  e.g. "I spent six years selling agency retainers. Here is what we never put in the proposal." | on screen: 6 YEARS INSIDE
  for: Authority without a credential slide; only if the years are real. | trap: Promising a secret and delivering the brochure.

**#9 The Steal** - `Steal this {artifact}. It took me {time} to get right.`
  e.g. "Steal this four-line follow-up. It took me two years and a lot of dead leads." | on screen: STEAL THIS
  for: Saves and sends. | trap: The artifact not being on screen.

**#10 If This, Then Watch** - `If you {specific situation}, this {short time} fixes it.`
  e.g. "If your reels get views and no followers, the next 40 seconds fix it." | on screen: VIEWS BUT NO FOLLOWERS?
  for: Qualifying hard. | trap: A situation so broad it qualifies nobody.

**#11 Numbered With A Favourite** - `{N} {things} that {outcome}. Number {k} is the one nobody uses.`
  e.g. "Five caption edits that double saves. Number four is the one nobody does." | on screen: 5 EDITS. #4 IS THE ONE.
  for: Retention through the middle. | trap: N above seven.

**#12 The Objection** - `"{Objection they actually say}." Fine. Here is the version that works anyway.`
  e.g. "'I don't want to be on camera.' Fine. Here is the faceless version that still sells." | on screen: "I HATE BEING ON CAMERA"
  for: Selling to people who already said no once. | trap: Inventing the objection; pull it verbatim from a DM or comment.

**#13 Before And After, On Screen** - `{Show the old thing}. {Show the new thing}. {One sentence on the lever}.`
  e.g. "This was my profile in March. This is it now. I changed the name field, nothing else." | on screen: MARCH / NOW
  for: Anything visual. | trap: Three levers; name one.

**#14 The Callout** - `{Specific group}, this is the one you have been ignoring.`
  e.g. "Photographers charging under $2,000: this is the pricing page you have been avoiding." | on screen: PHOTOGRAPHERS UNDER $2K
  for: Cutting to the audience that converts. | trap: A group so large it is not a callout.

**#15 The Flop Record** - `My first {N} {attempts} did nothing. Here is what changed on {N+1}.`
  e.g. "My first 47 reels averaged 300 views. Number 48 did 400,000. One thing was different." | on screen: 47 FLOPS, THEN THIS
  for: Beginners; high comment rate. | trap: Making the change sound like luck.

**#16 The Verbatim Question** - `"{Question exactly as it was asked}" - I get this every week.`
  e.g. "'How do I post consistently without hating it?' I get this one every week." | on screen: ASKED EVERY WEEK
  for: Search. | trap: Tidying the question up.

**#17 Head To Head** - `{A} versus {B}. I ran both for {time} and one of them was not close.`
  e.g. "Carousels versus reels. I ran both for 90 days and it was not close." | on screen: CAROUSELS vs REELS
  for: Comments. | trap: Refusing to pick.

**#18 Cold Open Demo** - `{Start mid-action, already doing the thing.} Watch what this does.`
  e.g. "Watch what happens when I paste a competitor's caption into this." | on screen: WATCH THIS
  for: Screen recordings and visible results. | trap: A result that takes twelve seconds to arrive.

**#19 The Deadline** - `{Thing} changes on {date}. Do {action} before then.`
  e.g. "Your top nine grid crops change the second you post a reel. Fix the covers first." | on screen: BEFORE YOU POST AGAIN
  for: Real urgency (seasonal windows, platform changes). | trap: Manufactured urgency.

**#20 Permission** - `You do not need {the thing everyone says you need}.`
  e.g. "You do not need a niche. You need one person you can name." | on screen: YOU DON'T NEED A NICHE
  for: Relief; very high save rate. | trap: Removing the blocker and putting nothing in its place.

**#21 Mid-Sentence Start** - `{...and that is when {the turn}.}`
  e.g. "...and that is when the client asked for the money back. Three days after approving it." | on screen: HE ASKED FOR A REFUND
  for: Stories. | trap: Never going back to fill in the gap; deliver the setup by second eight.

**#22 Contrarian Flip** - `{Well-known saying, inverted.}`
  e.g. "Nice guys finish first." | on screen: NICE GUYS FINISH FIRST
  for: Comments. | trap: Flipping a saying nobody says.

**#23 The Statistic** - `{N}% of {group} {surprising fact}.`
  e.g. "33% of high school graduates never read another book." | on screen: 33% NEVER READ AGAIN
  for: Sends. | trap: A statistic you cannot source.

**#24 The Reveal** - `This is the new {thing}.`
  e.g. "This is the new Sony point and shoot, and it fixes the one thing I hated." | on screen: THE NEW ONE
  for: Anything physical or visual. | trap: Holding the thing up without saying what it changes.

**#25 Someone Else's Result** - `There was one {person} who {outcome} in {time}.`
  e.g. "There was one creator who grew a million subscribers in a single month." | on screen: 1M SUBS IN ONE MONTH
  for: Proof when the user has no number yet, if true. | trap: No name and no link.

**#26 The Superlative** - `The {fastest / biggest / only} {thing} is {the answer}.`
  e.g. "The fastest way to get confident is to build evidence you cannot argue with." | on screen: THE FASTEST WAY
  for: One-claim videos. | trap: A superlative with a soft answer.