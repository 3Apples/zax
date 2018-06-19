#!/bin/bash

export NODE_ENV=production

while true;
do
	echo STARTING @ `date`
	npm start
	[ $? -ne 0 ] && { echo ERROR: NPM START '!'; }
	echo Apparently crashed @ `date`
done
