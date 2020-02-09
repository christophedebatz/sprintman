## Bunker Store API ##
### Usage ###
#### Environment ####
Firstly you must complete the .env file with good values (database, port etc.)

#### Launching ####
**Classic**
```
$ bunker.pu --build all
$ bunker.py --up all
$ bunker.py --populate merchant-api
$ bunker.py --up super-tag
$ bunker.py --up lighter-script
$ bunker.puy --up cdn
```
**Dev**
```
$ yarn
$ yarn build
```
Then finally:
```
$ sudo yarn start
```
Or,
```
$ sudo yarn run watch
```
Each time you change a file on src it will quickly rebuild and serve the new app again.

#### Use ####
At every error you encountered, you have to check that all services is running well. To do that, you can:
- see the logs of the service you want to check with this command: `bunker.py --logs <service-name>`
- see if the service is not out of use with this command: `docker ps -a | grep <service-name>`
At first use or after having removing the database bunker container, you have to:
- click on the "save" button of the product tab
- add a carrier by clicking and filling the "carrier" button on the "merchant settings" tab (you can find the good reference by viewing the shipment config of the "oyst settings" tab)

#### DB migrations ####
The only SQL migrations that will be applied are the following:
- the bunker service "merchant-api" is responsible of the core project migrations
- the bunker service "oneclick-api" is responsible of the oneclick project migrations

#### Warnings ####
- when starting, the connector-api has to have an NODE_ENV equals to "development"

### Options
You can override the listening port with `PORT=XXX yarn start`
