import {graphql} from 'react-relay';

const GetUserIssuesQuery = graphql`
  query GetUserIssuesQuery($query: String!) {
    search(first: 100, type: ISSUE, query: $query) {
      issueCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ... on Issue {
            createdAt
            title
            url

            repository {
              id
              name
              nameWithOwner
              owner {
                login
                avatarUrl
              }
              url
              isPrivate
            }
          }
        }
      }
    }
  }
`;

export default GetUserIssuesQuery;
