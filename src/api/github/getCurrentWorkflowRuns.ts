import {GQLWorkflowRun} from 'graphql/schema';
import useStore from 'store';

const getCurrentWorkflowRuns = async (
  org: string,
  repository: string,
  perPage: number = 5,
  status: string = 'in_progress',
): Promise<GQLWorkflowRun[]> => {
  const GITHUB_AUTH_TOKEN = useStore.getState().user.accessToken;

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

export default getCurrentWorkflowRuns;
