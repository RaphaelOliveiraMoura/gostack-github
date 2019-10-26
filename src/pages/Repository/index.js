import React, { useState, useEffect } from 'react';

import api from '../../services/api';
import { Container } from './styles';

export default function Repository({ match }) {
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
        setRepository(repository);
        setIssues(issues);

        setLoading(false);
      }
    );
  }, []);

  return <Container>Repository</Container>;
}
