import { https } from 'firebase-functions';
import axios from 'axios';

export const steamapi = https.onRequest(async (request, response) => {
  const req = await axios.request({
    method: 'get',
    url: `https://store.steampowered.com/api/appdetails?appids=${request.params[0].replace(
      /^.*steamapi\//,
      ''
    )}`,
    responseType: 'stream'
  });

  req.data.pipe(response);
});
