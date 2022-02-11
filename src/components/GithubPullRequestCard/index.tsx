import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Avatar, Text, useTheme} from '@ui-kitten/components';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import styles from './index.style';
import {GQLUser} from 'graphql/schema';

interface IGithubPullRequestCard {
  icon: JSX.Element | null;
  title: string;
  label: string;
  author: string;
  time: Date;
  reviewers: GQLUser[];
  onPress: () => void;
  isDraft: boolean;
}

const GithubPullRequestCard = ({
  icon,
  title,
  label,
  author,
  time,
  reviewers,
  onPress,
  isDraft = true,
  ...props
}: IGithubPullRequestCard) => {
  const theme = useTheme();

  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress} {...props}>
      <View
        style={{
          backgroundColor: theme['color-primary-100'],
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,
          position: 'absolute',
          right: 0,
          left: 0,
          top: 0,
          paddingVertical: 8,
          paddingHorizontal: 16,
          alignItems: 'flex-end',
        }}>
        <Text category="c1" status="primary">
          {label}
        </Text>
      </View>

      <View style={styles.container}>
        {icon}

        <View style={{flex: 1, marginLeft: 24}}>
          <View style={styles.headerTitleContainer}>
            <Text category="s1" style={styles.title}>
              {title}
            </Text>

            <View style={{flexDirection: 'row'}}>
              <Text category="c1">
                {isDraft ? 'Draft by' : 'Review requested by'}
              </Text>

              <Text style={{marginLeft: 4}} category="c2">
                {author}
              </Text>
            </View>
          </View>

          <View style={styles.footerContainer}>
            <View style={{flexDirection: 'row'}}>
              {reviewers.map(reviewer => (
                <Avatar
                  style={{marginHorizontal: 4}}
                  size="small"
                  source={{uri: reviewer?.avatarUrl}}
                />
              ))}
            </View>

            <Text category="c2">{formatDistanceToNow(time)} ago</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GithubPullRequestCard;
