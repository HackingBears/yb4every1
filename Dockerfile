FROM nginxinc/nginx-unprivileged:1.18.0-alpine

LABEL maintainer="HackingBears"

USER 0
RUN set -x \
    && ln -sf /usr/share/zoneinfo/Europe/Zurich /etc/localtime \
    && echo "Europe/Zurich" > /etc/timezone
#Permissions
RUN chgrp -R 0 /var/cache/nginx && \
    chmod -R g=u /var/cache/nginx

COPY default.conf.template /etc/nginx/templates/
COPY dist/ /var/www/

USER 1001
