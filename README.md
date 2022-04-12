# harvest-front

A web application to make your hard work easier with [harvest.finance](https://harvest.finance).

## Getting started

### Quick start

1. Make sure you have the correct version of Node.JS and Yarn:

 - Node.JS: v`14.x`
 - Yarn: v`1.22.x`

2. To make the app work smoothly you need to set the appropriate environment variables.

#### Environment variables
| Var name | Example value | Description
|--|--|--|
| REACT_APP_INFURA_KEY | 09112kdmslfasdasd | Infura key. Create a new for free
| REACT_APP_MATIC_INFURA_KEY | djdfdnl1k231 | Infura key that also supports Polygon (Matic). Can be same as `REACT_APP_INFURA_KEY` if it supports Polygon (typically not free).
| REACT_APP_EXTERNAL_API_KEY | 4daa-a552 | API key of api.harvest.finance (publicly available)
| REACT_APP_API_KEY | 4daa-a552 | API key of api-ui.harvest.finance (publicly available)
| REACT_APP_ZAPPERFI_API_KEY | 96e0cc51 | API key for zapperfi support
| REACT_APP_MODE | `prod` | `debug` value for logs in general. Leave empty to not use debug mode

3.  Retrieve the static data of [harvest-api](https://github.com/harvest-finance/harvest-api) via the following  `git`  commands: `git submodule update --init` and `git submodule foreach git checkout master && git pull` or `git submodule update --remote --merge`. NOTE: please do NOT update the reference to harvest-api submodule in your contributions to avoid conflicts, since a bot automatically pushes latest commit reference of `harvest-api` to this repository's main branch.

4. Run `yarn` in order to install the dependencies and you are ready to become a humble farmer!

## Available Scripts

### `yarn start`

Runs the app in the development mode.<br  />

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode. We do not have tests yet.


### `yarn build`

Builds the app for production to the `build` folder.<br  />

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br  />

Your app is ready to be deployed!


### `yarn eject`


**Note: this is a one-way operation. Once you `eject`, you can’t go back!**


If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.


Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

# License

This project is licensed under private license, Copyright (C) 2020-2021 [harvest.finance](https://harvest.finance). For more information see `LICENSE.md`
