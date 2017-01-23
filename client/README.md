# cmdr-logs (Commander Logs)

This project is a sci-fi style journaling platform made specifically for [Elite Dangerous](https://www.elitedangerous.com/) commanders (or CMDRs) to role play writing a Captain's Journal during their adventures.

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.  Setup according to the article/guide [here](http://start.jcolemorrison.com/building-an-angular-and-express-app-part-1/).

## Install

* Clone the repo
* `cd client` && `npm install`
* `bower install`
* `cd ../server` && `npm install`

## Build & development

Run `grunt --force` to build and push to the `/server/dist/` folder.  While you can run `grunt serve` from the `/client` folder, go ahead and just use the `/server` location and run `npm test`.  This will have node running the app on `localhost:3000` using nodemon.  Nice to have a little extra like being able to make http proxies and whatnot via express routes.

The production run command is `npm start`.

Note: Bower is installed to `/client/app` so that the server can access the bower_components location without having to change the index.html of those resources.

## Mac Electron build
Commander Log uses electron to create desktop software.
* Global npm installs, do `npm install -g electron electron-packager@8.4.0`

Ensure you've done `npm install` and `bower install` from the `/client` folder.  Now simply do `npm run package-mac` and after a time it should create a `release-builds` folder where you'll find the generated .app.

## Windows Electron build
Commander Log uses electron to create desktop software.  Currently, for Windows the pre-requisites are to have the following setup:
* Start from Win10 OS.
* Install Visual Studio 2015 (or Community 2015), and MAKE SURE to pick Visual C++ and Python Tools during installation options.  If already installed, you can return to that screen by going Control Panel > click Update on VS2015 > Then pick during Update.
* Install Node
* Install npm
* Global npm installs, do `npm install -g electron electron-packager@8.4.0` - if totally new OS, you'll need the normal globals as well like `bower grunt-cli`, etc..
* Install Python 2.7 (python.org)
* Add a system variable to your PATH.  You can use command prompt to do "setx GYP_MSVS_VERSION 2015".
* (optional) - setup Windows Powershell and use this for all your terminal actions.
* NOTE: Run Powershell as Adminstrator if you get errors about "cannot create symlinks".

After pre-reqs are in place, you should be able to build from that windows machine.  Ensure you've done `npm install` and `bower install` in the `/client` folder.  Then you'll want to also copy the `bower_components` folder into the `/client/app` folder, as I havent' setup a better way to do this now (I realize it's silly).  Now from `/client` simply do `npm run package-win` and it will build a `release-builds` folder where you'll find the generated .exe.

## Testing

Running `grunt test` will run the unit tests with karma.
