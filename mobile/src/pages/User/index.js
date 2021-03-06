import React, {Component} from 'react';
import {TouchableHighlight} from 'react-native';
import PropTypes from 'prop-types';

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
      navigate: PropTypes.func,
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    page: 1,
    loading: false,
    refreshing: false,
  };

  async componentDidMount() {
    const {navigation} = this.props;
    const user = navigation.getParam('user');
    const {page} = this.state;

    this.setState({loading: true});

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {page},
    });

    this.setState({stars: response.data, loading: false});
  }

  loadMore = async () => {
    const {navigation} = this.props;
    const user = navigation.getParam('user');
    const {stars, page} = this.state;

    this.setState({loading: true});

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {page: Number(page) + 1},
    });

    this.setState({
      stars: [...stars, ...response.data],
      page: Number(page) + 1,
      loading: false,
    });
  };

  refreshList = async () => {
    const {navigation} = this.props;
    const user = navigation.getParam('user');

    this.setState({loading: true});

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {page: 1},
    });

    this.setState({
      stars: response.data,
      page: 1,
      loading: false,
    });
  };

  render() {
    const {navigation} = this.props;
    const {stars, loading, refreshing} = this.state;

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
          keyExtractor={star => String(star.id)}
          renderItem={({item}) => (
            <TouchableHighlight
              onPress={() =>
                navigation.navigate('WebViewPage', {repository: item})
              }>
              <Starred>
                <OwnerAvatar source={{uri: item.owner.avatar_url}} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            </TouchableHighlight>
          )}
          refreshing={loading || refreshing}
          onRefresh={this.refreshList}
          onEndReachedThreshold={0.2}
          onEndReached={this.loadMore}
        />
      </Container>
    );
  }
}
