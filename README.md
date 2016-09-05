# oodump-webapp
A web site for viewing/exporting Ooyala v2 analytics data per label/asset

## Configure
```
$ mkdir config
$ touch config/default.json
```
Edit `config/default.json` as follows:
```
{
  "api": {
    "key": {Your Ooyala API Key},
    "secret": {Your Ooyala API Secret}
  },
  "db": {
    "host": {Host MongDB is running on, default=localhost},
    "port": {Port MongDB is running on, default=27017}
  }
}
```

## Run (Docker)
Install Docker engine on your system.
```
$ docker run --name mymongo -d mongo
$ docker run --link=mymongo:mongodb -v $(pwd)/config:/usr/src/app/config -p 4000:4000 -d kuuu/oodump-webapp
```
Open localhost:4000 with your browser.

## Run (Manual)
Install Node.js (version 6+) and MongoDB on your system.
```
$ git clone git@github.com:kuu/oodump-webapp.git
$ cd oodump-webapp
$ npm install
$ npm run build
$ npm start
```
Open localhost:4000 with your browser.

## Run (Develop)
```
$ npm run watch
```
This automatically opens localhost:9000 with your browser.
