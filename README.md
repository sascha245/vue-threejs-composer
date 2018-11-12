# vue-threejs-composer

Build beautiful and interactive scenes in the easy way.

## Why?

Today there are already a few libraries out there to create scenes in Vue with Three.js:

- [vue-gl](https://github.com/vue-gl/vue-gl)
- [vue-threejs](https://github.com/fritx/vue-threejs)

These libraries are good for creating simple scenes, as they allow us to easily create basic 3D content, sometimes even with physics.

For more complex ones however, we need more control for some aspects:
- Better and easier management of your assets and scenes
- Creating content with pure THREE.js

This library allows us to do exactly that.

## Features

This library won’t include any basic geometries, materials and more advanced stuff.

It will only implement a base from which you can easily extend from, as well as implement some in-build functionalities to relieve the user of common problems experienced in normal THREE.js projects:

1. In-build asset and scene manager
2. Helpers for loading and instantiating 3D models.
3. Create custom content and components with pure THREE.js code.


## Installation

Install THREE.js:
`npm install three --save`

Optionally, install THREE.js typings:
`npm install @types/three --save-dev`

Install this package:
`npm install vue-threejs-composer --save`


## Samples

If you want to test out our samples, you can clone our repository and launch our samples with the following commands:

Install dependencies
`npm install`

Launch development server
`npm run serve`

Play around with the files in */samples*. The demo scene is situated at */samples/views/Demo.vue*


## Documentation

Here the link to the official [documentation](https://vue-threejs-composer.netlify.com/).
Note however that the writing of the documentation is still in progress.

If you can't find what you are looking for in the documentation, you can also open a new ticket describing your issue.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) for details

## Acknowledgments

- Inspired in some aspects by [vue-gl](https://github.com/vue-gl/vue-gl)
