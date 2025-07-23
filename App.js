import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Button,
} from "react-native";
import { apiTCE } from "./src/services/api";

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [codeMunicipio, setCodeMunicipio] = useState("");
  const [error, setError] = useState(null);

  console.log(data, 'data')

  const fetchMunicipioData = () => {
    if (codeMunicipio) {
      setLoading(true);
      apiTCE
        .get(`/municipios?codigo_municipio=${codeMunicipio}`)
        .then(({data}) => {
          console.warn(data);

          setData(data.data);
        })
        .catch((error) => {
          console.log(`Erro ao buscar dados, erro: ${error}`);
        });
    }
  };

  useEffect(() => {
    if (codeMunicipio) {
      fetchMunicipioData();
    }
  }, [codeMunicipio]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite o código do município"
        keyboardType="numeric"
        value={codeMunicipio}
        onChangeText={setCodeMunicipio}
      />
      <Button title="Buscar Município" onPress={fetchMunicipioData} />

      {error && <Text style={styles.error}>{error}</Text>}

      {data.length === 0 ? (
        <Text>Sem dados para exibir</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.codigo_municipio.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.title}>{item.nome_municipio}</Text>
            </View>
          )}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: "100%",
  },
  item: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginVertical: 10,
  },
});
