# kickin 📦

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Quickly bootstraps environment for developing your great site with [Eleventy.](https://11ty.dev)

## Intention

There is many starters for Eleventy projects. Yep 😵 . And we want also to get into it 😊 . But, if seriously, our goal is to create comfortable environment for developers, while preserving maximal performance ✊ .

## Get started

We do not recommend to install CLI globally. Instead use [npx](https://docs.npmjs.com/cli/v7/commands/npx) to initialize project.

> The minimal required version of NodeJS is **12.17.0**. The reason is that CLI is built on ES module system that is native for a JavaScript world for now.

### Using

`kickin` is a simple command that can accept name of the project and it will be place, where your code will live. If you already have one, then you can invoke command from inside and get your environment.

```sh
npx kickin my-project
```

or

```sh
mkdir my-project
cd my-project
npx kickin
```

### After

There are two commands available:

- `npm start` - starts development server on `http://localhost:3000`
- `npm build` - builds project.

> You can change any part of the generated project as you want - configuration file and all dependencies are open to be changed.

## Overview

As template language we encourage to use JavaScript(**.11ty.js**) files. Though no one stops you to use other templating engines. It's your choice and we respect it.

### Structure

Starter's folder structure are build according to ones used in [Halo Lab](https://www.halo-lab.com).

- All code is located in `src` folder.

  - `assets` - this folder supposed to be home for static content: images, fonts, video, audio etc.
    - `images`
    - `fonts`
    - `video`
    - `audio`
  - `components` - folder where are located [Eleventy's components](https://www.11ty.dev/docs/config/#directory-for-includes)(default name is `_includes`)
  - `layouts` - folder for [layouts](https://www.11ty.dev/docs/layouts/#layouts).
  - `pages` - place where future site's pages live.
  - `scripts` - folder for scripts that will be used in HTML.
  - `styles` - folder for styles.

- Bundled code is located in `build` folder.

> Inner structure of defined directories is up to you 🙃

### HTML

For building templates with JavaScript, you must export from file `render` method that return HTML string.

```js
module.exports.render = () => /* html */ `<div>Hello world</div>`;
```

_It can be asyncronous._

> Unfortunately, currently Eleventy does not support ES modules syntax. [Though there is a direction to it.](https://github.com/11ty/eleventy/issues/836)

> In order to highlight the HTML syntax in template string in VSCode, you can install [Comment tagged templates extension](https://github.com/mjbvz/vscode-comment-tagged-templates).

If template contains data then with `render` function you should export `data` object.

```js
module.exports.data = {
  /* some key/value pairs */
};
```

This object will be passed to `render` function as _first argument_.

> Note: for layouts this object will have [`content`](https://www.11ty.dev/docs/layouts/#mylayout-11tyjs) property that contains inner template's HTML.

Also you can organize template as **class**. It must have `render` method(either syncronous or asyncronous) and `data` method(syncronous or asyncronous) or as getter.

```js
module.exports = class {
  data() {
    // getter or async method
    return {
      /* some key/value pairs */
    };
  }

  async render(data) {
    return /* html */ `<p>I am a class!</p>`;
  }
};
```

Both layout templates and templates from `pages` directory must follow above rules. But if you create component, then it can be just function that returns some HTML.

To include component template into layout or page template simply import component into file and use it 👐.

Component (_components/row.js_):

```js
module.exports = () => /* html */ `<span>I am a component.</span>;
```

Template (_pages/home.js_):

```js
const row = require('../components/row');

module.exports.render = () => /* html */ `<div>${row()}</div>`;
```

Cool! 😃

> More info about JavaScript templates in Eleventy [here](https://www.11ty.dev/docs/languages/javascript/).

It is recommended for pages to use `pwa.11ty.js` layout. This layout template can accept following properties (along with `styles`, `scripts` and [Eleventy's data](https://www.11ty.dev/docs/data-frontmatter/)):

- `lang` - (default **en**) - language of page.
- `title` - text for _title_ tag.
- `description` - text for page _description_ meta tag.
- `keywords` - keywords for _keywords_ meta tag.

> Unfortunately, there is [a bug](https://github.com/11ty/eleventy/issues/1435) updating HTML pages when any _required_ template's dependendy is changed.

### Styles

In starter [Sass](https://sass-lang.com) language is supported.

Stylesheets must be located in `styles` directory and inner structure does not matter. They will be compiled, minified and cleaned from unused selectors automatically.

In order to include style to page in page's template provide `styles` property in `data` object. It can be type of _string_ or _array of string_. The path to style is relative to `src/styles` directory, so you do not need to include this prefix to path.

```js
module.exports.data = {
  // Bundler of this starter is smart enough to recognize type of style
  // and its location (file will be resolved at `src/styles/home.scss`)
  styles: 'home.scss',
};
```

If style is inside some directory, then it must be provided in path:

```js
module.exports.data = {
  styles: 'directory/common.scss', // -> src/styles/directory/common.scss
};
```

> This is thanks to [eleventy-plugin-styles](https://github.com/Halo-Lab/eleventy-plugin-styles).

### Scripts

Starter supports modern JavaScript syntax (except for Eleventy's templates) and [TypeScript](https://www.typescriptlang.org).

Scripts must be located in `scripts` directory and inner structure does not matter (like with styles 😋).

In order to include scripts into HTML page provide `scripts` property in page template's `data` object (can be either type of _string_ or _array of string_). The path to script is relative to `src/scripts` directory, so you do not need to include this prefix to path.

```js
module.exports.data = {
  // This will be resolved to 'src/scripts/main.js'
  scripts: 'main.js', // or 'main.ts' -> 'src/scripts/main.ts'
};
```

> This is thanks to [eleventy-plugin-scripts](https://github.com/Halo-Lab/eleventy-plugin-scripts).

### Images

Starter includes `image` shortcode. Use it if you want include image to HTML (either raster, or vector(SVG) one).

> Info about shortcodes and how to use it in JavaScript templates [here](https://www.11ty.dev/docs/shortcodes/).

Signature of shortcode:

```ts
interface ImageAttributes {
  /** Defines alternative text for image. */
  alt?: string;
  /** Defines title for image. */
  title?: string;
  /** Class name(s) for `class` attribute. */
  classes?: string | ReadonlyArray<string>;
}

async function image(
  src: string,
  attributes?: ImageAttributes
): Promise<string>;
```

First parameter is mandatory and contains a path to image relative to `images` directory.

```js
module.exports.render = async function () {
  return /* html */ `<main>${await this.image('logo.png')}</main>`;
};
```

> For using shortcodes do not write template with arrow functions, because [they do not have access to `this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)!

_logo.png_ will be resolved to `src/assets/images/logo.png`, then `webp` and `avif` images will be generated and placed along with source image in build directory. In HTML you will receive efficient images with right paths 😊!

If you define path to image from CSS (for example in `url` function), then same rules are applied here.

> This is thanks to [eleventy-shortcode-image](https://github.com/Halo-Lab/eleventy-shortcode-image).

### Other assets

Like for images, path to fonts in CSS must be relative to `fonts` directory from `src`.

> Due to [wide support of `woff2` format](https://caniuse.com/?search=woff2) it is recommended to include `woff2` and `woff` font formats only.

### PWA

Starter has plugin that automatically generates favicon, splash images for mobile devices and tile images.

As source for them will be using `favicon.png` file under `images` directory. Though you can customize its name in `.eleventy.js` file.

Also `manifest.json` from `src` directory will be filled with generated `icons` property.

> This is thanks to [eleventy-plugin-pwa-icons](https://github.com/Halo-Lab/eleventy-plugin-pwa-icons).

### Sitemap

For _sitemap.xml_ generation templates from `pages` directory are used.

For creating proper _sitemap.xml_ pass correct `HOST` variable of `.env` file.

Detailed about sitemap [here](https://developers.google.com/search/docs/advanced/sitemaps/overview).

### Service worker

Starter contains plugin that adds service worker to build and enable offline support for site/application.

> Registration service worker script will be automatically injected into each HTML page.

By default worker will cache static resources (images, fonts, audio files etc.) and try to use it from cache at first. Dynamic resources, that can be changed ofted (html, js, css) are cached also, but every request will be transfered to server at first.

> More about strategies [here](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-strategies).

> This is thanks to [eleventy-plugin-workbox](https://github.com/Halo-Lab/eleventy-plugin-workbox).

### Compressing

Generated HTML, CSS and JS during building are compressed using [`brotli`](https://brotli.org) algorithm. For sending compressed version of content you must configure server by yourself.

> [Why brotli?](https://wp-rocket.me/blog/brotli-vs-gzip-compression/)

> This is thanks to [eleventy-plugin-compress](https://github.com/Halo-Lab/eleventy-plugin-compress)

### Configuration

Default configuration of Eleventy is enough for most use cases, but sometimes there is a need to change some behavior.

[`.eleventy.js`](https://www.11ty.dev/docs/config/) is starting point for Eleventy.

If you want to change some behavior or add new feature to site, place most code in `.eleventy/` directory. It has following structure:

- `filters` - used for holding custom [filters](https://www.11ty.dev/docs/filters/).
- `plugins` - contains custom [plugins](https://www.11ty.dev/docs/filters/) for Eleventy.
- `shortcodes` - contains [shortcodes](https://www.11ty.dev/docs/shortcodes/)
- `transforms` - holds HTML transformer functions that changes generated HMTL by Eleventy.

## Word from author

Have fun! ✌️

<a href="https://www.halo-lab.com/?utm_source=github-brifinator-3000">
  <img src="https://api.halo-lab.com/wp-content/uploads/dev_halo.svg" alt="Developed in Halo lab" height="60">
</a>
