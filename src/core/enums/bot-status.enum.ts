export enum BotStatus {
  pending = 'pending', // En attente
  creation = 'creation', // En création, VPS demandé
  pending_configuration = 'pending_configuration', // VPS reçu, en attente de configuration
  configuration = 'configuration', // Configuration en cours
  running = 'running', // En route
  deleted = 'deleted', // Supprimé
}
