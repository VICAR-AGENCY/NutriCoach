/**
 * WhatsApp message templates.
 * All messages are in Dutch and designed for the WhatsApp medium
 * (personal, short, max ~160 words, occasional emoji).
 */

export const templates = {
  welcome: () =>
    `Hoi! 👋 Welkom bij *NutriCoach* — jouw persoonlijke voedingscoach via WhatsApp.\n\nIk help je gezonder eten door je dagelijks te vragen wat je hebt gegeten, zodat jij niet hoeft na te denken. Simpel en persoonlijk.\n\n📋 *Wat ik van je nodig heb:*\nEen korte intake (5–8 minuten) zodat ik een plan op maat kan maken.\n\n🔒 *Privacy:* Ik gebruik je gegevens alleen om je te coachen. Meer info: nutricoach.nl/privacy\n\nType *Ja* om te beginnen, of *Stop* als je geen interesse hebt.`,

  gdprDeclined: () =>
    `Geen probleem! Als je van gedachten verandert, stuur dan gewoon weer een berichtje. Succes! 💪`,

  askBasicInfo: () =>
    `Super, laten we beginnen! 🎉\n\nVraag 1 van 6: *Basisgegevens*\n\nWat is je *voornaam*, *geboortedatum* (dd-mm-jjjj) en *geslacht* (man/vrouw/anders)?\n\nBijvoorbeeld: _Lisa, 15-03-1990, vrouw_`,

  askBodyStats: (name: string) =>
    `Fijn, ${name}! 💪\n\nVraag 2 van 6: *Lichaamsgegevens*\n\nWat is je huidige *gewicht* (kg) en *lengte* (cm)?\n\nBijvoorbeeld: _72 kg, 168 cm_`,

  askGoal: () =>
    `Vraag 3 van 6: *Doelstelling*\n\nWat wil je bereiken?\n\n1️⃣ Afvallen\n2️⃣ Gewicht houden\n3️⃣ Aankomen\n4️⃣ Gezonder eten\n\nAls je wilt afvallen of aankomen: wat is je doelgewicht en gewenste tijdlijn?\nTempo: Rustig (0,5 kg/week) / Normaal (0,75 kg/week) / Snel (1 kg/week)\n\nBijvoorbeeld: _Afvallen, 65 kg, in 3 maanden, normaal tempo_`,

  askLifestyle: () =>
    `Vraag 4 van 6: *Levensstijl*\n\nHoe actief ben je gemiddeld?\n\n1️⃣ Zittend (kantoorwerk, weinig bewegen)\n2️⃣ Licht actief (wandelen, staand werk)\n3️⃣ Matig actief (sport 3–4x/week)\n4️⃣ Zeer actief (intensief sport of zwaar werk)\n\nType gewoon het nummer of omschrijf het.`,

  askFoodPrefs: () =>
    `Vraag 5 van 6: *Voedingsvoorkeuren*\n\nWat is je dieetwens?\n\n🥩 Omnivoor | 🥗 Vegetarisch | 🌱 Veganistisch | 🐟 Pescatarisch\n\nHeb je *allergieën of intoleranties*? (noten, gluten, lactose, etc.)\nIs er iets wat je *absoluut niet eet*?\n\nBijvoorbeeld: _Omnivoor, lactose-intolerant, geen champignons_`,

  askCheckinPrefs: () =>
    `Vraag 6 van 6: *Check-in tijden*\n\nOp welke tijden eet je meestal?\n\nBijvoorbeeld: _Ontbijt 7:30, lunch 12:30, diner 18:30_\n\nEn welke toon vind je fijn?\n💪 Streng & direct | 🌟 Motiverend | 😊 Vriendelijk & zacht`,

  onboardingComplete: (params: {
    name: string
    calorie_budget: number
    protein_g: number
    carbs_g: number
    fat_g: number
  }) =>
    `Geweldig, ${params.name}! Je profiel is klaar 🎉\n\n*Jouw dagbudget:*\n🔥 ${params.calorie_budget} kcal/dag\n💪 Eiwitten: ${params.protein_g}g\n🌾 Koolhydraten: ${params.carbs_g}g\n🫒 Vetten: ${params.fat_g}g\n\nIk stuur je binnenkort je eerste weekplan. Vanaf morgen stuur ik je na elke maaltijd een berichtje om bij te houden wat je gegeten hebt.\n\nDownload ook de NutriCoach app voor een overzichtelijk dashboard: nutricoach.nl/app\n\nGoed bezig! 💪`,

  mealCheckin: (mealType: 'ontbijt' | 'lunch' | 'diner', name: string) =>
    `Hey ${name}! En het ${mealType}? Wat heb je gegeten? 😊\n\nTip: gewoon in je eigen woorden typen, bv. _"2 boterhammen met kaas en een koffie"_`,

  mealLogged: (params: {
    kcal: number
    calorie_budget: number
    protein_g: number
  }) => {
    const remaining = params.calorie_budget - params.kcal
    const remainingText =
      remaining > 0
        ? `Je hebt nog *${remaining} kcal* over vandaag.`
        : `Je hebt je dagbudget bereikt — goed gedaan! 💪`

    return `✅ Gelogd! *${params.kcal} kcal* · Eiwitten: ${params.protein_g}g\n\n${remainingText}`
  },

  askClarification: (question: string) => question,

  weightCheckin: (name: string) =>
    `Vergeet niet je gewicht in te geven vandaag, ${name}! ⚖️\n\nType gewoon je gewicht, bv. _75.2_`,

  weightLogged: (weight_kg: number) =>
    `Gewicht opgeslagen: *${weight_kg} kg* 📊\n\nKijk in de app voor je voortgang!`,

  weeklyOverview: (params: {
    name: string
    avg_kcal: number
    calorie_budget: number
    weight_change: number
  }) => {
    const direction = params.weight_change < 0 ? 'afgevallen' : 'aangekomen'
    const change = Math.abs(params.weight_change).toFixed(1)
    return `Goed weekend, ${params.name}! 🌟 Hier is je *weekoverzicht*:\n\n📊 Gemiddeld: ${params.avg_kcal} kcal/dag (budget: ${params.calorie_budget})\n⚖️ Je bent ${change} kg ${direction} deze week\n\nEen nieuwe week, nieuwe kansen! 💪`
  },

  unknownMessage: () =>
    `Ik begrijp je bericht even niet helemaal. 😅\n\nJe kunt:\n• Vertellen wat je hebt gegeten (bv. _"pasta met tomatensaus"_)\n• Je gewicht doorgeven (bv. _"74.5"_)\n• Een vraag stellen`,
}
