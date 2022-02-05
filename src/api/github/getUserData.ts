import environment from 'graphql/environment';
import GetViewerQuery from 'graphql/queries/GetViewer';
import {fetchQuery} from 'react-relay';
import {GetViewerQuery as GetViewerQueryType} from 'graphql/__generated__/GetViewerQuery.graphql';
import {GQLUser} from 'graphql/schema';

const getUserData = (): Promise<GQLUser> => {
  return new Promise((resolve, reject) => {
    fetchQuery<GetViewerQueryType>(
      environment,
      GetViewerQuery,
      {},
      null,
    ).subscribe({
      next: data => {
        console.log('data', data);
        resolve(data.viewer as GQLUser);
      },
      error: (err: any) => reject(err),
    });
  });
};

export default getUserData;
