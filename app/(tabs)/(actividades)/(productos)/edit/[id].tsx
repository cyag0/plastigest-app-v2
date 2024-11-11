import { View, Text } from "react-native";
import React from "react";
import CreateProduct from "../create";
import { useLocalSearchParams } from "expo-router";

const EditProduct = () => {
  const { id } = useLocalSearchParams();
  return id && <CreateProduct id={id} />;
};

export default EditProduct;
