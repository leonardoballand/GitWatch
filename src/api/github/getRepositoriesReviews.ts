import {fetchQuery} from 'react-relay';
import environment from 'graphql/environment';
import {GetReviewsQuery as GetReviewsQueryType} from 'graphql/__generated__/GetReviewsQuery.graphql';
import GetReviewsQuery from 'graphql/queries/GetReviews';
import {GQLPullRequest, GQLRepository} from 'graphql/schema';

const getRepositoriesReviews = async (
  repositories: GQLRepository[],
): Promise<GQLPullRequest[]> => {
  let repositoriesQuery = repositories
    .map(repository => `repo:${repository.nameWithOwner}`)
    .toString()
    .replace(/,/g, ' ');

  return new Promise((resolve, reject) => {
    fetchQuery<GetReviewsQueryType>(environment, GetReviewsQuery, {
      query: `is:open is:pr ${repositoriesQuery} archived:false draft:false`,
    }).subscribe({
      next: data => {
        resolve(data.search.edges?.map(edge => edge?.node) as GQLPullRequest[]);
      },
      error: (err: any) => reject(err),
    });
  });
};

export default getRepositoriesReviews;
