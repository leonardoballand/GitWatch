import {graphql} from 'react-relay';

const createAppIssueMutation = graphql`
  mutation createAppIssueMutation($input: CreateIssueInput!) {
    createIssue(input: $input) {
      clientMutationId
      issue {
        url
      }
    }
  }
`;

export default createAppIssueMutation;
