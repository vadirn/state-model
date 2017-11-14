// ./build or components-server ./build ?
const { resolve } = require('path');
const fs = require('fs');
const pkg = require('../../package.json');

const htmlTemplate = props => {
  const { svg, title } = props;
  return `<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'>
    <meta name='language' content='EN'>

    <title>${title}</title>

    <link rel='stylesheet' media='screen' href='/assets/global.v${pkg.version}.css'>
    <link rel='stylesheet' media='screen' href='/assets/main.v${pkg.version}.css'>
  </head>
  <body>

    <div style='display:none;'>
      <svg>${svg}</svg>
    </div>

    <div id='mount-point'></div>

    <div id='portal-mount-point'></div>

    <script src='/assets/manifest.v${pkg.version}.js' charset='utf-8'></script>
    <script src='/assets/vendor.v${pkg.version}.js' charset='utf-8'></script>
    <script src='/assets/main.v${pkg.version}.js' charset='utf-8'></script>
  </body>
</html>`;
};

const prerender = props => {
  const { name, title, folder } = props;
  console.log('Running prerender script...');
  const svg = fs.readFileSync(resolve(__dirname, '../../src/assets', 'index.svg'));
  const htmlString = htmlTemplate({ title, svg });
  try {
    fs.writeFileSync(`${folder}/${name}.html`, htmlString);
    console.log(`${folder}/${name}.html rendered`);
  } catch (err) {
    console.log(`Error while rendering ${folder}/${name}.html`, err);
  }
};

prerender({
  title: 'Components',
  name: 'index',
  folder: resolve(__dirname, '..', 'build'),
});
