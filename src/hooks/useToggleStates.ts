import React from 'react';

const useToggleStates = (
  initialState: {[key: string]: boolean} = {},
  config: {single: boolean} = {single: false},
) => {
  const [checked, setChecked] = React.useState(initialState);
  const [allChecked, setAllChecked] = React.useState(false);

  const onCheckedChange = (key: string, isChecked: boolean) => {
    if (config.single) {
      const newValues = {};
      const keys = Object.keys(checked);

      keys.forEach(key => (newValues[key] = false));
      newValues[key] = isChecked;

      setChecked(newValues);
    } else {
      setChecked(prevState => ({
        ...prevState,
        [key]: isChecked,
      }));
    }
  };

  const toggleCheck = () => {
    Object.keys(checked).forEach(key => {
      onCheckedChange(key, !allChecked);
    });
  };

  React.useEffect(() => {
    console.log(
      checked,
      Object.values(checked),
      Object.values(checked).every(value => !!value),
    );
    setAllChecked(
      !!Object.values(checked).length &&
        Object.values(checked).every(value => !!value),
    );
  }, [checked]);

  return {checked, onChange: onCheckedChange, allChecked, toggleCheck};
};

export default useToggleStates;
