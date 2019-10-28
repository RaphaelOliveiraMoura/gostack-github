import React, {Component} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';

// import { Container } from './styles';
import api from '../../services/api';

export default class User extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('user').name,
  });

  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
  };

  async componentDidMount() {
    const {navigation} = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({stars: response.data});
  }

  render() {
    const {stars} = this.state;
    return <View />;
  }
}
