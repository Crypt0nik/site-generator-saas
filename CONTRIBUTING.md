# Contribution Guidelines

Merci de votre intérêt pour contribuer au Site Generator SAAS ! 🎉

## 🚀 Comment Contribuer

### 1. Fork et Clone
```bash
git clone https://github.com/votre-fork/site-generator-saas.git
cd site-generator-saas
```

### 2. Configuration Développement
```bash
# Installer les dépendances
npm install
cd api && npm install
cd ../web && npm install

# Démarrer en mode développement
npm run dev:all
```

### 3. Créer une Branche
```bash
git checkout -b feature/nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-bug
```

## 📝 Standards de Code

### Style Guide
- **TypeScript** pour l'API
- **Next.js** pour le frontend
- **TailwindCSS** pour le styling
- **ESLint + Prettier** pour le formatage

### Conventions de Nommage
- **Branches** : `feature/`, `fix/`, `docs/`, `refactor/`
- **Commits** : Format conventionnel (`feat:`, `fix:`, `docs:`)
- **Variables** : camelCase pour JS/TS, kebab-case pour CSS

## 🧪 Tests

### Lancer les Tests
```bash
# Tests automatisés
npm run test

# Tests d'intégration
npm run test:integration

# Démonstration complète
npm run test:demo
```

### Ajouter des Tests
- Tests unitaires dans `/tests`
- Tests d'intégration avec scripts bash
- Documentation des nouveaux tests

## 📚 Documentation

### Mise à Jour Documentation
- README.md pour changements majeurs
- Comments inline pour fonctions complexes
- CHANGELOG.md pour versioning

## 🔄 Pull Requests

### Checklist PR
- [ ] Tests passent
- [ ] Code formaté (lint + prettier)
- [ ] Documentation mise à jour
- [ ] Description PR détaillée

### Template PR
```markdown
## Description
Description claire des changements

## Type de Changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Tests
- [ ] Tests ajoutés/modifiés
- [ ] Tous les tests passent

## Screenshots
Si applicable, captures d'écran
```

## 🐛 Signaler des Bugs

### Template Issue
```markdown
## Description du Bug
Description claire et concise

## Reproduction
Étapes pour reproduire:
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

## Comportement Attendu
Ce qui devrait arriver

## Environnement
- OS: [macOS/Windows/Linux]
- Node.js: [version]
- Navigateur: [Chrome/Firefox/Safari]
```

## 💡 Proposer des Fonctionnalités

### Template Feature Request
```markdown
## Fonctionnalité Proposée
Description claire de la fonctionnalité

## Problème Résolu
Quel problème cette fonctionnalité résout-elle?

## Solution Proposée
Description de la solution

## Alternatives Considérées
Autres solutions envisagées
```

## 🏷️ Versioning

Nous suivons [Semantic Versioning](https://semver.org/):
- **MAJOR** : Breaking changes
- **MINOR** : Nouvelles fonctionnalités
- **PATCH** : Bug fixes

## 📞 Support

- GitHub Issues pour bugs et features
- GitHub Discussions pour questions
- Email: support@site-generator-saas.com

Merci de contribuer ! 🙏
