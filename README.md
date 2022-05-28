# Portico Exchange-frontend

https://camo.githubusercontent.com/12765718a89f59af0044889359a5142cc8405834d56d3f37b1c3133eb96f8792/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f7374617475732d6578706572696d656e74616c2d7261696e626f772e7376673f7374796c653d666c61742d737175617265

* Frontend for Portico Exchange
* Running on https://lnswap.org (testnet)

## deploy to Vercel with 1-click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpseudozach%2Flnstxbridge-frontend&env=REACT_APP_BOLTZ_API,REACT_APP_BITCOIN_LND,REACT_APP_BITCOIN_LND_ONION,REACT_APP_NETWORK,REACT_APP_STACKS_NETWORK_TYPE&envDescription=lnstxbridge%20and%20node%20details&envLink=https%3A%2F%2Fgithub.com%2Fpseudozach%2Flnstxbridge-frontend%2Fblob%2Fmain%2F.env)

## install
* clone the repo and install requirements  
`git clone https://github.com/pseudozach/lnstxbridge-frontend.git`  
`cd lnstxbridge-frontend && npm i`

* make required changes as per your environment to `.env` file

* start the app  
`npm run start`

## use
* visit `http://localhost:3001`

## docker
`docker buildx build --platform linux/amd64 -t pseudozach/lnstxbridge-frontend:latest .`
