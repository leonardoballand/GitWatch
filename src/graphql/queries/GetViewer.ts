import {graphql} from 'react-relay';

const GetViewerQuery = graphql`
  query GetViewerQuery {
    viewer {
      id
      login
      name
      avatarUrl
      email
      location
      company
    }
  }
`;

export default GetViewerQuery;
