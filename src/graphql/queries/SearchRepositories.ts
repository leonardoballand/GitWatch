import {graphql} from 'react-relay';

const SearchRepositoriesQuery = graphql`
  query SearchRepositoriesQuery($search: String!, $first: Int) {
    search(query: $search, type: REPOSITORY, first: $first) {
      edges {
        node {
          ... on Repository {
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
`;

export default SearchRepositoriesQuery;
