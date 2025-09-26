FROM nginx:alpine

# Remove arquivos default do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia o nosso index.html para a pasta correta
COPY ./index.html /usr/share/nginx/html/index.html
