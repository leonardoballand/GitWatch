const GITHUB_AUTH_TOKEN = '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';

const getRepositoryActions = async (org: string, repository: string) => {
  const response = await fetch(
    `https://api.github.com/repos/${org}/${repository}/actions/runs?per_page=10`,
    {
      method: 'GET',
      headers: {
        Authorization: `bearer ${GITHUB_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
    },
  );

  // Get the response as JSON
  return await response.json();
};

export default getRepositoryActions;
