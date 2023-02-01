import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import CONST from '../CONST';
import Text from './Text';
import styles from '../styles/styles';
import * as ReportUtils from '../libs/ReportUtils';

const propTypes = {
    comment: PropTypes.string.isRequired,
    onExceededCommentLength: PropTypes.func.isRequired,
};

// Count comments unencoded until this many characters
const COUNT_NORMALLY_UNTIL = 2500;

// After character length above is hit, wait this long after a break in typing before calculating encoded length
const PHASED_KEYUP_DELAY = 500; // ms

// When the encoded comment limit is nearly hit, start counting it in real-time so the counter updates rapidly
const START_REALTIME_AT = CONST.MAX_COMMENT_LENGTH - 64;

const ExceededCommentLength = (props) => {
    const comment = props.comment;
    const [commentLength, setCommentLength] = useState(0);

    useEffect(() => {
        const unencodedCommentLength = comment.length;
        if (unencodedCommentLength <= COUNT_NORMALLY_UNTIL) {
            setCommentLength(unencodedCommentLength);
        } else {
            const keyupTimer = setTimeout(() => {
                const encodedHtmlLength = ReportUtils.commentLength(comment);
                setCommentLength(encodedHtmlLength);
                props.onExceededCommentLength(encodedHtmlLength > CONST.MAX_COMMENT_LENGTH);
            }, START_REALTIME_AT >= commentLength ? PHASED_KEYUP_DELAY : 0);
            return () => clearTimeout(keyupTimer);
        }
    }, [comment]);

    if (commentLength <= CONST.MAX_COMMENT_LENGTH) {
        return null;
    }

    return (
        <Text style={[styles.textMicro, styles.textDanger, styles.chatItemComposeSecondaryRow, styles.mlAuto, styles.pl2]}>
            {`${commentLength}/${CONST.MAX_COMMENT_LENGTH}`}
        </Text>
    );
};

ExceededCommentLength.propTypes = propTypes;
ExceededCommentLength.displayName = 'CommentLength';

export default ExceededCommentLength;
