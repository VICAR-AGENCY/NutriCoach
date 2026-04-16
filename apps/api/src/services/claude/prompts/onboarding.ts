/**
 * System prompts for Claude-based field extraction during onboarding.
 * Each step extracts structured data from free-form Dutch user input.
 */

export const ONBOARDING_SYSTEM_PROMPT = `Je bent een data-extractie assistent voor een Nederlandse voedingscoach app.
Je taak: extraheer gestructureerde data uit een informeel Nederlands WhatsApp bericht.
Antwoord ALTIJD met geldige JSON. Nooit met proza.
Als de input niet genoeg informatie bevat, zet "valid": false en geef een "error_message" in het Nederlands.`

export const extractBasicInfoPrompt = `Extraheer de volgende velden uit dit bericht over basisgegevens:
- name: voornaam (string)
- dob: geboortedatum in ISO format YYYY-MM-DD (string)
- gender: "man", "vrouw", of "anders" (string)

Antwoord met JSON:
{
  "valid": true/false,
  "name": "...",
  "dob": "YYYY-MM-DD",
  "gender": "man|vrouw|anders",
  "error_message": null of "Nederlandse foutmelding"
}`

export const extractBodyStatsPrompt = `Extraheer gewicht en lengte:
- weight_kg: getal in kg (number)
- height_cm: lengte in cm (number)

Antwoord met JSON:
{
  "valid": true/false,
  "weight_kg": 0,
  "height_cm": 0,
  "error_message": null of "Nederlandse foutmelding"
}`

export const extractGoalPrompt = `Extraheer het doel:
- goal_type: "afvallen", "gewicht_houden", "aankomen", of "gezonder_eten" (string)
- target_weight_kg: doelgewicht in kg of null als niet van toepassing (number|null)
- timeline_weeks: tijdlijn in weken of null (number|null)
- pace_kg_per_week: 0.5, 0.75, of 1.0 — kies op basis van "rustig/normaal/snel" of null (number|null)

Antwoord met JSON:
{
  "valid": true/false,
  "goal_type": "...",
  "target_weight_kg": null,
  "timeline_weeks": null,
  "pace_kg_per_week": null,
  "error_message": null of "Nederlandse foutmelding"
}`

export const extractLifestylePrompt = `Extraheer activiteitsniveau:
- activity_level: "zittend", "licht_actief", "matig_actief", of "zeer_actief"

Antwoord met JSON:
{
  "valid": true/false,
  "activity_level": "...",
  "error_message": null of "Nederlandse foutmelding"
}`

export const extractFoodPrefsPrompt = `Extraheer voedingsvoorkeuren:
- diet_type: "omnivoor", "vegetarisch", "veganistisch", of "pescatarisch"
- allergies: array van strings (lege array als geen)
- disliked_foods: array van strings die de gebruiker niet eet (lege array als geen)

Antwoord met JSON:
{
  "valid": true/false,
  "diet_type": "...",
  "allergies": [],
  "disliked_foods": [],
  "error_message": null of "Nederlandse foutmelding"
}`

export const extractCheckinPrefsPrompt = `Extraheer check-in tijden en gewenste toon:
- breakfast_time: HH:MM format (string)
- lunch_time: HH:MM format (string)
- dinner_time: HH:MM format (string)
- tone: "streng", "motiverend", of "vriendelijk"

Antwoord met JSON:
{
  "valid": true/false,
  "breakfast_time": "07:30",
  "lunch_time": "12:30",
  "dinner_time": "18:30",
  "tone": "motiverend",
  "error_message": null of "Nederlandse foutmelding"
}`
