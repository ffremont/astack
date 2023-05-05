#!/bin/sh

open http://localhost:8080
export NOVA_ASTROMETRY_APIKEY=<apikey>
java -jar astack.jar

