import React from 'react';
import BasePicker from './BasePicker';
import withSharedEvents from './withSharedEvents';

// eslint-disable-next-line react/jsx-props-no-spreading
const Picker = React.forwardRef((props, ref) => <BasePicker {...props} innerRef={ref} />);

Picker.displayName = 'Picker';

export default withSharedEvents(Picker);
