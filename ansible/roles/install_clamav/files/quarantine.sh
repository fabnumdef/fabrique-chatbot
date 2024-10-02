#!/bin/bash
QUARANTINE_DIR="/var/quarantine"

# Assurez-vous que le répertoire de quarantaine existe
mkdir -p "$QUARANTINE_DIR"

# Déplacer le fichier infecté vers la quarantaine
mv "$CLAMAV_VIRUS_PATH" "$QUARANTINE_DIR"

# Journaliser l'événement
echo "$(date) - $CLAMAV_VIRUS_NAME trouvé dans $CLAMAV_VIRUS_PATH et déplacé vers la quarantaine." >> /var/log/clamav/quarantine.log
