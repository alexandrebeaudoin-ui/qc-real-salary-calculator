# Salaire horaire réel — Québec

Calculateur personnel de salaire horaire réel, après impôt fédéral, impôt du Québec, cotisations sociales (RRQ, RQAP, assurance-emploi) et dépenses fixes (hypothèque et autres dépenses récurrentes).

Application 100 % locale : aucune donnée n'est envoyée à un serveur. Vos entrées sont sauvegardées dans le `localStorage` de votre navigateur.

**Avertissement** : cet outil ne constitue pas un avis fiscal. Les barèmes d'impôt et taux de cotisations fournis par défaut sont des valeurs indicatives pour 2026 — vérifiez-les auprès de l'[Agence du revenu du Canada](https://www.canada.ca/fr/agence-revenu.html) et de [Revenu Québec](https://www.revenuquebec.ca/) avant de vous y fier. Tous ces paramètres sont modifiables directement dans l'interface.

## Démarrer

```bash
npm install
npm run dev
```

## Autres commandes

```bash
npm run test    # tests unitaires du moteur de calcul (Vitest)
npm run build   # build de production (dist/)
npm run lint     # lint (oxlint)
```

## Fonctionnement

1. **Revenu** : salaire horaire OU salaire annuel + heures travaillées par semaine.
2. **Paramètres fiscaux** : paliers d'impôt fédéraux et québécois éditables, montant personnel de base, abattement du Québec (16,5 %), taux de cotisations RRQ/RQAP/assurance-emploi.
3. **Dépenses** : hypothèque mensuelle + liste libre de dépenses récurrentes (électricité, assurances, etc.).
4. **Résultat** : décomposé en cascade (brut → impôt fédéral → impôt Québec → cotisations → net → dépenses → disponible) et salaire horaire réel mis en évidence, comparé au salaire horaire brut.

La logique de calcul se trouve dans `src/domain/calc/` (fonctions pures, testées dans `calc.test.ts`).
