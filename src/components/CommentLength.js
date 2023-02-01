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

const CommentLength = (props) => {
    const comment = props.comment;
    const [commentLength, setCommentLength] = useState(0);

    useEffect(() => {
        const encodedLength = ReportUtils.commentLength(comment);
        setCommentLength(encodedLength);
        props.onExceededCommentLength(encodedLength > CONST.MAX_COMMENT_LENGTH);
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

CommentLength.propTypes = propTypes;
CommentLength.displayName = 'CommentLength';

export default CommentLength;
