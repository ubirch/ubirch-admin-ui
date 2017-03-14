FROM ubirch/webserver
MAINTAINER Falko Zurell <falko.zurell@ubirch.com>
ARG GO_PIPELINE_NAME=manual
ARG GO_PIPELINE_LABEL=manual
ARG GO_PIPELINE_COUNTER=manual
ARG GO_REVISION_UBIRCH_ADMIN_UI=manual
LABEL description="uBirch web admin UI container"
LABEL GO_PIPELINE_NAME=${GO_PIPELINE_NAME}
LABEL GO_REVISION_UBIRCH_ADMIN_UI=${GO_REVISION_UBIRCH_ADMIN_UI}
LABEL GO_PIPELINE_COUNTER=${GO_PIPELINE_COUNTER}
LABEL GO_PIPELINE_LABEL=${GO_PIPELINE_LABEL}
ENV GO_REVISION_UBIRCH_ADMIN_UI=${GO_REVISION_UBIRCH_ADMIN_UI}
ENV GO_PIPELINE_NAME=${GO_PIPELINE_NAME}
ENV GO_PIPELINE_LABEL=${GO_PIPELINE_LABEL}
ENV GO_PIPELINE_COUNTER=${GO_PIPELINE_COUNTER}
RUN a2enmod proxy
RUN a2enmod proxy_http
ADD dist /var/www/html/
ADD settings/apache/000-default.conf /etc/apache2/sites-enabled/
ADD settings/apache/ubirch_passwords /etc/apache2/
ADD settings/apache/startup.sh /usr/local/bin/
CMD ["/usr/local/bin/startup.sh"]
