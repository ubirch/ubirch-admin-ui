# ubirch Admin UI

## General Information

ubrich user interface to manage and monitor IOT devices

## Quick Start

0. start ubirch-avatar-service at localhost:8080 (default)
1. `npm install`
2. `bower install`
3. `grunt serve
4. Open http://localhost:9000

## API Documentation

The documentation of the underlying API can be found [here](http://developer.ubirch.com/docs/api)

## Dependencies

We expect the following tools been installed on the machine:

* [npm, package manager for JavaScript](https://www.npmjs.com) (used for nodejs components)

* [bower, package manager](http://gruntjs.com) (used for angular components)
  
        npm install -g bower

* [grunt, the build tool](http://gruntjs.com)

        npm install -g grunt-cli

## Build & development

### Run locally

If you want to run the latest code from git, here's how to get started:

0. checkout and follow the instructions of the ubirch-avatar-service

        git clone https://github.com/ubirch/ubirch-avatar-service

1. Clone the code:

        git clone https://github.com/ubirch/ubirch-admin-ui
        cd ubirch-admin-ui

2. Install the project dependencies

        npm install

3. Install the used angular modules

        bower install

4. Start backend on localhost:8080

5. Build and run the code

        grunt serve

6. Open in Browser:

        http://localhost:9000

### Run tests

Running `grunt test` will run the unit tests with karma.

### Deployment

If you want to deploy the latest version on a server, follow these instructions:

1. Clone the code:

        git clone https://github.com/ubirch/ubirch-admin-ui
        cd ubirch-admin-ui

2. Server settings

  change the settings, especially in one of the following files:
   
  *  settings/settings_dev.js
  *  settings/settings_int.js
  *  settings/settings_prod.js
  
  especially change 
  
  * the url of the backend server in UBIRCH_API_HOST
  * specify DEFAULT_DEVICE_TYPE_KEY if it doesn't equal to 'unknownDeviceTypeKey'
  
3. Run deployment script

For prod deployment execute

        ./deployWeb.sh

For int deployment execute

        ./deployWeb.sh int

## Contact

This project is a creation of the [ubirch GmbH](http://www.ubirch.com).

If you find bugs or have improvements feel free to contact us:

* [send E-Mail](mailto:release@ubirch.com)

## License

If not otherwise noted in the individual files, the code in this repository is

__Copyright &copy; 2016 [ubirch](http://ubirch.com) GmbH, Author: Beate Fiß__

[the Apache License Version 2.0, January 2004](LICENSE)
```
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

## Third Party Libraries and Frameworks

* This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular) - version 0.12.1
