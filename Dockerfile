FROM kennycheng/chromium-nodejs
RUN apk add git
RUN /bin/ash -c 'git clone https://github.com/hkbu-kennycheng/url2img-web /srv && cd /srv && npm i'
EXPOSE 5000
CMD ["/usr/bin/node","/srv/app.js"]
