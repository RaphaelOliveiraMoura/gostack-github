import React, { useState } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';

import api from '../../services/api';

import { Container, Form, SubmitButton, List } from './styles';

export default function Main() {
  const [newRepo, setNewRepo] = useState('');
  const [respositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);

    const response = await api.get(`repos/${newRepo}`);

    const data = {
      name: response.data.full_name,
    };

    setNewRepo('');
    setRepositories([...respositories, data]);
    setLoading(false);
  }

  return (
    <Container>
      <h1>
        <FaGithubAlt />
        Repositórios
      </h1>

      <Form onSubmit={handleSubmit}>
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
        {respositories.map(repository => (
          <li key={repository.name}>
            <span>{repository.name}</span>
            <a href="/">Detalhes</a>
          </li>
        ))}
      </List>
    </Container>
  );
}
