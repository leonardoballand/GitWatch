import {graphql} from 'react-relay';

const GetOrganizationMembersQuery = graphql`
  query GetOrganizationMembersQuery(
    $login: String!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    organization(login: $login) {
      membersWithRole(
        after: $after
        before: $before
        first: $first
        last: $last
      ) {
        edges {
          node {
            login
            avatarUrl
          }
          role
        }
        totalCount
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;

export default GetOrganizationMembersQuery;
