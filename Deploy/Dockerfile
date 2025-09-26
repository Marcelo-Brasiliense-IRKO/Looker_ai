FROM nginx:alpine

# Remove os arquivos padrão
RUN rm -rf /usr/share/nginx/html/*

# Copia todos os arquivos da pasta local para o HTML do NGINX
COPY . /usr/share/nginx/html/
