import React from 'react';
import {SafeAreaView, Text} from 'react-native';

import './config/ReactotronConfig';

export default function App() {
  console.tron.log('Hello console');

  return (
    <>
      <SafeAreaView>
        <Text>Hello World</Text>
      </SafeAreaView>
    </>
  );
}
