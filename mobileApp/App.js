// import React, {Component} from 'react';
// import {View, Text} from 'react-native';

// export default class App extends Component {
//   render() {
//     return (
//       <View>
//         <Text>Welcome to Computer Science Tutorials</Text>
//       </View>
//     );
//   }
// }

import React from "react";
import Navigators from "./src/navigators";
import {Store} from "./src/Store";
import {Provider} from "react-redux";

export default () => (
  <Provider store={Store}>
    <Navigators />
  </Provider>
);
