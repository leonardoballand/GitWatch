import {graphql} from 'react-relay';

const GetAppIssueTemplatesQuery = graphql`
  query GetAppIssueTemplatesQuery($repository: String!) {
    search(query: $repository, type: REPOSITORY, first: 1) {
      repositoryCount

      edges {
        node {
          ... on Repository {
            id
            issueTemplates {
              about
              name
              body
              title
            }
          }
        }
      }
    }
  }
`;

export default GetAppIssueTemplatesQuery;
