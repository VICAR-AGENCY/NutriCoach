# NutriCoach — Product Requirements Document

> **Version:** 1.0 | **Date:** April 2026 | **Status:** In review  
> **Owner:** Product Team | **Audience:** Engineering, Design, Marketing, Stakeholders

---

## 1. Executive Summary

NutriCoach is een proactieve gezondheids- en voedingsapp die zich onderscheidt door één kernfilosofie: **de app zoekt jou op — niet andersom.**

Waar traditionele apps passief wachten tot de gebruiker inlogt en eten logt, stuurt NutriCoach via WhatsApp actief berichtjes om te vragen wat je hebt gegeten, hoe je je voelt, en of je op schema zit. Gecombineerd met een overzichtelijk dashboard, een gepersonaliseerd voedingsplan op basis van onboarding, en slimme boodschappenlijst-integratie, fungeert NutriCoach als een personal trainer die altijd beschikbaar is — in je broekzak.

**Kernprobleem:** 82% van de mensen die een dieet-app downloaden stopt binnen 2 weken. Reden: te veel zelfmotivatie nodig, vergeten in te loggen, geen persoonlijk gevoel.

**Oplossing:** NutriCoach draait het om — de app vraagt proactief via WhatsApp, het kanaal dat mensen al elke dag gebruiken, waardoor de drempel vrijwel nul is.

---

## 2. Product Visie & Doelstellingen

### Visie
> "Elke persoon verdient een toegankelijke, slimme voedingscoach die hen proactief begeleidt naar hun gezondheidsdoel — zonder dat ze er zelf aan hoeven te denken."

### Missie
NutriCoach maakt gezond eten makkelijker door de lat zo laag mogelijk te leggen: communiceer gewoon in WhatsApp zoals je met een vriend praat, en de app doet de rest.

### OKRs — Jaar 1

| Objective | Key Result | Target |
|-----------|-----------|--------|
| Gebruikersbehoud verhogen | Retentie na 30 dagen | > 60% |
| Gebruikersbehoud verhogen | Retentie na 90 dagen | > 40% |
| Gezondheidsresultaten leveren | Gebruikers die doel bereiken | > 35% |
| Schaal bereiken | Actieve gebruikers na 12 maanden | 50.000+ |
| Monetisatie | Conversie gratis → premium | > 15% |
| Tevredenheid | Net Promoter Score (NPS) | > 50 |

---

## 3. Doelgroep & User Personas

**Primaire doelgroep:** Volwassenen 25–55 jaar die willen afvallen of gezonder eten, maar moeite hebben met consistentie in apps.

### Personas

**👩‍💼 Lisa, 34 — Drukke moeder**
Moeder van 2 kinderen, werkt deeltijds. Wil 8 kg kwijt maar heeft geen tijd voor uitgebreide apps. Gebruikt WhatsApp de hele dag.

**👨‍💻 Daan, 28 — Software developer**
Eet slecht door onregelmatige werkuren. Wil bewuster eten maar vergeet altijd bij te houden. Tech-savvy.

**👵 Marianne, 52 — Pre-diabetes diagnose**
Huisarts raadde aan te letten op suiker. Niet technisch onderlegd — WhatsApp is haar enige app.

---

## 4. Product Features & Functionaliteiten

### Feature Overzicht

| Feature | Beschrijving | Prioriteit | Release |
|---------|-------------|-----------|---------|
| WhatsApp Onboarding | Volledige onboarding via WhatsApp chatbot | P0 - Must | v1.0 |
| Proactieve check-ins | Dagelijkse vragen over maaltijden via WhatsApp | P0 - Must | v1.0 |
| Calorie tracking | Automatische calorie-analyse via AI | P0 - Must | v1.0 |
| Gewicht logging | Dagelijks gewicht ingeven + trendlijn | P0 - Must | v1.0 |
| Dashboard app | Overzicht calorieën, gewicht, voortgang | P0 - Must | v1.0 |
| Voedingsplan AI | Gepersonaliseerd weekmenu op basis van onboarding | P1 - Should | v1.0 |
| Boodschappenlijst | Automatische lijst op basis van plan | P1 - Should | v1.0 |
| Supermarkt integratie | Koppeling met Picnic/AH voor online bestellen | P2 - Could | v1.1 |
| Coach escalatie | Doorverwijzing naar echte diëtist bij zorg | P2 - Could | v1.1 |
| Social features | Challenges met vrienden/familie | P3 - Won't now | v2.0 |

