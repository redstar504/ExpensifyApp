import React from 'react';
import PropTypes from 'prop-types';
import {Text, View} from 'react-native';
import {Link, withRouter} from '../../lib/Router';
import STOREKEYS from '../../store/STOREKEYS';
import styles from '../../style/StyleSheet';
import WithStore from '../../components/WithStore';

const propTypes = {
    // The ID of the report for this link
    reportID: PropTypes.number.isRequired,

    // The name of the report to use as the text for this link
    reportName: PropTypes.string.isRequired,

    // These are from withRouter
    // eslint-disable-next-line react/forbid-prop-types
    match: PropTypes.object.isRequired,
};

class SidebarLink extends React.Component {
    render() {
        const paramsReportID = parseInt(this.props.match.params.reportID, 10);
        const isReportActive = paramsReportID === this.props.reportID;
        const linkWrapperActiveStyle = isReportActive && styles.sidebarLinkActive;
        const linkActiveStyle = isReportActive ? styles.sidebarLinkActiveAnchor : styles.sidebarLink;
        const textActiveStyle = isReportActive ? styles.sidebarLinkActiveText : styles.sidebarLinkText;
        return (
            <View style={linkWrapperActiveStyle}>
                <Link to={`/${this.props.reportID}`} style={linkActiveStyle}>
                    <View style={[styles.flexRow]}>
                        <Text style={[textActiveStyle, styles.flex1]}>{this.props.reportName}</Text>
                        {this.state && this.state.isUnread && (
                            <View style={styles.unreadBadge} />
                        )}
                    </View>
                </Link>
            </View>
        );
    }
}
SidebarLink.propTypes = propTypes;

export default withRouter(WithStore({
    isUnread: {
        // Bind to ONLY the report object, not the comments (that's why a $ is added at the end of the key name)
        key: `${STOREKEYS.REPORT}_%DATAFROMPROPS%$`,
        path: 'hasUnread',
        defaultValue: false,
        pathForProps: 'reportID',
    }
})(SidebarLink));
