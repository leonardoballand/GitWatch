import {Environment, Network, RecordSource, Store} from 'relay-runtime';

import fetchGraphQL from './fetchGraphql';

// Relay passes a "params" object with the query name and text. So we define a helper function
// to call our fetchGraphQL utility with params.text.
async function fetchRelay(params: any, variables: any) {
  return fetchGraphQL(params.text, variables);
}

// Export a singleton instance of Relay Environment configured with our network function:
export default new Environment({
  network: Network.create((params, variables) => fetchRelay(params, variables)),
  store: new Store(new RecordSource()),
});
