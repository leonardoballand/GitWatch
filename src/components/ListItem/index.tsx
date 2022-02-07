import * as React from 'react';
import {ListItem as KListItem, Button, Icon} from '@ui-kitten/components';

type ID = string;

interface IListItem {
  id: ID;
  title: string;
  description?: string;
  label?: string;
  onPress: (arg0: any) => void;
  selected: boolean;
  data: any;
}

function ListItem({
  title,
  description = '',
  onPress = () => {},
  selected = false,
  data,
}: IListItem) {
  const onItemPress = () => {
    onPress(data);
  };

  const renderItemAccessory = props => (
    <Button onPress={onItemPress} size="tiny">
      {selected ? 'Remove' : 'Add'}
    </Button>
  );

  const renderItemIcon = props => (
    <Icon {...props} name={data?.isPrivate ? 'lock' : 'unlock'} />
  );

  return (
    <KListItem
      title={title}
      description={description}
      accessoryLeft={data ? renderItemIcon : undefined}
      accessoryRight={data ? renderItemAccessory : undefined}
      disabled={!data}
    />
  );
}

export default ListItem;
