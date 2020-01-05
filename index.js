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
    .then(updatedProject => {
      res.status(200).json(updatedProject);
    })
    .catch(err => {
      console.log('update error', err);
      res.status(500).json({ error: 'Error editing project' });
    });
});

// get all the actions for a specific project -- finished

server.get('/api/projects/:id/actions', validateProjectId, (req, res) => {
  const { id } = req.params;
  projectModel
    .getProjectActions(id)
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(err => {
      console.log('get actions error', err);
      res.status(500).json({ error: 'Error getting actions for project' });
    });
});

// get a specific action -- finished

server.get('/api/projects/actions/:actionId', validateActionId, (req, res) => {
  const { actionId } = req.params;
  actionModel
    .get(actionId)
    .then(action => {
      res.status(200).json(action);
    })
    .catch(err => {
      console.log('get action error', err);
      res.status(500).json({ error: 'Error getting action' });
    });
});

// add an action -- finished

server.post('/api/projects/:id/actions', validateProjectId, (req, res) => {
  const project_id = req.params.id;
  const { description, notes, completed } = req.body;
  if (!description || !notes || typeof completed !== 'boolean') {
    return res.status(400).json({
      error:
        'Needs description and notes and name. "completed" must have a boolean value'
    });
  }
  actionModel
    .insert({ description, notes, completed, project_id })
    .then(project => {
      res.status(200).json(project);
    })
    .catch(err => {
      console.log('error adding action for project', err);
      res.status(500).json({ error: 'error adding action for project' });
    });
});

// delete an action -- finished

server.delete(
  '/api/projects/actions/:actionId',
  validateActionId,
  (req, res) => {
    const { actionId } = req.params;
    actionModel
      .remove(actionId)
      .then(project => {
        res.status(200).json(project);
      })
      .catch(err => {
        console.log('error deleting action for project', err);
        res.status(500).json({ error: 'error deleting action for project' });
      });
  }
);

// edit an action -- finished

server.put('/api/projects/actions/:actionId', validateActionId, (req, res) => {
  const { actionId } = req.params;

  const { description, notes, completed } = req.body;
  if (!description || !notes || typeof completed !== 'boolean') {
    return res.status(400).json({
      error:
        'Needs description and notes and name. "completed" must have a boolean value'
    });
  }
  actionModel
    .update(actionId, { description, notes, completed })
    .then(updatedAction => {
      res.status(200).json(updatedAction);
    })
    .catch(err => {
      console.log('error editing action', err);
      res.status(500).json({ error: 'error editing action' });
    });
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

function validateActionId(req, res, next) {
  const { actionId } = req.params;
  actionModel.get(actionId).then(action => {
    if (action) {
      req.action = action;
      next();
    } else {
      res
        .status(404)
        .json({ error: 'There is no action with the specified id' });
    }
  });
}

const port = 4000;

server.listen(port, () => console.log(`server on ${port}`));
