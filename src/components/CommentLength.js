import React, {useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import CONST from '../CONST';
import Text from './Text';
import styles from '../styles/styles';
import * as ReportUtils from '../libs/ReportUtils';

const propTypes = {
    /** The unencoded text comment */
    comment: PropTypes.string.isRequired,

    /** Update the parent UI to reflect length warnings in the composer */
    onExceededMaxCommentLength: PropTypes.func.isRequired,
};

const CommentLength = (props) => {
    const comment = props.comment;
    const commentLength = useMemo(() => ReportUtils.commentLength(comment), [comment]);
    const hasExceededMaxCommentLength = commentLength > CONST.MAX_COMMENT_LENGTH;

    useEffect(() => {
        props.onExceededMaxCommentLength(hasExceededMaxCommentLength);
    }, [commentLength]);

    if (!hasExceededMaxCommentLength) {
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
