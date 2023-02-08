import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';
import * as ReportUtils from '../libs/ReportUtils';
import Text from './Text';
import styles from '../styles/styles';
import CONST from '../CONST';

const propTypes = {
    /** Text Comment */
    comment: PropTypes.string.isRequired,

    /** Update UI on parent when comment length is exceeded */
    onExceededMaxCommentLength: PropTypes.func.isRequired,
};

class CommentLength extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            commentLength: 0,
        };

        this.updateCommentLength = debounce(this.updateCommentLength.bind(this), 500);
    }

    componentDidMount() {
        this.updateCommentLength();
    }

    componentDidUpdate() {
        this.updateCommentLength();
    }

    updateCommentLength() {
        const commentLength = ReportUtils.getCommentLength(this.props.comment);
        this.setState({commentLength});
        this.props.onExceededMaxCommentLength(commentLength > CONST.MAX_COMMENT_LENGTH);
    }

    render() {
        if (this.state.commentLength <= CONST.MAX_COMMENT_LENGTH) {
            return null;
        }

        return (
            <Text style={[styles.textMicro, styles.textDanger, styles.chatItemComposeSecondaryRow, styles.mlAuto, styles.pl2]}>
                {`${this.state.commentLength}/${CONST.MAX_COMMENT_LENGTH}`}
            </Text>
        );
    }
}

CommentLength.propTypes = propTypes;

export default CommentLength;
