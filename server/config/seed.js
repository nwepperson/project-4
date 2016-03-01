/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import Channel from '../api/channel/channel.model';

Thing.find({}).removeAsync()
  .then(() => {
    return Thing.create({
      name: 'Development Tools',
      info: 'Integration with popular tools such as Bower, Grunt, Babel, Karma, ' +
             'Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, ' +
             'Stylus, Sass, and Less.'
    }, {
      name: 'Server and Client integration',
      info: 'Built with a powerful and fun stack: MongoDB, Express, ' +
             'AngularJS, and Node.'
    }, {
      name: 'Smart Build System',
      info: 'Build system ignores `spec` files, allowing you to keep ' +
             'tests alongside code. Automatic injection of scripts and ' +
             'styles into your index.html'
    }, {
      name: 'Modular Structure',
      info: 'Best practice client and server structures allow for more ' +
             'code reusability and maximum scalability'
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript ' +
             'payload, minifies your scripts/css/images, and rewrites asset ' +
             'names for caching.'
    }, {
      name: 'Deployment Ready',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku ' +
             'and openshift subgenerators'
    });
  }, handleError);

User.find({}).removeAsync()
  .then(() => {
    return User.createAsync({
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin'
    })
    .then(() => {
      console.log('finished populating users');
      return User.find();
    })
    .then((users) => {
      return createChannels(users);
    })
    .then((channels) => {
      console.log('created the following channels:\n', channels);
    }, handleError);
  });

function createChannels(users) {
  return Channel.find().remove({})
  .then(() => {
    let now = new Date();
    return Channel.create([
      {
        name: 'Awesome Movies',
        description: 'Great all around awesome fucking cool ass movies!',
        active: true,
        share: 'public',
        owner: users[0]._id,
        movies: []
      },
      {
        name: 'Amazingly Terrible',
        description: 'If this is bad, i dont want tot know good!',
        active: true,
        share: 'public',
        owner: users[0]._id,
        movies: []
      },
      {
        name: 'Fucking Crazy',
        description: 'Watch at your own risk...',
        active: true,
        share: 'public',
        owner: users[1]._id,
        movies: []
      }
    ]);
  }, handleError);
}

function handleError(err) {
  console.log('ERROR', err);
}
