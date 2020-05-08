# sensibus

A time series logger, analyser, and predictor for your daily feelings and activity. Provides future prediction via dynamic naive bayesian methods.

![Timeline Example](doc/timeline-example.jpg)

## Install

    $ git clone https://github.com/axelpale/sensibus.git
    $ cd sensibus
    $ npm install
    $ cp .env-sample .env
    $ nano .env
    $ npm run build
    $ npm start

Then, open [localhost:8888](http://localhost:8888/) in your web browser.

## Directory structure

- `doc/` – images and stuff for documentation purposes
- `local_modules/` – features and logic shared between submodules
- `server/` – a submodule, a sensibus server instance
- `site/` – a front-end client responsible for most pages of the sensibus site
- `timeline/` – a front-end client responsible for the timeline page

## Licence

[GPL 3.0](LICENSE)
