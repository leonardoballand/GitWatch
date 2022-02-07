import {fetchQuery} from 'react-relay';
import environment from 'graphql/environment';
import GetUserIssuesQuery from 'graphql/queries/GetUserIssues';
import {GetUserIssuesQuery as GetUserIssuesQueryType} from 'graphql/__generated__/GetUserIssuesQuery.graphql';
import {GQLIssue} from 'graphql/schema';

const getUserIssues = (login: string): Promise<GQLIssue[]> => {
  return new Promise((resolve, reject) => {
    fetchQuery<GetUserIssuesQueryType>(environment, GetUserIssuesQuery, {
      query: `is:open is:issue assignee:${login} archived:false`,
    }).subscribe({
      next: data => {
        resolve(
          data.search.issueCount > 0
            ? (data.search.edges?.map(edge => edge?.node) as GQLIssue[])
            : [],
        );
      },
      error: (err: any) => reject(err),
    });
  });
};

export default getUserIssues;
