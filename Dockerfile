FROM ubirch/webserver
MAINTAINER Falko Zurell <falko.zurell@ubirch.com>

LABEL description="uBirch web admin UI container"
ADD dist /var/www/html/
ADD settings/apache/000-default.conf /etc/apache2/sites-enabled/
ADD settings/apache/ubirch_passwords /etc/apache2/
