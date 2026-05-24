# Namecheap static-IP relay
FROM node:20-alpine

WORKDIR /app
COPY server.js ./

# No npm deps — uses only Node stdlib (http, https, url).
USER node
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1

CMD ["node", "server.js"]
