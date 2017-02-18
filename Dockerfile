FROM ubirch/webserver
MAINTAINER Falko Zurell <falko.zurell@ubirch.com>

LABEL description="uBirch web admin UI container"
ADD dist /var/www/html/
