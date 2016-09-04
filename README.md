# oodump
A web site for viewing/dumping Ooyala v2 analytics data per label/asset

## Install
```
$ docker pull kuuu/oodump-webapp
```

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
  }
}
```

## Run
```
$ docker run -v $(pwd)/config:/usr/src/app/config -p 3000:3000 -d kuuu/oodump-webapp
```
Open localhost:3000 with your browser.

## Develop
Install Node.js (version 6+) on your system.
```
$ git clone git@github.com:kuu/oodump-webapp.git
$ cd oodump-webapp
$ npm install
$ npm run watch
```