---

### 4.2 Onboarding Flow (WhatsApp)

De onboarding verloopt volledig via WhatsApp en duurt gemiddeld 5–8 minuten.

#### Stap 1 — Welkom & Toestemming
- Gebruiker stuurt eerste bericht of scant QR-code
- Bot stelt zich voor als "NutriCoach — jouw persoonlijke voedingscoach"
- Vraagt toestemming voor dataverwerking (GDPR-compliant)
- Korte uitleg wat de app doet en wat de gebruiker kan verwachten

#### Stap 2 — Basisgegevens
- Naam, geboortedatum, geslacht
- Huidig gewicht (kg) en lengte (cm)

#### Stap 3 — Doelstelling
- Doel: Afvallen / Gewicht houden / Aankomen / Gezonder eten
- Doelgewicht en gewenste tijdlijn
- Tempo: Rustig (0,5 kg/week) / Normaal (0,75 kg/week) / Snel (1 kg/week)

#### Stap 4 — Levensstijl & Activiteit
- Activiteitsniveau: Zittend / Licht actief / Matig actief / Zeer actief
- Sportsfreqentie en type werk

#### Stap 5 — Voedingsvoorkeuren & Restricties
- Dieetwensen: Omnivoor / Vegetarisch / Veganistisch / Pescatarisch
- Allergieën of intoleranties (noten, gluten, lactose, etc.)
- Voedsel dat de gebruiker absoluut niet eet

#### Stap 6 — Dagritme & Check-in Voorkeur
- Gemiddelde ontbijt-, lunch- en dineertijd
- Gewenste check-in momenten
- Toon: Streng & direct / Motiverend / Vriendelijk & zacht

#### Stap 7 — Bevestiging & Profiel Samenvatting
- Bot geeft samenvatting van het profiel terug
- Berekende dagelijkse caloriebudget (TDEE - deficit)
- Macro-verdeling (eiwitten / koolhydraten / vetten)
- Preview van het eerste voedingsplan
- Gebruiker bevestigt of past aan

---

### 4.3 Proactieve WhatsApp Interactie

NutriCoach stuurt proactief berichten op basis van het ingestelde dagritme. Tone-of-voice is persoonlijk, warm en motiverend.

#### Voorbeeldberichten

```
🌅 Na ontbijt:
"Goedemorgen Lisa! Wat heb je vandaag als ontbijt gehad? Je mag gewoon
in je eigen woorden typen, bv: '2 boterhammen met kaas en een koffie'"

🍽️ Na lunch:
"Hey! En de lunch? Alles goed gegaan? 😊"

🌙 Na diner:
"Hoe was het eten vanavond? En hoe voel je je? Je zit vandaag nog op
1.450 kcal — je hebt nog 200 kcal ruimte als je iets wil snacken!"

⚖️ Gewicht reminder:
"Vergeet niet je gewicht in te geven in de app! Ben benieuwd hoe het gaat 💪"
```

#### Intelligente Reacties
- AI analyseert de beschreven maaltijd en berekent calorieën + macro's automatisch
- Bij onduidelijkheid vraagt de bot verduidelijking ("Was het een groot of klein bord?")
- Positieve feedback bij goede keuzes, voorzichtige suggesties bij slechte keuzes
- Contextueel bewust: herkent patronen ("Je hebt al 3x pasta deze week — zin in iets anders?")
- Stuurt geen reminder als de gebruiker al gereageerd heeft

