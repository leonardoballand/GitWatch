const EVERHOUR_API_TOKEN = '954f-76a2-56ad7c-e312c0-d1fec928';

const getProject = async (projectId: string) => {
  const data = await fetch(`https://api.everhour.com/projects/${projectId}`, {
    headers: {
      'X-Api-Key': EVERHOUR_API_TOKEN,
    },
  });

  const results = await data.json();

  return results;
};

export default getProject;
