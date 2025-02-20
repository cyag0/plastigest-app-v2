import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthContext } from "@/context/AuthContext";
import { Button, Icon, Snackbar, Text, TextInput } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInput from "@/components/FormComponents/FormInput";
import Spin from "@/components/Spin";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [animation] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { login } = useAuthContext();

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleSnackbar = () => setVisible(!visible);

  async function handleLogin(data: { email: string; password: string }) {
    try {
      setLoading(true);
      const res = await login(data);

      if (res?.data?.error) {
        setError("El email o la contraseña son incorrectos");
        setVisible(true);
      }
    } catch (error) {
      console.log(error);
      setError("Hubo un problema con el inicio de sesión. Inténtalo de nuevo.");
      setVisible(true);
    } finally {
      setLoading(false);
    }
  }

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <LinearGradient
      colors={[Colors.primary[500], "#CD1990"]}
      style={[styles.gradient, styles.container]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Snackbar
        visible={visible}
        style={{ backgroundColor: Colors.red[100] }}
        onDismiss={toggleSnackbar}
        duration={3000}
        action={{
          label: (
            <View style={{ alignItems: "center" }}>
              <Icon source={"close"} size={20} color={Colors.red[500]} />
            </View>
          ),
          onPress: () => setVisible(false),
        }}
      >
        <Text style={{ color: Colors.red[500] }}>{error}</Text>
      </Snackbar>
      <Animated.View
        style={[
          styles.loginContainer,
          { transform: [{ translateY }], minHeight: 250 },
        ]}
      >
        <Spin
          loading={loading}
          styles={{
            width: "100%",
            borderRadius: 20,
            padding: 20,
          }}
        >
          <View style={{ width: "100%", maxWidth: 500, gap: 8 }}>
            <Text variant="titleLarge" style={styles.title}>
              Bienvenido
            </Text>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email("El email no tiene un formato válido")
                  .required("El email es requerido"),
                password: Yup.string().required("La contraseña es requerida"),
              })}
              onSubmit={handleLogin}
            >
              {(props) => (
                <>
                  <FormInput
                    style={styles.input}
                    left={
                      <TextInput.Icon
                        color={
                          props.errors.email && props.touched.email
                            ? Colors.red[500]
                            : Colors.primary[400]
                        }
                        icon={"email"}
                      />
                    }
                    name="email"
                    placeholder="Ejemplo@gmail.com"
                    label="Email"
                    formProps={props}
                  />
                  <FormInput
                    style={styles.input}
                    left={
                      <TextInput.Icon
                        color={
                          props.errors.password && props.touched.password
                            ? Colors.red[500]
                            : Colors.primary[400]
                        }
                        icon={"lock"}
                      />
                    }
                    right={
                      <TextInput.Icon
                        icon={passwordVisible ? "eye" : "eye-off"}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                      />
                    }
                    name="password"
                    placeholder="********"
                    label="Contraseña"
                    secureTextEntry={!passwordVisible}
                    formProps={props}
                  />
                  <Button
                    loading={loading}
                    mode="contained"
                    style={styles.button}
                    onPress={props.handleSubmit}
                  >
                    <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                  </Button>
                </>
              )}
            </Formik>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
        </Spin>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginContainer: {
    width: "95%",
    maxWidth: 500,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    color: Colors.primary[800],
  },
  input: {
    width: "100%",
    marginTop: 8,
    borderColor: Colors.black[300],
    borderWidth: 1,
    borderRadius: 10,
  },
  button: {
    width: "100%",
    borderRadius: 10,
    marginTop: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPassword: {
    marginTop: 15,
  },
  forgotPasswordText: {
    color: "#4c669f",
    fontSize: 14,
  },
});
