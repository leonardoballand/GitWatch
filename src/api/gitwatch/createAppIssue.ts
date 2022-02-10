import {commitMutation} from 'react-relay';
import uniqueId from 'lodash/uniqueId';
import environment from 'graphql/environment';
import {createAppIssueMutation as CreateAppIssueMutationType} from 'graphql/__generated__/CreateAppIssueMutation.graphql';
import CreateAppIssueMutation from 'graphql/mutations/createAppIssue';

interface CreateAppIssueRequest {
  repositoryId: string;
  title: string;
  body: string;
  issueTemplate: string;
}

const createAppIssue = ({
  repositoryId,
  title,
  body,
  issueTemplate,
}: CreateAppIssueRequest): Promise<string> => {
  return new Promise((resolve, reject) => {
    commitMutation<CreateAppIssueMutationType>(environment, {
      mutation: CreateAppIssueMutation,
      variables: {
        input: {
          repositoryId,
          title,
          body,
          issueTemplate,
          clientMutationId: `mutation-createAppIssue-${uniqueId()}`,
        },
      },
      onError: reject,
      onCompleted: (res, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(res.createIssue?.issue?.url as string);
        }
      },
    });
  });
};

export default createAppIssue;
