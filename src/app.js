const express = require('express');
const cors = require('cors');
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (req, res) => {
  return res.json(repositories);
});

app.post('/repositories', (req, res) => {
  const { title, url, techs } = req.body;

  const repository = {
    id: uuid(),
    title,
    techs,
    likes: 0,
    url,
  };

  repositories.push(repository);

  return res.json(repository);
});

app.put('/repositories/:id', (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'repository not found' });
  }
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return res.json(repository);
});

app.delete('/repositories/:id', (req, res) => {
  const { id } = req.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found ' });
  }

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post('/repositories/:id/like', (req, res) => {
  const { id } = req.params;
  const repository = repositories.find((repository) => repository.id === id);
  if (!repository) {
    return res.status(400).json({ error: 'Repository not found' });
  }
  repository.likes += 1;

  return res.status(202).json(repository);
});

module.exports = app;
