import {GQLWorkflowRun} from 'graphql/schema';
import {getUserLocally} from 'hooks/useUserData';

const getRepositoryGithubActions = async (
  org: string,
  repository: string,
  perPage: number = 1,
  status: string = '',
): Promise<GQLWorkflowRun[]> => {
  const GITHUB_AUTH_TOKEN = await getUserLocally('accessToken');

  const response = await fetch(
    `https://api.github.com/repos/${org}/${repository}/actions/runs?per_page=${perPage}&status=${status}`,
    {
      method: 'GET',
      headers: {
        Authorization: `bearer ${GITHUB_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
      },
    },
  );

  // Get the response as JSON
  return await response.json();
};

export default getRepositoryGithubActions;