#### Speciale Momenten
- Weekoverzicht elke zondag
- Felicitaties bij mijlpalen (eerste kg kwijt, 1 maand streak)
- Aanmoediging bij stagnatie zonder verwijt
- Tips bij veelgemaakte fouten (te weinig eiwitten, te veel suiker)

---

### 4.4 Dashboard — Mobiele App

#### Home Screen
- Dagelijkse calorie-ring: verbruikt vs. budget
- Macro-breakdown (eiwitten / koolhydraten / vetten) in staafdiagram
- Huidig gewicht vs. doelgewicht met voortgangsbalk
- Streak-teller (hoeveel dagen actief gelogd)
- Volgende check-in moment

#### Gewicht Tracker
- Dagelijks gewicht ingeven (handmatig of via slimme weegschaal)
- Lijngrafiek met gewichtsverloop over tijd
- Verwachte datum doelgewicht op basis van huidig tempo
- "Op schema" indicator met kleurcodering (groen / oranje / rood)
- Vergelijking met verwacht schema (trendlijn)

#### Voedingsdagboek
- Overzicht van alle gelogde maaltijden van de dag en week
- Details per maaltijd (calorieën, macro's)
- Mogelijkheid om maaltijden toe te voegen of te corrigeren
- Zoekfunctie in voedseldatabase

#### Voortgang & Statistieken
- Weekgrafiek calorieën (bar chart)
- Gewichtsverloop 30/90 dagen
- Streak kalender en macro-trends over tijd

---

### 4.5 AI Voedingsplan

Op basis van de onboardinggegevens genereert NutriCoach een volledig gepersonaliseerd weekvoedingsplan.

#### Plan Structuur
- 7-daags weekmenu met ontbijt, lunch, diner en snacks
- Elke maaltijd met ingrediënten, bereidingswijze (kort) en calorieën
- Variatie om eentonigheid te voorkomen
- Plan opnieuw genereren of aanpassen via WhatsApp of app

#### Personalisatie
- Aanpasbaar op basis van wat je die week al gegeten hebt
- Rekening houdend met seizoensgebonden producten en budget
- Snelle maaltijden voor drukke dagen
- Gebruiker kan via WhatsApp zeggen "Ik heb geen zin in kip" en plan past zich aan

---

### 4.6 Boodschappen & Inkoopassistentie

#### Boodschappenlijst
- Automatisch gegenereerd op basis van weekplan
- Gegroepeerd per supermarktafdeling (groenten, vlees, zuivel, etc.)
- Exporteerbaar als WhatsApp-bericht, notitie of PDF
- Hoeveelheden aangepast op huishoudgrootte

#### Slimme Suggesties via WhatsApp
- "Wat kan ik maken met wat ik al in huis heb?" — gebruiker typt wat er in de koelkast staat
- Receptsuggesties op basis van beschikbare ingrediënten
- Alternatieven bij uitverkochte producten

#### Supermarkt Integratie (v1.1)
- Koppeling met Albert Heijn, Picnic, Jumbo (via API / deep link)
- Directe bestelling vanuit app van weekboodschappen
- Prijsvergelijking tussen supermarkten

---

## 5. Technische Architectuur

### 5.1 Stack

| Component | Technologie | Verantwoordelijkheid |
|-----------|------------|---------------------|
| WhatsApp Gateway | WhatsApp Business API (Meta) | Inkomende/uitgaande berichten |
| AI Engine | Claude API (Anthropic) | NLP, maaltijdanalyse, coaching |
| Calorie Database | Open Food Facts + Custom DB | Voedingsinformatie & macro's |
| Backend API | Node.js / FastAPI | Business logic, data orchestratie |
| Database | PostgreSQL + Redis | Gebruikersdata, cache, sessies |
| Mobiele App | React Native (iOS + Android) | Dashboard, visuele weergave |
| Push Notifications | Firebase Cloud Messaging | App-notificaties |
| Analytics | Mixpanel + Custom | Gebruikersgedrag, retentie |

### 5.2 WhatsApp Bot Flow

1. Gebruiker stuurt bericht naar NutriCoach WhatsApp nummer
2. Webhook ontvangt bericht en stuurt naar AI Engine
3. AI Engine parseert intentie (maaltijd loggen / vraag stellen / gewicht doorgeven)
4. Relevante actie wordt uitgevoerd (calorie berekening, opslag in DB)
5. Gepersonaliseerde respons wordt teruggestuurd via WhatsApp API
6. Data wordt gesynchroniseerd met mobiele app dashboard

### 5.3 Datamodel

| Entiteit | Velden | Beschrijving |
|---------|--------|-------------|
| User | id, naam, telefoon, profiel, doel, aangemaakt_op | Gebruikersprofiel & instellingen |
| MealLog | id, user_id, timestamp, beschrijving, kcal, eiw, koolh, vet | Gelogde maaltijden |
| WeightLog | id, user_id, datum, gewicht_kg | Gewichtsmetingen |
| FoodPlan | id, user_id, week_nr, maaltijden JSON | Gegenereerde weekplannen |
| Conversation | id, user_id, berichten JSON, status | WhatsApp gesprekshistorie |
| CheckIn | id, user_id, type, geplande_tijd, voltooid | Geplande check-in momenten |

---

## 6. Privacy, Security & Compliance

### GDPR
- Expliciete toestemming bij onboarding voor alle dataverzameling
- Recht op inzage, correctie en verwijdering van persoonlijke data
- Data minimalisatie: alleen noodzakelijke gezondheidsinformatie
- Bewaartermijn: actieve data 3 jaar, inactieve accounts 1 jaar na laatste login

### Gezondheidsdata
- Gewichtsdata en eetgedrag vallen onder bijzondere persoonsgegevens
- End-to-end encryptie voor opslag van gezondheidsdata
- WhatsApp berichten worden niet permanent opgeslagen (alleen verwerkt en geanonimiseerd)

### Medische Disclaimer
- NutriCoach is een coaching tool, **geen medisch advies**
- Bij medische klachten altijd doorverwijzen naar huisarts of diëtist
- Calorieberekeningen zijn schattingen, geen exacte medische diagnoses

---

## 7. User Stories (Selectie)

| Als... | Wil ik... | Zodat... | Prioriteit |
|--------|----------|---------|-----------|
| Nieuwe gebruiker | Onboarding via WhatsApp doorlopen | Ik snel kan starten zonder app te installeren | P0 |
| Dagelijkse gebruiker | WhatsApp bericht ontvangen na ontbijt | Ik kan loggen zonder in de app te gaan | P0 |
| Gebruiker | Mijn gewicht dagelijks ingeven | Ik mijn voortgang kan zien | P0 |
| Gebruiker | Overzicht van mijn calorieën zien | Ik weet of ik op schema zit | P0 |
| Gebruiker | Een weekvoedingsplan ontvangen | Ik niet elke dag hoef na te denken | P1 |
| Gebruiker | Een boodschappenlijst ontvangen | Ik de juiste producten kan kopen | P1 |
| Gebruiker | Vragen stellen in WhatsApp | Ik advies krijg zoals bij een echte coach | P1 |
| Premium gebruiker | Boodschappen direct online bestellen | Ik geen moeite meer heb met inkopen | P2 |

---

## 8. Monetisatie Model

| Tier | Prijs | Functies |
|------|-------|---------|
| **Gratis** | €0/maand | Basis check-ins, calorie tracking, gewicht log, basis dashboard |
| **Premium** | €9,99/maand | Alles + AI voedingsplan, boodschappenlijst, uitgebreide analytics |
| **Premium Plus** | €19,99/maand | Alles + supermarkt integratie, diëtist review, persoonlijke check-in tijden |
| **Familie** | €24,99/maand | Premium voor 4 personen, gedeelde boodschappenlijst |

Freemium strategie: gratis tier met limiet van 3 WhatsApp check-ins per dag. Conversiepunt bij voedingsplan en boodschappenlijst.

---

## 9. Go-to-Market Strategie

| Fase | Periode | Activiteit | Doel |
|------|---------|-----------|------|
| Alpha | Maand 1–2 | Interne testers (50 gebruikers), bug fixing, UX validatie | Product-market fit valideren |
| Beta | Maand 3–4 | Gesloten beta (500 gebruikers), WhatsApp doorverwijzingen | Retentie valideren |
| Soft Launch | Maand 5–6 | App Store launch, influencer partnerships (food/health) | Eerste 5.000 gebruikers |
| Full Launch | Maand 7+ | Paid acquisition, PR, partnerships met diëtisten | Schaal naar 50k+ |

**Kanalen:**
- Influencer marketing (food bloggers, fitness creators, diëtisten)
- WhatsApp virality: gebruikers delen boodschappenlijst of weekplan
- Google Ads: "afvallen", "dieet app", "calorieën bijhouden"
- Partnerships: fysiotherapeuten, huisartsen, bedrijfsgezondheidsprogramma's

---

## 10. Risico's & Mitigatie

| Risico | Kans | Impact | Mitigatie |
|--------|------|--------|----------|
| WhatsApp API limieten of beleidswijzigingen | Middel | Hoog | Multi-channel strategie (SMS, Telegram als backup) |
| AI geeft foutieve calorie-info | Laag-Middel | Middel | Validatie door diëtisten, duidelijke disclaimer |
| Lage retentie na eerste week | Middel | Hoog | Sterke onboarding, progressieve waarde, gamification |
| Privacy/GDPR overtreding | Laag | Zeer hoog | Legal review, DPO aanstellen, regelmatige audits |
| Concurrentie van grote spelers | Hoog | Middel | WhatsApp-first differentiatie, snelheid, community |
| Medische aansprakelijkheid | Laag | Hoog | Duidelijke disclaimers, geen diagnoses, doorverwijzing bij zorg |

---

## 11. Succes Metrics & KPIs

| Categorie | Metric | Target (12M) |
|-----------|--------|-------------|
| Acquisitie | Nieuwe registraties/maand | 5.000/maand |
| Activatie | Onboarding voltooiing | > 70% |
| Retentie | Day-30 retentie | > 60% |
| Retentie | Day-90 retentie | > 40% |
| Engagement | Check-in response rate | > 65% |
| Gezondheid | Doelbereikers | > 35% |
| Monetisatie | Premium conversie | > 15% |
| Monetisatie | MRR groei (MoM) | > 20% |
| Tevredenheid | NPS Score | > 50 |
| Technisch | WhatsApp responstijd | < 3 seconden |

---

## 12. Product Roadmap

| Kwartaal | Focus | Deliverables |
|---------|-------|-------------|
| Q2 2026 (v1.0) | MVP Launch | WhatsApp onboarding, dagelijkse check-ins, calorie tracking, gewicht log, basis dashboard |
| Q3 2026 (v1.0) | Retentie & Waarde | AI voedingsplan, boodschappenlijst, weekoverzicht, premium tier lancering |
| Q4 2026 (v1.1) | Uitbreiding | Supermarkt integratie, diëtist connect, familie plan, uitgebreide analytics |
| Q1 2027 (v2.0) | Schaal | Social features, challenges, uitbreiding naar andere landen, B2B aanbod |

---

## 13. Open Vragen & Beslissingen

| Vraag | Opties | Eigenaar | Deadline |
|-------|--------|---------|---------|
| Welke AI provider voor NLP? | Claude (Anthropic) vs GPT-4o vs eigen model | Tech Lead | Mei 2026 |
| WhatsApp nummer strategie? | 1 nummer vs. dedicated nummers per regio | Product | Mei 2026 |
| Kalorie DB: licentie of open source? | Open Food Facts vs. commerciële DB | Product + Legal | Juni 2026 |
| Medische positionering? | Wellness app vs. medische app (CE-markering) | Legal + Product | Juni 2026 |
| Eerste markt: NL only of BE + NL? | Focus NL vs. Benelux launch | Go-to-Market | Mei 2026 |

---

*NutriCoach PRD v1.0 — April 2026 — Intern gebruik*
