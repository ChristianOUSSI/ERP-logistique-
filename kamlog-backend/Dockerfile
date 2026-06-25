# Dockerfile  KAMLOG Backend FastAPI
FROM python:3.12-slim

WORKDIR /app

# Installer les dépendances système pour WeasyPrint
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf-2.0-0 \
    libffi-dev \
    libssl-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copier les fichiers de dépendances
COPY requirements.txt .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code de l'application
COPY . .

# Rendre start.sh exécutable
RUN chmod +x start.sh

# Exposer le port
EXPOSE 8000

# Commande de démarrage
CMD ["./start.sh"]
