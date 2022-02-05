import {fetchQuery} from 'react-relay';
import environment from 'graphql/environment';
import {GetReviewsQuery as GetReviewsQueryType} from 'graphql/__generated__/GetReviewsQuery.graphql';
import GetReviewsQuery from 'graphql/queries/GetReviews';
import {GQLPullRequest} from 'graphql/schema';

const getUserPullRequests = (login: string): Promise<GQLPullRequest[]> => {
  return new Promise((resolve, reject) => {
    fetchQuery<GetReviewsQueryType>(environment, GetReviewsQuery, {
      query: `is:open is:pr author:${login} archived:false`,
    }).subscribe({
      next: data => {
        resolve(data.search.edges?.map(edge => edge?.node) as GQLPullRequest[]);
      },
      error: (err: any) => reject(err),
    });
  });
};

export default getUserPullRequests;
