import {format} from 'date-fns';
import parseISO from 'date-fns/parseISO';

const EVERHOUR_API_TOKEN = '954f-76a2-56ad7c-e312c0-d1fec928';

const startTimer = async (taskId: string) => {
  const data = await fetch('https://api.everhour.com/timers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': EVERHOUR_API_TOKEN,
    },
    body: JSON.stringify({
      task: taskId,
      userDate: format(parseISO(new Date().toISOString()), 'yyyy-mm-dd'),
    }),
  });

  const results = await data.json();

  return results;
};

export default startTimer;
