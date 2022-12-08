<p align="center">
  <a href="https://chatbot.fabnum.fr" target="blank"><img src="https://chatbot.d.fabnum.fr/assets/img/logo_fabrique_chatbot.svg" width="320" alt="Logo Fabrique à chatbots" /></a>
</p>

## Usine à Chatbots
[![build status](https://github.com/fabnumdef/fabrique-chatbot-front/workflows/Build/badge.svg)](https://github.com/fabnumdef/fabrique-chatbot-front/actions)
[![Cypress status](https://img.shields.io/badge/cypress.io-tests-green.svg)](https://dashboard.cypress.io/projects/v5uzfp/runs)
<img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /> <img src="https://github.com/fabnumdef/fabrique-chatbot-back/workflows/Build%20&%20Deploy/badge.svg">

L’objectif de l'‘Usine à chatbots’ est de détailler les étapes de réalisation d’un chatbot — de l’identification d’un cas d’usage, à la mise en place de l’interface du chatbot — afin de ne pas créer de ruptures dans l’expérience utilisateur, et de fournir les documents/code/template utiles pour la réalisation d’un chatbot.

Ce service est un guide pour la définition d’une problématique de diffusion d’informations se prêtant à une solution « chatbot ».

C’est également une aide pratique pour la constitution d’une base documentaire (template excel) où sont consignées les questions/réponses du chatbot, et pour la réalisation de l’interface qui permet de créer et maintenir le chatbot (back office pour mise à jour de la base documentaire).

### Architecture

Frontend sous [Angular 10](https://angular.io/docs) couplé à [Angular Material](https://material.angular.io/).

Backend sous [NestJS 6](https://docs.nestjs.com/), framework [NodeJS](http://nodejs.org).

Tests réalisés avec [Cypress](https://docs.cypress.io/).

| Repo Git           | URL                                                   | Technologies       | Description                        |
| ------------------ | ----------------------------------------------------- | ------------------ | ---------------------------------- |
| Usine - Front   | https://github.com/fabnumdef/fabrique-chatbot-front   | Angular 10         | Front du site de l'Usine       |
| Usine - Back    | https://github.com/fabnumdef/fabrique-chatbot-back    | NestJS 6           | Back du site de l'Usine        |
| Chatbot - Front    | https://github.com/fabnumdef/chatbot-front            | Angular 10         | Front des Backoffices des chatbots |
| Chatbot - Back     | https://github.com/fabnumdef/chatbot-back             | NestJS 6           | Back des Backoffices des chatbots  |
| Chatbot - Template | https://github.com/fabnumdef/chatbot-template         | RASA 1.10          | Template RASA des chatbots         |

### Utilisation

#### Front
1. Cloner le repo et `cd` dedans
2. `cp env.example .env`
3. Editer le fichier `.env`
4. `npm install`
5. `npm run start`

#### Back
Le Back est couplé à une base de données (PostgreSQL dans notre cas), les données de connexion doivent être renseignée dans le fichier `.env`.

1. Cloner le repo et `cd` dedans
2. `cp env.example .env`
3. Editer le fichier `.env`
4. `npm install`
5. `npm run start:dev`

### Tests

Run `npm run cypress:local`

## Déploiement

Les playbooks sont faits pour être utilisé avec des serveurs tournant sous Debian 10.

### Usine à Chatbots

#### Playbook unifié

Copier le fichier .env de l'usine dans le dossier `ansible/roles/usineConfiguration/files`. Exemple trouvable dans le dossier `back/.env.example`.

Si la BDD requiert un certificat, le copier dans `ansible/roles/usineConfiguration/files/postgres.cert`.

`ansible-playbook playUsine.yml -i $IP_ADRESS, -e '{USER_PASSWORD: '$USER_PASSWORD', usineBranch: 'master', DOMAIN: '$URL_USINE'}';`

### Chatbot

#### Playbook séparés

`ansible-playbook playChatbotprebook.yml -i $IP_ADRESS, -e '{USER_PASSWORD: '$USER_PASSWORD', ROOT_USER: '$ROOT_USER', ROOT_PASSWORD: '$ROOT_PASSWORD'}';`

`ansible-playbook playChatbotsecurity.yml -i $IP_ADRESS, -e '{USER_PASSWORD: '$USER_PASSWORD'}';`

`ansible-playbook playChatbotconfiguration.yml -i $IP_ADRESS, -e '{USER_PASSWORD: '$USER_PASSWORD', DB_PASSWORD: '$DB_PASSWORD'}';`

`ansible-playbook playChatbotupdaterepos.yml -i $IP_ADRESS, -e '{USER_PASSWORD: '$USER_PASSWORD', frontBranch: 'master', backBranch: 'master', botBranch: 'master'}';`

Copier le fichier .env du chatbot dans le dossier `ansible/roles/chatbotGeneration/files`. Exemple trouvable dans ce même dossier `.env.example`.

Si la BDD requiert un certificat, le copier dans `ansible/roles/chatbotGeneration/files/postgres.cert`.

`ansible-playbook playChatbotgeneration.yml -i $IP_ADRESS, -e '{USER_PASSWORD: '$USER_PASSWORD', DB_PASSWORD: '$DB_PASSWORD', botDomain: '$BOT_DOMAIN'}';`

`ansible-playbook playChatbotinitdata.yml -e '{BOT_URL: "$BOT_URL"}';`

#### Playbook unifié

Copier le fichier .env du chatbot dans le dossier `ansible/roles/chatbotGeneration/files`. Exemple trouvable dans ce même dossier `.env.example`.

Si la BDD requiert un certificat, le copier dans `ansible/roles/chatbotGeneration/files/postgres.cert`.

`ansible-playbook playChatbot.yml -i $IP_ADRESS, -e '{USER_PASSWORD: '$USER_PASSWORD', ROOT_USER: '$ROOT_USER', ROOT_PASSWORD: '$ROOT_PASSWORD', DB_PASSWORD: '$DB_PASSWORD', frontBranch: 'master', backBranch: 'master', botBranch: 'master', botDomain: '$BOT_DOMAIN'}';`

`ansible-playbook playChatbotinitdata.yml -e '{BOT_URL: "$BOT_URL"}';`

## Restons en contact

- Site web - [https://chatbot.fabnum.fr](https://chatbot.fabnum.fr/)
- Auteurs - [Beta.gouv](https://beta.gouv.fr/startups/fabrique-chatbots.html)

## License

[MIT licensed](LICENSE).
