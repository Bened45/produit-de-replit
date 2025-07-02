# Guide d'intégration API - VacciCare

Ce guide vous aide à connecter l'interface frontend à votre serveur API FastAPI/Lightning Network.

## Configuration rapide

### 1. Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# URL de votre serveur API
VITE_API_BASE_URL=http://localhost:8000

# Configuration Lightning Network (optionnel)
VITE_LND_HOST=localhost
VITE_LND_PORT=10009
```

### 2. Structure API attendue

Votre serveur FastAPI doit implémenter ces endpoints :

#### Patients
- `GET /patients` - Liste tous les patients
- `POST /patients` - Créer un patient
- `GET /patients/{id}` - Récupérer un patient
- `PUT /patients/{id}` - Mettre à jour un patient
- `GET /patients/search?q={query}` - Rechercher des patients

#### Vaccins
- `GET /vaccines` - Liste tous les vaccins
- `POST /vaccines` - Créer un vaccin
- `GET /vaccines/{id}` - Récupérer un vaccin

#### Vaccinations
- `GET /vaccinations` - Liste toutes les vaccinations
- `POST /vaccinations` - Créer une vaccination
- `GET /vaccinations/{id}` - Récupérer une vaccination
- `GET /patients/{id}/vaccinations` - Vaccinations d'un patient
- `GET /vaccinations/recent?limit={n}` - Vaccinations récentes
- `POST /vaccinations/{id}/qr-code` - Générer code QR
- `POST /vaccinations/{id}/sign` - Signer numériquement

#### Rendez-vous
- `GET /appointments` - Liste tous les rendez-vous
- `POST /appointments` - Créer un rendez-vous
- `GET /appointments/{id}` - Récupérer un rendez-vous
- `PUT /appointments/{id}` - Mettre à jour un rendez-vous
- `GET /appointments/by-date?date={date}` - Par date
- `GET /appointments/upcoming?limit={n}` - Prochains RDV

#### Dashboard
- `GET /dashboard/stats` - Statistiques
- `GET /dashboard/activity` - Activité récente

#### Lightning Network
- `GET /lightning/info` - Info du nœud
- `POST /lightning/sign` - Signer un message
- `POST /lightning/verify` - Vérifier signature

#### Health Check
- `GET /health` - Vérifier que l'API fonctionne

## Modèles de données

### Patient
```json
{
  "id": 1,
  "firstName": "Jean",
  "lastName": "Dupont",
  "dateOfBirth": "1990-01-01",
  "socialSecurityNumber": "123456789",
  "phone": "+33123456789",
  "email": "jean.dupont@email.com",
  "address": "123 Rue de la Paix, Paris",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

### Vaccination
```json
{
  "id": 1,
  "patientId": 1,
  "vaccineId": 1,
  "doctorId": 1,
  "lotNumber": "LOT123456",
  "expirationDate": "2025-12-31",
  "injectionSite": "Bras gauche",
  "dosage": "0.5ml",
  "notes": "Aucune réaction",
  "certificateId": "CERT123",
  "qrCodeData": "QR_DATA_STRING",
  "signature": "LIGHTNING_SIGNATURE",
  "administeredAt": "2025-01-01T10:00:00Z"
}
```

### Réponse avec données enrichies
Pour les listes de vaccinations et rendez-vous, inclure les données liées :

```json
{
  "id": 1,
  "patientId": 1,
  "vaccineId": 1,
  "doctorId": 1,
  "lotNumber": "LOT123456",
  "patient": {
    "id": 1,
    "firstName": "Jean",
    "lastName": "Dupont"
  },
  "vaccine": {
    "id": 1,
    "name": "Pfizer-BioNTech",
    "manufacturer": "Pfizer"
  }
}
```

## Signatures Lightning Network

### Signer une vaccination
```json
POST /vaccinations/{id}/sign
{
  "signature": "LIGHTNING_SIGNATURE_STRING"
}
```

### Vérifier une signature
```json
POST /lightning/verify
{
  "message": "vaccination_data_hash",
  "signature": "LIGHTNING_SIGNATURE",
  "pubkey": "NODE_PUBLIC_KEY"
}
```

## Gestion des erreurs

Votre API doit retourner des erreurs au format :

```json
{
  "error": "Description de l'erreur",
  "status": 400,
  "details": "Informations supplémentaires"
}
```

Codes d'erreur attendus :
- `400` - Données invalides
- `401` - Non authentifié
- `403` - Non autorisé
- `404` - Ressource non trouvée
- `500` - Erreur serveur

## Authentification

Si votre API utilise l'authentification :

1. **JWT Bearer Token** - Le frontend enverra `Authorization: Bearer {token}`
2. **Sessions** - Le frontend utilise `credentials: "include"`

## Test de l'intégration

1. Démarrez votre serveur API
2. Configurez `VITE_API_BASE_URL` 
3. Le composant ApiStatus affichera l'état de connexion
4. Testez chaque fonctionnalité dans l'interface

## Développement local vs Production

### Développement
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Production
```env
VITE_API_BASE_URL=https://votre-api.com
```

## Debugging

### Logs réseau
Ouvrez les outils de développement → Network pour voir les requêtes API

### Console JavaScript
Les erreurs API sont loggées dans la console

### Composant ApiStatus
Affiche l'état de connexion en temps réel sur le dashboard

## Support CORS

Votre serveur FastAPI doit autoriser les requêtes depuis le frontend :

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "https://votre-frontend.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Prochaines étapes

1. Implémentez les endpoints dans votre FastAPI
2. Configurez les variables d'environnement
3. Testez la connexion via le composant ApiStatus
4. Vérifiez chaque fonctionnalité dans l'interface

L'interface basculera automatiquement entre le mode local (données fictives) et le mode API selon la disponibilité de votre serveur.