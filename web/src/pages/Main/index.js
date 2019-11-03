import React, { useState, useEffect } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default function Main() {
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [invalidRepo, setInvalidRepo] = useState(false);

  useEffect(() => {
    const repos = JSON.parse(localStorage.getItem('repositories'));
    if (repos) setRepositories(repos);
  }, []);

  useEffect(() => {
    localStorage.setItem('repositories', JSON.stringify(repositories));
  }, [repositories]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      if (repositories.map(repository => repository.name).includes(newRepo))
        throw new Error('Repositório duplicado');

      const response = await api.get(`repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      setNewRepo('');
      setRepositories([...repositories, data]);
      setInvalidRepo(false);
    } catch (error) {
      setInvalidRepo(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <h1>
        <FaGithubAlt />
        Repositórios
      </h1>

      <Form onSubmit={handleSubmit} invalid={invalidRepo}>
        <input
          type="text"
          placeholder="Adicionar repositório"
          value={newRepo}
          onChange={event => setNewRepo(event.target.value)}
        />
        <SubmitButton isLoading={loading}>
          {loading ? (
            <FaSpinner color="#FFF" size={14} />
          ) : (
            <FaPlus color="#FFF" size={14} />
          )}
        </SubmitButton>
      </Form>

      <List>
        {repositories.map(repository => (
          <li key={repository.name}>
            <span>{repository.name}</span>
            <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
              Detalhes
            </Link>
          </li>
        ))}
      </List>
    </Container>
  );
}
