import React from 'react';
import {WebView} from 'react-native-webview';
import PropTypes from 'prop-types';

export default function WebViewPage({navigation}) {
  const repository = navigation.getParam('repository');

  return (
    <>
      <WebView source={{uri: repository.html_url}} style={{flex: 1}} />
    </>
  );
}

WebViewPage.propTypes = {
  navigation: PropTypes.shape({getParam: PropTypes.func}).isRequired,
};

WebViewPage.navigationOptions = ({navigation}) => ({
  title: navigation.getParam('repository').name,
});
