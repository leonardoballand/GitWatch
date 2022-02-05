import * as React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {fetchQuery} from 'react-relay';
import {Text, List} from '@ui-kitten/components';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/core';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import ListItem from 'components/ListItem';
import SearchBar from 'components/SearchBar';
import environment from 'graphql/environment';
import SearchRepositoriesQuery from 'graphql/queries/SearchRepositories';
import {GQLRepository} from 'graphql/schema';
import {SearchRepositoriesQuery as SearchRepositoriesQueryType} from 'graphql/__generated__/SearchRepositoriesQuery.graphql';
import {AppStackParamsList} from 'types';
import {BackIcon} from 'components/Icons';
import AppHeader from 'components/AppHeader';

import styles from './index.style';

interface IProps {
  data: any;
  error: any;
  loading: boolean;
  userRepositories: GQLRepository[];
}

const RepositoriesList = ({data, error, loading, userRepositories}: IProps) => {
  const isSelected = (id: string): boolean => {
    return !!userRepositories?.filter(
      userRepository => userRepository.id === id,
    ).length;
  };

  const onSelectItem = (selectedRepository: GQLRepository) => {
    console.log('onselectitem', selectedRepository);
    const userId = auth().currentUser?.uid;

    const repositoryExists = isSelected(selectedRepository.id);
    console.log('repositoryexists?', repositoryExists);
    if (repositoryExists) {
      console.log('remove repo user');
      // remove stored repository
      const updatedRepositories = userRepositories?.filter(
        userRepository => selectedRepository.id !== userRepository.id,
      );

      firestore()
        .collection('Repositories')
        .doc(userId)
        .update({repositories: updatedRepositories});
    } else {
      console.log('add repo user', [...userRepositories, selectedRepository]);
      // add selected repository
      firestore()
        .collection('Repositories')
        .doc(userId)
        .update({repositories: [...userRepositories, selectedRepository]});
    }
  };

  const renderItem = ({item}: {item: GQLRepository}) => {
    const {id, name, description} = item;

    console.log('renderItem', item);

    return (
      <ListItem
        id={id}
        title={name}
        description={description}
        onPress={onSelectItem}
        selected={isSelected(id)}
        data={item}
      />
    );
  };

  const renderListEmptyComponent = () => {
    if (error) {
      return <Text>{error}</Text>;
    }

    if (!loading) {
      return (
        <ListItem
          id="0"
          title="No repository"
          onPress={() => {}}
          data={{}}
          selected={false}
        />
      );
    }

    return null;
  };

  return (
    <List
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={data}
      extraData={data || userRepositories}
      renderItem={renderItem}
      ListEmptyComponent={renderListEmptyComponent}
      showsVerticalScrollIndicator={false}
    />
  );
};

type Props = NativeStackScreenProps<AppStackParamsList, 'Settings'>;

type NavigationProps = Props['navigation'];

function SelectRepositoryScreen() {
  const {goBack} = useNavigation<NavigationProps>();

  const [organization, setOrganization] = React.useState('');
  const [repositories, setRepositories] = React.useState<GQLRepository[]>([]);
  const [query, setQuery] = React.useState('');
  const [dataList, setDataList] = React.useState<GQLRepository[] | undefined>(
    [],
  );
  const [errorMsg, setErrorMsg] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const goToBack = () => goBack();

  /**
   * Set Organization
   * Get data from user database, first organization picked
   */
  const setUserOrganization = async () => {
    const userId = auth().currentUser?.uid;

    const organizations = await firestore()
      .collection('Organizations')
      .doc(userId)
      .get();

    const userOrganizations = organizations.data();

    setOrganization(userOrganizations?.organizations[0] ?? '');
  };

  /**
   * In charge to send the value
   * to the API.
   * @param {*} value
   */
  const sendQuery = async (value: string) => {
    setLoading(true);

    fetchQuery<SearchRepositoriesQueryType>(
      environment,
      SearchRepositoriesQuery,
      {
        search: `${organization}/${value}`,
        first: 10,
      },
      {
        fetchPolicy: 'store-or-network',
      },
    ).subscribe({
      next: data => {
        setErrorMsg('');
        setDataList(
          data.search.edges?.map(edge => edge?.node as GQLRepository),
        );
      },
      complete: () => setLoading(false),
      error: (error: any) => {
        setDataList([]);
        setErrorMsg(String(error));
      },
    });
  };

  /**
   * This will be called every time there is
   * a change in the input
   * @param {*} { target: { value } }
   */
  const onChange = (value: string) => {
    setQuery(value);
  };

  /**
   * Render header back button
   */
  const renderBackAction = () => {
    return (
      <TouchableOpacity onPress={goToBack}>
        <BackIcon />
      </TouchableOpacity>
    );
  };

  // On mount
  React.useEffect(() => {
    setUserOrganization();
    // setUserRepositories();
  }, []);

  // Init first query when organization has been set
  React.useEffect(() => {
    function sendInitialQuery() {
      if (organization) {
        sendQuery('');
      }
    }

    sendInitialQuery();
  }, [organization]);

  // Setup firestore listener for user repositories
  React.useEffect(() => {
    const userId = auth().currentUser?.uid;

    const subscriber = firestore()
      .collection('Repositories')
      .doc(userId)
      .onSnapshot(documentSnapshot => {
        console.log('documentsnapshot user repo', documentSnapshot.data);
        setRepositories(documentSnapshot.data()?.repositories);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  return (
    <>
      <AppHeader
        title="Select repository"
        level={4}
        accessoryLeft={renderBackAction}
      />

      <View style={{flex: 1, backgroundColor: 'white'}}>
        <SearchBar
          onChangeText={onChange}
          onEndEditing={text => sendQuery(text)}
          value={query}
          loading={loading}
          onPress={text => sendQuery(text)}
          disabled={loading}
          placeholder="Which repository are you looking for?"
          autoFocus
        />

        <RepositoriesList
          data={dataList}
          error={errorMsg}
          loading={loading}
          userRepositories={repositories}
        />
      </View>
    </>
  );
}

export default SelectRepositoryScreen;
