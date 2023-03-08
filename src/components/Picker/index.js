import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BasePicker from './BasePicker';
import withSharedEvents from './withSharedEvents';
import {pickerPropTypes, pickerDefaultProps} from './pickerPropTypes';

const propTypes = {
    /** Callback for activating the bottom border highlight */
    activateHighlight: PropTypes.func.isRequired,

    /** Callback for deactivating the bottom border highlight */
    deactivateHighlight: PropTypes.func.isRequired,

    /** Callback the consumer of the Picker when the selection has changed */
    callbackConsumer: PropTypes.func.isRequired,

    ...pickerPropTypes,
};

/**
 * The HOC wrapped entrypoint to the Picker for web browsers
 */
class Picker extends Component {
    constructor(props) {
        super(props);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onChange = this.onChange.bind(this);
        this.pickerRef = React.createRef();
    }

    /**
     * We use `onMouseDown` instead of `onChange` due to the order browser
     * events are called in. `onMouseDown` is called after `onChange`,
     * and `onClick` gets called before.
     *
     * Since selecting an <option> counts as a mouse click, we want `onChange`
     * to fire after the click, so we can effectively disable the highlight when
     * an option is selected.
     */
    onMouseDown() {
        this.props.activateHighlight();
    }

    /**
     * We specify `onChange` for web and use DOM events to capture the selected
     * option. We then deactivate the highlight, and start the callback chain to
     * the consumer of the Picker.
     *
     * When an `onChange` handler is passed to the nested Picker on web, it gets
     * called instead of the `onValueChange` prop passed to the PickerSelect wrapper.
     * This is because `onValueChange` effectively uses `onChange` itself, but
     * our explicit definition takes precedence.
     * @param {Object} event - The event emitted by the onChange handler
     */
    onChange(event) {
        if (event.target.selectedIndex === undefined) {
            return;
        }
        const index = event.target.selectedIndex;
        const value = event.target.options[index].value;
        this.props.callbackConsumer(value, index);
        this.props.deactivateHighlight();
    }

    /**
     * We extend the default props provided by the `withSharedEvents` HOC by specifying
     * platform-specific props for web, and merge them with the props passed by the HOC,
     * allowing us to override the Picker's behavior on the web platform.
     * @return {Object} webProps
     */
    prepareWebProps() {
        return {
            pickerProps: {
                ...this.props.pickerProps,

                /**
                 * We can pass an empty function here since it is not used when the
                 * onChange prop is provided to the nested picker, as supplied below.
                 */
                onValueChange: () => {},
            },
            nestedPickerProps: {
                ...this.props.nestedPickerProps,
                onMouseDown: this.onMouseDown,
                onChange: this.onChange,
            },
        };
    }

    render() {
        const webProps = this.prepareWebProps();

        return (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <BasePicker {...this.props} {...webProps} innerRef={this.pickerRef} />
        );
    }
}

Picker.propTypes = propTypes;
Picker.defaultProps = pickerDefaultProps;

export default withSharedEvents(
    // eslint-disable-next-line react/jsx-props-no-spreading
    React.forwardRef((props, ref) => <Picker {...props} innerRef={ref} />),
);
