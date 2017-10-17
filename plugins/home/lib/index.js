/* global __dirname, require */

const gallery = require('../../gallery/lib/gallery');

const handler = (request, reply) => {
  gallery.getGalleries().then(galleries => reply.view('plugins/home/components/page.jsx', { galleries }));
};

exports.register = (server, options, next) => {
  server.route({
    method: 'GET',
    path: '/',
    config: {
      description: 'Home landing page',
      handler,
      tags: ['react']
    }
  });

  next();
};

exports.register.attributes = {
  name: 'home',
  version: '0.1.1'
};
