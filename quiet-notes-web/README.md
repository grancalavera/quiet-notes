# Time building with CRA

```
/usr/bin/time -p yarn build
yarn run v1.22.5
$ react-scripts build
Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  508.32 KB  build/static/js/2.cf8bce08.chunk.js
  28.96 KB   build/static/css/2.4a388150.chunk.css
  6.3 KB     build/static/js/main.012db55d.chunk.js
  1.58 KB    build/static/js/3.b69d9f0a.chunk.js
  1.17 KB    build/static/js/runtime-main.ef18f96e.js
  938 B      build/static/css/main.b9c4d70a.chunk.css

The project was built assuming it is hosted at /.
You can control this with the homepage field in your package.json.

The build folder is ready to be deployed.
You may serve it with a static server:

  npm install -g serve
  serve -s build

Find out more about deployment here:

  https://cra.link/deployment

Done in 19.39s.
real 19.62
user 37.64
sys 2.10
```
