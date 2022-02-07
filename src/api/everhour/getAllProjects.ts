const EVERHOUR_API_TOKEN = '954f-76a2-56ad7c-e312c0-d1fec928';

const getAllProjects = async (
  query: string = '',
  limit: number = 10,
  organization: string = 'fulll',
) => {
  const data = await fetch(
    `https://api.everhour.com/projects?limit=${limit}&query=${query}&platform=gh`,
    {
      headers: {
        'X-Api-Key': EVERHOUR_API_TOKEN,
      },
    },
  );

  const results = await data.json();

  const filteredResults = results.filter(
    (result: any) => result.workspaceName === organization,
  );

  return filteredResults;
};

export default getAllProjects;
