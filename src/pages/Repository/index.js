import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssueList, Pagination } from './styles';

function Repository({ match }) {
  const [repository, setRepository] = useState({});
  const [issues, setIssues] = useState({});
  const [loading, setLoading] = useState({});
  const [filter, setFilter] = useState('all');

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);

  useEffect(() => {
    setLoading(true);

    const repositoryName = decodeURIComponent(match.params.repository);

    async function getRepositoryInformation() {
      return api.get(`/repos/${repositoryName}`);
    }

    async function getRepositoryIssues() {
      return api.get(`/repos/${repositoryName}/issues`, {
        params: {
          state: filter,
          per_page: 5,
          page,
        },
      });
    }

    Promise.all([getRepositoryInformation(), getRepositoryIssues()]).then(
      response => {
        const [repositoryResponse, issuesResponse] = response;

        const lastIssuePage = issuesResponse.headers.link
          .split(',')[1]
          .split('>')[0]
          .split('=')
          .pop();

        setRepository(repositoryResponse.data);
        setIssues(issuesResponse.data);
        setLoading(false);
        setLastPage(lastIssuePage);
      }
    );
  }, [match.params.repository, filter, page]);

  async function handleFilter(event) {
    setLoading(true);
    setPage(1);
    setFilter(event.target.value);
  }

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

      <IssueList>
        <select onChange={handleFilter} value={filter}>
          <option value="all">Todas</option>
          <option value="open">Abertas</option>
          <option value="closed">Fechadas</option>
        </select>
        {issues.map(issue => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />
            <div>
              <strong>
                <a href={issue.html_url}>{issue.title}</a>
                {issue.labels.map(label => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
              </strong>
              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
        <Pagination hasBefore={page > 1} hasNext={page < lastPage}>
          <FaAngleLeft
            size="1.4em"
            onClick={() => page > 1 && setPage(Number(page) - 1)}
          />
          <span>{page}</span>
          <FaAngleRight
            size="1.4em"
            onClick={() => page < lastPage && setPage(Number(page) + 1)}
          />
        </Pagination>
      </IssueList>
    </Container>
  );
}

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({ repository: PropTypes.string }),
  }).isRequired,
};

export default Repository;
