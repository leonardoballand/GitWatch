import {graphql} from 'react-relay';

const GetReviewsQuery = graphql`
  query GetReviewsQuery($query: String!) {
    search(first: 100, type: ISSUE, query: $query) {
      issueCount
      edges {
        node {
          ... on PullRequest {
            number
            title
            isDraft
            createdAt
            mergedAt
            url
            changedFiles
            additions
            deletions
            body
            updatedAt
            reviewDecision

            reviewRequests(first: 100) {
              totalCount
              edges {
                node {
                  id
                  requestedReviewer {
                    ... on User {
                      id
                      avatarUrl
                    }
                  }
                }
              }
            }

            author {
              login
              avatarUrl
            }

            repository {
              name
              nameWithOwner
              owner {
                avatarUrl
              }
            }
          }
        }
      }
    }
  }
`;

export default GetReviewsQuery;
