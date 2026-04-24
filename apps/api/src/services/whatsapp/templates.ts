export const templates = {
  welcome: () =>
    `Hoi, ik ben Fien, jouw persoonlijke voedingscoach. Ik werk graag op basis van wat bij jou past, geen streng dieet maar een aanpak die echt werkt. Mag ik een paar vragen stellen om je goed te leren kennen?\n\nType *Ja* om te starten, of *Stop* als je liever niet verder gaat.`,

  gdprDeclined: () =>
    `Geen probleem. Als je later van gedachten verandert, stuur me gewoon een berichtje. Succes!`,

  askBasicInfo: () =>
    `Fijn! Dan beginnen we.\n\nVraag 1 van 6: wat is je voornaam, geboortedatum en geslacht?\n\nBijvoorbeeld: Lisa, 15-03-1990, vrouw`,

  askBodyStats: (name: string) =>
    `Goed, ${name}. Wat is je huidig gewicht in kg en je lengte in cm?\n\nBijvoorbeeld: 72 kg, 168 cm`,

  askGoal: () =>
    `Wat wil je bereiken? Afvallen, gewicht houden, aankomen of gezonder eten?\n\nAls je wilt afvallen of aankomen: wat is je doelgewicht en wanneer wil je dat bereiken? En welk tempo past bij jou: rustig (0,5 kg/week), normaal (0,75 kg/week) of snel (1 kg/week)?`,

  askLifestyle: () =>
    `Hoe actief ben je gemiddeld op een gewone dag?\n\nKies uit: zittend, licht actief, matig actief of zeer actief. Je mag het ook gewoon omschrijven.`,

  askFoodPrefs: () =>
    `Wat eet je, en wat eet je liever niet?\n\nGeef me je dieetvoorkeur (omnivoor, vegetarisch, veganistisch of pescatarisch), eventuele allergieën of intoleranties, en voedsel dat je absoluut niet wilt eten.\n\nBijvoorbeeld: omnivoor, lactose-intolerant, geen champignons`,

  askCheckinPrefs: () =>
    `Laatste vraag! Op welke tijden eet je meestal je ontbijt, lunch en diner?\n\nBijvoorbeeld: ontbijt 7:30, lunch 12:30, diner 18:30\n\nEn welke toon werkt het best voor jou: streng en direct, motiverend, of vriendelijk en zacht?`,

  onboardingComplete: (params: {
    name: string
    calorie_budget: number
    protein_g: number
    carbs_g: number
    fat_g: number
  }) =>
    `Mooi, ${params.name}. Ik heb een goed beeld van wat je nodig hebt.\n\nJouw dagbudget is ${params.calorie_budget} kcal: ${params.protein_g}g eiwit, ${params.carbs_g}g koolhydraten, ${params.fat_g}g vet.\n\nIk stuur je morgen je eerste berichtje na het ontbijt. Je kunt ook de NutriCoach app downloaden voor een overzicht van je voortgang: nutricoach.nl/app`,

  mealCheckin: (mealType: 'ontbijt' | 'lunch' | 'diner', _name: string) => {
    const labels = { ontbijt: 'vanochtend gegeten', lunch: 'deze middag gegeten', diner: 'vanavond gegeten' }
    return `Wat heb je ${labels[mealType]}?`
  },

  mealLogged: (params: {
    kcal: number
    calorie_budget: number
    protein_g: number
  }) => {
    const remaining = params.calorie_budget - params.kcal
    const remainingText =
      remaining > 0
        ? `Je zit nu op ${params.kcal} kcal voor vandaag, nog ${remaining} kcal over.`
        : `Je hebt je dagbudget bereikt voor vandaag.`

    return `Goed, ${params.kcal} kcal genoteerd. ${remainingText}`
  },

  askClarification: (question: string) => question,

  weightCheckin: (name: string) =>
    `${name}, vergeet niet je gewicht door te geven vandaag. Stuur gewoon het getal, bijvoorbeeld 75.2`,

  weightLogged: (weight_kg: number) =>
    `Gewicht opgeslagen: ${weight_kg} kg. Kijk in de app voor je voortgang.`,

  weeklyOverview: (params: {
    name: string
    avg_kcal: number
    calorie_budget: number
    weight_change: number
  }) => {
    const direction = params.weight_change < 0 ? 'afgevallen' : 'bijgekomen'
    const change = Math.abs(params.weight_change).toFixed(1)
    return `${params.name}, hier is je weekoverzicht. Gemiddeld at je ${params.avg_kcal} kcal per dag, je budget is ${params.calorie_budget} kcal. Je bent ${change} kg ${direction} deze week. Nieuwe week, nieuwe kans.`
  },

  unknownMessage: () =>
    `Ik begrijp je bericht niet helemaal. Je kunt me vertellen wat je gegeten hebt, je gewicht doorgeven, of een vraag stellen.`,
}
