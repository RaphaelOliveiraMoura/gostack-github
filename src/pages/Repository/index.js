import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner } from './styles';

function Repository({ match }) {
  const [repository, setRepository] = useState({});
  const [issues, setIssues] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    setLoading(true);

    const repositoryName = decodeURIComponent(match.params.repository);

    async function getRepositoryInformation() {
      return api.get(`/repos/${repositoryName}`);
    }

    async function getRepositoryIssues() {
      return api.get(`/repos/${repositoryName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      });
    }

    Promise.all([getRepositoryInformation(), getRepositoryIssues()]).then(
      response => {
        const [repository, issues] = response;

        setRepository(repository.data);
        setIssues(issues.data);
        setLoading(false);
      }
    );
  }, []);

  return loading ? (
    <Loading>Carregando</Loading>
  ) : (
    <Container>
      <Owner>
        <Link to="/">Voltar aos repositórios</Link>
        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
        <h1>{repository.name}</h1>
        <p>{repository.description}</p>
      </Owner>
    </Container>
  );
}

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({ repository: PropTypes.string }),
  }).isRequired,
};

export default Repository;
