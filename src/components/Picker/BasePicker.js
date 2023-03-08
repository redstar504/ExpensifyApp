import _ from 'underscore';
import React, {PureComponent} from 'react';
import {View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import PropTypes from 'prop-types';
import FormHelpMessage from '../FormHelpMessage';
import Text from '../Text';
import styles from '../../styles/styles';
import themeColors from '../../styles/themes/default';
import {ScrollContext} from '../ScrollViewWithContext';
import {pickerPropTypes, pickerDefaultProps} from './pickerPropTypes';

const propTypes = {
    /** Event handlers that may be passed to the outer <RNPickerSelect> component */
    pickerProps: PropTypes.shape({
        onValueChange: PropTypes.func.isRequired,
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
    }),

    /** Event handlers that may be passed to the nested <Picker> component */
    nestedPickerProps: PropTypes.shape({
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        onMouseDown: PropTypes.func,
        onChange: PropTypes.func,
    }),

    /** Whether the highlighted border of the Picker should be displayed */
    isHighlighted: PropTypes.bool.isRequired,

    ...pickerPropTypes,
};

const defaultProps = {
    pickerProps: {},
    nestedPickerProps: {},
    ...pickerDefaultProps,
};

class BasePicker extends PureComponent {
    constructor(props) {
        super(props);

        // Windows will reuse the text color of the select for each one of the options
        // so we might need to color accordingly so it doesn't blend with the background.
        this.placeholder = _.isEmpty(this.props.placeholder) ? {} : {
            ...this.props.placeholder,
            color: themeColors.pickerOptionsTextColor,
        };
    }

    componentDidMount() {
        this.setDefaultValue();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.items === this.props.items) {
            return;
        }
        this.setDefaultValue();
    }

    setDefaultValue() {
        // When there is only 1 element in the selector, we do the user a favor and automatically select it for them
        // so they don't have to spend extra time selecting the only possible value.
        if (this.props.value || !this.props.items || this.props.items.length !== 1 || !this.props.onInputChange) {
            return;
        }
        this.props.onInputChange(this.props.items[0].value, 0);
    }

    render() {
        const hasError = !_.isEmpty(this.props.errorText);
        const props = this.props;

        return (
            <>
                <View
                    style={[
                        styles.pickerContainer,
                        this.props.isDisabled && styles.inputDisabled,
                        ...this.props.containerStyles,
                        this.props.isHighlighted && styles.borderColorFocus,
                        hasError && styles.borderColorDanger,
                    ]}
                >
                    {this.props.label && (
                        <Text pointerEvents="none" style={[styles.pickerLabel, styles.textLabelSupporting]}>
                            {this.props.label}
                        </Text>
                    )}
                    <RNPickerSelect

                        // We add a text color to prevent white text on white background dropdown items on Windows
                        items={_.map(this.props.items, item => ({...item, color: themeColors.pickerOptionsTextColor}))}
                        style={this.props.size === 'normal'
                            ? styles.picker(this.props.isDisabled, this.props.backgroundColor)
                            : styles.pickerSmall(this.props.backgroundColor)}
                        useNativeAndroidPickerStyle={false}
                        placeholder={this.placeholder}
                        value={this.props.value}
                        Icon={() => this.props.icon(this.props.size)}
                        disabled={this.props.isDisabled}
                        fixAndroidTouchableBug
                        textInputProps={{allowFontScaling: false}}
                        pickerProps={props.nestedPickerProps}
                        ref={(el) => {
                            if (!_.isFunction(this.props.innerRef)) {
                                return;
                            }
                            this.props.innerRef(el);
                        }}
                        scrollViewRef={this.context && this.context.scrollViewRef}
                        scrollViewContentOffsetY={this.context && this.context.contentOffsetY}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...this.props.pickerProps}
                    />
                </View>
                <FormHelpMessage message={this.props.errorText} />
            </>
        );
    }
}

BasePicker.propTypes = propTypes;
BasePicker.defaultProps = defaultProps;
BasePicker.contextType = ScrollContext;

// eslint-disable-next-line react/jsx-props-no-spreading
export default React.forwardRef((props, ref) => <BasePicker {...props} innerRef={ref} key={props.inputID} />);
