// eslint-disable-next-line react-native/split-platform-components
import { ToastAndroid } from 'react-native';
import PropTypes from 'prop-types';

const ToastMessage = ({ visible, message }) => {
  if (visible) {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
    return null;
  }
  return null;
};

ToastMessage.defaultProps = {
  visible: false
};

ToastMessage.propTypes = {
  visible: PropTypes.bool,
  message: PropTypes.string
};

export { ToastMessage as default };
