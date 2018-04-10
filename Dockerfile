FROM node:carbon
EXPOSE 8080

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y \
    build-essential \
    curl \
    sudo \
    wget

ENV APP_HOME=/usr/local/nonroot
ENV APP_LOG=/var/log/app/app.log
ENV APP_ERR=/var/log/app.err

# Create a nonroot user and add it as a sudo user
RUN /usr/sbin/useradd --create-home --home-dir $APP_HOME --shell /bin/bash nonroot
RUN /usr/sbin/adduser nonroot sudo
RUN echo "nonroot ALL=NOPASSWD: ALL" >> /etc/sudoes

# Install global node packages
RUN npm install -g \
    gulp-cli \
    nodemon \
    pm2

# Change permission for folders
RUN mkdir -p /var/log/app && chmod a+w /var/log/app

# Install local node packages
ADD package.json /usr/local/lib/app/package.json
RUN echo "ClearCache" && cd /usr/local/lib/app && npm install
RUN chown -R nonroot /usr/local/lib/app/node_modules

# Copy source code
COPY ./ $APP_HOME/app
RUN chown -R nonroot $APP_HOME/app

WORKDIR $APP_HOME/app
USER nonroot
CMD npm start
