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

// get all the projects -- finished
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

// get specified project -- finished
server.get('/api/projects/:id', validateProjectId, (req, res) => {
  res.status(200).json(req.project);
});

// post a new project -- finished
server.post('/api/projects', (req, res) => {
  const { name, description, completed } = req.body;
  if (!description || !name || typeof completed !== 'boolean') {
    return res.status(400).json({
      error:
        'Needs description and completed and name. "completed" must be a boolean'
    });
  }

  projectModel
    .insert({ description, name, completed })
    .then(newProject => {
      res.status(200).json(newProject);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Error inserting project' });
    });
});

// remove a project -- finished
server.delete('/api/projects/:id', validateProjectId, (req, res) => {
  const { id } = req.params;
  projectModel
    .remove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      console.log('delete error', err);
      res.status(500).json({ error: 'Error removing project' });
    });
});

// edit a project -- finished

server.put('/api/projects/:id', validateProjectId, (req, res) => {
  const { id } = req.params;
  const { name, description, completed } = req.body;
  if (!description || !name || typeof completed !== 'boolean') {
    return res.status(400).json({
      error:
        'Needs description and completed and name. "completed" must have a boolean value'
    });
  }
  projectModel
    .update(id, { name, description, completed })
    .then(updatedResource => {
      res.status(200).json(updatedResource);
    })
    .catch(err => {
      console.log('update error', err);
      res.status(500).json({ error: 'Error editing project' });
    });
});

// get all the actions for a specific project

server.get('/api/projects/:id/actions', (req, res) => {
  const { id } = req.params;
});

//middleware

function validateProjectId(req, res, next) {
  const { id } = req.params;
  projectModel.get(id).then(project => {
    if (project) {
      req.project = project;
      next();
    } else {
      res
        .status(404)
        .json({ error: 'There is no project with the specified id' });
    }
  });
}

const port = 4000;

server.listen(port, () => console.log(`server on ${port}`));