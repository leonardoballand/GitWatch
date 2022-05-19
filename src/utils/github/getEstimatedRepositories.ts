import type {GQLIssue, GQLRepository} from 'graphql/schema';

// Extract user active repositories
const getEstimatedRepositories = (issues: GQLIssue[]) => {
  const repositories: string[] = [];
  const repositoriesData: GQLRepository[] = [];

  issues.forEach(issue => {
    const {name: repositoryName} = issue.repository;

    if (!repositories.includes(repositoryName)) {
      repositories.push(repositoryName);
      repositoriesData.push(issue.repository);
    }
  });

  return repositoriesData;
};

export default getEstimatedRepositories;
