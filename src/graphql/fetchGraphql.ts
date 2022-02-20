import {getUserLocally} from '../hooks/useUserData';
import type {GitWatchUser} from 'types';

async function fetchGraphQL(text: string, variables: any) {
  const GITHUB_AUTH_TOKEN = await getUserLocally<GitWatchUser>('accessToken');

  // Fetch data from GitHub's GraphQL API:
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      // Accept: 'application/vnd.github.merge-info-preview+json',
      Authorization: `bearer ${GITHUB_AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: text,
      variables,
    }),
  });

  // Get the response as JSON
  const data = await response.json();

  return data;
}

export default fetchGraphQL;
