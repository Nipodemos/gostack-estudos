import React, { useState, useCallback, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/logo.svg';
import { Title, Form, Repositories, Error } from './styles';
import api from '../../services/api';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const DashBoard: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storedValues = localStorage.getItem(
      '@primeiro-projeto-react/repositories',
    );
    if (storedValues) {
      return JSON.parse(storedValues);
    }
    return [];
  });
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    localStorage.setItem(
      '@primeiro-projeto-react/repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  const handleAddRepository = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!newRepo) {
        setInputError('Digite o autor/nome do repositório');
        return;
      }
      try {
        console.log('newRepo :>> ', newRepo);
        const response = await api.get<Repository>(`/repos/${newRepo}`);
        console.log('response :>> ', response);
        const repository = response.data;
        setRepositories(previousState => [...previousState, repository]);
        setNewRepo('');
        setInputError('');
      } catch (error) {
        setInputError('Erro na busca por esse repositório');
      }
    },
    [newRepo],
  );

  const handleInputChange = useCallback(event => {
    setInputError('');
    setNewRepo(event.target.value);
  }, []);

  return (
    <>
      <img src={logoImage} alt="Github explorer" />
      <Title>Dashboard</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={handleInputChange}
          type="text"
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repositories>
        {repositories.map(repository => (
          <Link
            key={repository.full_name}
            to={`/repository/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default DashBoard;
