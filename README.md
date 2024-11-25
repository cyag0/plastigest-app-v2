# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```


# Crear crud simple

- en services crear una carpeta y poner lo siguiente

```bash

import Crud from "../crud";
export default { ...Crud<App.Entities.Supplier>("tabla_nombre") };

```

Despues tienes que hacer lo siguiente:

- Crear la ruta app/(tabs)/(actividades)/(reemplazar_por_nombre)
- usar el componente ProTable hay un ejemplo en app/(tabs)/(actividades)(proveedores)
- completar los siguientes props, api, columns e inputs

## Props

### Inputs
* usar el FormInput para los campos de texto y el componente Select

Ejemplo

```bash
   inputs={(props) => {
        return (
          <>
            <FormInput
              formProps={props}
              name="name"
              label="Nombre"
              placeholder="Botella, Tapadera, etc."
            />
            <FormInput
              formProps={props}
              name="address"
              label="Direccion"
              placeholder="Numero de telefono, correo, etc.."
            />

            <FormInput
              formProps={props}
              name="phone"
              label="Numero"
              placeholder="Numero de telefono, correo, etc.."
            />
          </>
        );
      }}

```

#### FormInput Props
* __formProps__: tienes que pasarle la variable que se recive de la funcion como en el ejemplo (props)
* __name__: este campo tiene que ser identico a la columna en la base de datos
* __label__: La etiqueta que se muestra para identificar el campo
* __placeholder__: una pequena descripcion de lo que se pone en el campo

#### Select Props

