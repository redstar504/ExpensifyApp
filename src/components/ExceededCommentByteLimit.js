import React from 'react';
import PropTypes from 'prop-types';
import CONST from '../CONST';
import Text from './Text';
import styles from '../styles/styles';

const propTypes = {
    /** The current byte size of the comment */
    byteCount: PropTypes.number.isRequired,
};

const ExceededCommentByteLimit = (props) => {
    if (props.byteCount <= CONST.BYTE_LIMIT) {
        return null;
    }

    return (
        <Text style={[styles.textMicro, styles.textDanger, styles.chatItemComposeSecondaryRow, styles.mlAuto, styles.pl2]}>
            {`${props.byteCount} bytes/${CONST.BYTE_LIMIT} bytes`}
        </Text>
    );
};

ExceededCommentByteLimit.propTypes = propTypes;
ExceededCommentByteLimit.displayName = 'ExceededByteLimit';

export default ExceededCommentByteLimit;
