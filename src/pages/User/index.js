import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {RefreshControl} from 'react-native';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';
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
    loading: false,
  };

  async componentDidMount() {
    const {navigation} = this.props;
    const user = navigation.getParam('user');

    this.setState({loading: true});

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({stars: response.data, loading: false});
  }

  render() {
    const {navigation} = this.props;
    const {stars, loading} = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        <Stars
          data={stars}
          keyStractor={star => String(star.id)}
          renderItem={({item}) => (
            <Starred>
              <OwnerAvatar source={{uri: item.owner.avatar_url}} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
          refreshControl={<RefreshControl refreshing={loading} />}
        />
      </Container>
    );
  }
}
