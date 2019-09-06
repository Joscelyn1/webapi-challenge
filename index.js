/*
play this: https://www.youtube.com/watch?v=d-diB65scQU

Sing along:

here's a little code I wrote, you might want to read it really slow, don't worry be happy
in every line there may be trouble, but if you worry you make it double, don't worry, be happy
ain't got no sense of what is REST? just concentrate on learning Express, don't worry, be happy
your file is getting way too big, bring a Router and make it thin, don't worry, be crafty
there is no data on that route, just write some code, you'll sort it out… don't worry, just API…
I need this code, just don't know where, perhaps should make some middleware, don't worry, be happy

Go code!
*/

const express = require('express');
const actionModel = require('./data/helpers/actionModel.js');
const projectModel = require('./data/helpers/projectModel.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.send(`hello`);
});

// get all the actions
server.get('/api/actions', (req, res) => {
  actionModel
    .get()
    .then(actions => res.status(200).json(actions))
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: 'The actions information could not be retrieved.' });
    });
});
// get all the projects
server.get('/api/projects', (req, res) => {
  projectModel
    .get()
    .then(projects => res.status(200).json(projects))
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: 'The projects information could not be retrieved.' });
    });
});

// get specified action
server.get('/api/actions/:id', (req, res) => {
  const { id } = req.params;
  actionModel
    .get(id)
    .then(action => {
      console.log('action', action);
      if (action) {
        res.status(200).json(action);
      } else {
        res
          .status(404)
          .json({ error: 'The action with the specified ID does not exist.' });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: 'The action information could not be retrieved.' });
    });
});

// get specified project
server.get('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  projectModel
    .get(id)
    .then(project => {
      console.log('project', project);
      if (project) {
        res.status(200).json(project);
      } else {
        res
          .status(404)
          .json({ error: 'The project with the specified ID does not exist.' });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: 'The project information could not be retrieved.' });
    });
});

// post a new action

server.post('/api/actions/:id', (req, res) => {
  const { description, notes, completed } = req.body;

  const { id } = req.params;

  if (!description || !notes || typeof completed !== 'boolean') {
    return res
      .status(400)
      .json({ error: 'You need to add a description and notes and completed' });
  }

  projectModel.getProjectActions(id).then(({ id }) => {
    actionModel.insert({ description, notes, completed });
  });
});

// post a new project
server.post('/api/projects', (req, res) => {
  const { name, description, completed } = req.body;
  if (!description || !completed || !name) {
    return res
      .status(400)
      .json({ error: 'Need description and completed and name' });
  }

  projectModel
    .insert({ description, name, completed })
    .then(({ id }) => {
      res.status(200).json(id);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Error inserting project' });
    });
});

// remove a project
server.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  projectModel
    .remove(id)
    .then(removed => {
      if (removed) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Project with id does not exist' });
      }
    })
    .catch(err => {
      console.log('delete', err);
      res.status(500).json({ error: 'Error removing project' });
    });
});

// // remove an action
// server.delete('/api/actions/:id', (req, res) => {
//   const { id } = req.params;
//   const actionId = req.body.actionId;
//   if (!actionId) {
//     return res
//       .status(400)
//       .json({ error: 'need to know the id of the action you want to remove' });
//   }
//   projectModel
//     .getProjectActions(id)
//     .then(project => {
//       if (project) {
//         actionModel
//           .remove(actionId)
//           .then(result => {
//             res.status(200).end();
//           })
//           .catch(res.status(500).json({ error: 'Error removing action' }));
//       } else {
//         res.status(404).json({ error: 'Project with id does not exist' });
//       }
//     })
//     .catch(err => {
//       console.log('delete', err);
//       res.status(500).json({ error: 'Error removing action' });
//     });
// });

const port = 4000;

server.listen(port, () => console.log(`server on ${port}`));
