# client

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.  Setup according to the article/guide [here](http://start.jcolemorrison.com/building-an-angular-and-express-app-part-1/).

## Install

* Clone the repo
* 'cd client' && 'npm install'
* 'bower install'
* 'cd ../server' && 'npm install'

## Build & development

Run `grunt --force` to build and push to the `/server/dist/` folder.  While you can run `grunt serve` from the `/client` folder, go ahead and just use the `/server` location and run `npm test`.  This will have node running the app on `localhost:3000` using nodemon.  Nice to have a little extra like being able to make http proxies and whatnot via express routes.

The production run command is `npm start`.

Note: Bower is installed to `/client/app` so that the server can access the bower_components location without having to change the index.html of those resources.

## Testing

Running `grunt test` will run the unit tests with karma.
