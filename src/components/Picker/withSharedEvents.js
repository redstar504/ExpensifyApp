import React, {Component} from 'react';
import {pickerPropTypes, pickerDefaultProps} from './pickerPropTypes';

export default function (WrappedComponent) {
    class WithSharedEvents extends Component {
        constructor(props) {
            super(props);

            this.state = {
                isPickerHighlighted: false,
            };

            // Utilities used by both wrapped components
            this.callbackConsumer = this.callbackConsumer.bind(this);
            this.prepareDefaultProps = this.prepareDefaultProps.bind(this);

            // Events that can be applied to all platforms by default
            this.onOpen = this.onOpen.bind(this);
            this.onClose = this.onClose.bind(this);
            this.onFocus = this.onFocus.bind(this);
            this.onBlur = this.onBlur.bind(this);

            // Controls for the bottom border highlight of the picker
            this.activateHighlight = this.activateHighlight.bind(this);
            this.deactivateHighlight = this.deactivateHighlight.bind(this);
        }

        onOpen() {
            this.activateHighlight();
        }

        onClose() {
            this.deactivateHighlight();
        }

        onFocus() {
            this.activateHighlight();
        }

        onBlur() {
            this.deactivateHighlight();

            // We're exposing onBlur to consumers of the Picker component, so we provide it here
            this.props.onBlur();
        }

        /**
         * Consumers pass the `onInputChange` callback to notify them of changes
         * to the Picker, but to make it clearer what we're doing in the HOC
         * chain, we will redefine this as `callbackConsumer` here
         * @param {String} value
         * @param {Int} index
         */
        callbackConsumer(value, index) {
            if (this.props.inputID) {
                this.props.onInputChange(value);
                return;
            }

            this.props.onInputChange(value, index);
        }

        activateHighlight() {
            this.setState({
                isPickerHighlighted: true,
            });
        }

        deactivateHighlight() {
            this.setState({
                isPickerHighlighted: false,
            });
        }

        /**
         * These properties are declared as defaults, and can be overridden
         * as needed from within the platform specific entrypoint files.
         * @return {Object} defaultProps
         */
        prepareDefaultProps() {
            return {
                pickerProps: {
                    onValueChange: this.callbackConsumer,
                    onOpen: this.onOpen,
                    onClose: this.onClose,
                },
                nestedPickerProps: {
                    onFocus: this.onFocus,
                    onBlur: this.onBlur,
                },
                ...this.props,
                activateHighlight: this.activateHighlight,
                deactivateHighlight: this.deactivateHighlight,
                callbackConsumer: this.callbackConsumer,
            };
        }

        render() {
            const defaultProps = this.prepareDefaultProps();

            return (
                <WrappedComponent
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...defaultProps}
                    isHighlighted={this.state.isPickerHighlighted}
                    ref={this.props.forwardedRef}
                />
            );
        }
    }

    WithSharedEvents.propTypes = pickerPropTypes;
    WithSharedEvents.defaultProps = pickerDefaultProps;
    WithSharedEvents.displayName = 'WithSharedEvents';

    return React.forwardRef((props, ref) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <WithSharedEvents {...props} forwardedRef={ref} />
    ));
}
