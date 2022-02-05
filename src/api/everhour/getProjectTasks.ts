const EVERHOUR_API_TOKEN = '954f-76a2-56ad7c-e312c0-d1fec928';

const getProjectTasks = async (
  projectId: string,
  page: number = 1,
  limit: number = 10,
  excludeClosed: boolean = false,
  query: string = '',
) => {
  const data = await fetch(
    `https://api.everhour.com/projects/${projectId}/tasks?page=${page}&limit=${limit}&excludeClosed=${excludeClosed}&query=${query}`,
    {
      headers: {
        'X-Api-Key': EVERHOUR_API_TOKEN,
      },
    },
  );

  const results = await data.json();

  console.log('results', results);
  return results;
};

export default getProjectTasks;
