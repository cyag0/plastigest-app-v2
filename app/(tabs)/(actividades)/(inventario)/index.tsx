import { View, Text, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const index = () => {
  const navigator = useRouter();
  return (
    <View>
      <Pressable
        onPress={() => {
          navigator.push("show");
        }}
      >
        <Text>Show</Text>
      </Pressable>

      <Pressable
        onPress={() => {
          navigator.push("create");
        }}
      >
        <Text>Crear</Text>
      </Pressable>
    </View>
  );
};

export default index;
