const EVERHOUR_API_TOKEN = '954f-76a2-56ad7c-e312c0-d1fec928';

const stopTimer = async () => {
  const data = await fetch('https://api.everhour.com/timers/current', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': EVERHOUR_API_TOKEN,
    },
  });

  const results = await data.json();

  return results;
};

export default stopTimer;
