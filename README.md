# sensibus

A time series logger, analyser, and predictor for your daily feelings and activity. Provides future prediction via dynamic naive bayesian methods.

![Timeline Example](doc/timeline-example.jpg)

## Install

    $ git clone https://github.com/axelpale/sensibus.git
    $ cd sensibus
    $ npm install
    $ npm run build

After the build finishes, open `index.html` in your web browser.

Currently tested only on Google Chrome.

## Production

Point a static file server e.g. Nginx to `sensibus/client/`.
