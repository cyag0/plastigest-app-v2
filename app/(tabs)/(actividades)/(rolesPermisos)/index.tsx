import { View, Text } from "react-native";
import React from "react";

type Resource = {
  id: number;
  name: string;
  resource: string;
};

export default function index() {
  return (
    <View>
      <Text>index</Text>
    </View>
  );
}
