import {graphql} from 'react-relay';

const GetUserQuery = graphql`
  query GetUserQuery($login: String!) {
    user(login: $login) {
      id
      login
      name
      avatarUrl
    }
  }
`;

export default GetUserQuery;
