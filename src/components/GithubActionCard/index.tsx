import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text, useTheme} from '@ui-kitten/components';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import Tag from 'components/Tag';

import styles from './index.style';

interface IGithubActionCard {
  icon: JSX.Element | null;
  title: string;
  description: string;
  label: string;
  author: string;
  branch: string;
  time: Date;
  onPress: () => void;
}

const GithubActionCard = ({
  icon,
  title,
  description,
  label,
  author,
  branch,
  time,
  onPress,
  ...props
}: IGithubActionCard) => {
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
            <Text category="c1">
              {description} by {author}
            </Text>
          </View>

          <View style={styles.footerContainer}>
            <Tag>{branch}</Tag>
            <Text category="c2">{formatDistanceToNow(time)} ago</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GithubActionCard;
