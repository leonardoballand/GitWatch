import {fetchQuery} from 'react-relay';
import environment from 'graphql/environment';
import {GetAppIssueTemplatesQuery as GetAppIssueTemplatesQueryType} from 'graphql/__generated__/GetAppIssueTemplatesQuery.graphql';
import {GQLIssueTemplate} from 'graphql/schema';
import GetAppIssueTemplatesQuery from 'graphql/queries/GetAppIssueTemplates';

const getAppIssueTemplates = (
  repository: string,
): Promise<{id: string; issueTemplates: GQLIssueTemplate[]}> => {
  return new Promise((resolve, reject) => {
    fetchQuery<GetAppIssueTemplatesQueryType>(
      environment,
      GetAppIssueTemplatesQuery,
      {
        repository,
      },
    ).subscribe({
      next: data => {
        if (data.search.repositoryCount) {
          resolve({
            id: data.search.edges[0]?.node?.id ?? '',
            issueTemplates: data.search.edges[0].node.issueTemplates ?? [],
          });
        } else {
          reject();
        }
      },
      error: (err: any) => reject(err),
    });
  });
};

export default getAppIssueTemplates;
