import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import {
  getBalanceteDespesaExtraOrcamentaria,
  getBalanceteDespesaExtraOrcamentariaAPIAntiga,
} from "./http/get-balancete-despesa-extra-orcamentaria";

export default function App() {
  const [dataNovaAPI, setDataNovaAPI] = useState([]);
  const [dataAntigaAPI, setDataAntigaAPI] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para cada campo necessário na requisição
  const [codigoMunicipio, setCodigoMunicipio] = useState("");
  const [exercicioOrcamento, setExercicioOrcamento] = useState("");
  const [dataReferencia, setDataReferencia] = useState("");
  const [codigoOrgao, setCodigoOrgao] = useState("");
  const [codigoUnidade, setCodigoUnidade] = useState("");
  const [codigoContaExtraorcamentaria, setCodigoContaExtraorcamentaria] = useState("");

  // Função para buscar os dados das duas APIs e mostrar os resultados separadamente
  const handleFetchData = async () => {
    setLoading(true);
    setError(null);

    const params = {
      codigo_municipio: codigoMunicipio,
      exercicio_orcamento: exercicioOrcamento,
      data_referencia: dataReferencia,
      codigo_orgao: codigoOrgao,
      codigo_unidade: codigoUnidade,
      codigo_conta_extraorcamentaria: codigoContaExtraorcamentaria,
    };

    try {
      // Chama ambas as APIs separadamente
      const [resultNovaAPI, resultAntigaAPI] = await Promise.all([
        getBalanceteDespesaExtraOrcamentaria(params),
        getBalanceteDespesaExtraOrcamentariaAPIAntiga(params),
      ]);

      console.log(resultNovaAPI, 'resultNovaAPI')

      // Armazena os resultados das APIs separadamente
      setDataNovaAPI(resultNovaAPI);
      setDataAntigaAPI(resultAntigaAPI);
    } catch (err) {
      setError("Erro ao buscar dados.");
    } finally {
      setLoading(false);
    }
  };

  const dataNovaAPIFiltered = dataNovaAPI.filter((itemData) => itemData.codigo_orgao != '01');
  const dataAntigaAPIFiltered = dataAntigaAPI.filter((itemData) => itemData.codigo_orgao != '01');

  // Cálculo do total do valor_pago_no_mes para ambas as APIs


  const totalPagoNoMesNovaAPI = dataNovaAPIFiltered.reduce(
    (soma, item) => soma + Number(item.valor_pago_no_mes),
    0
  );

  const totalPagoNoMesAntigaAPI = dataAntigaAPIFiltered.reduce((total, item) => {
    return total + parseFloat(item.valor_pago_no_mes || 0);
  }, 0);

  // Cálculo do total anulado no mês para ambas as APIs


  const totalAnuladoNoMesNovaAPI = dataNovaAPIFiltered.reduce(
    (soma, item) => soma + Number(item.valor_anulacao_no_mes),
    0
  );

  const totalAnuladoNoMesAntigaAPI = dataAntigaAPIFiltered.reduce((total, item) => {
    return total + parseFloat(item.valor_anulacao_no_mes || 0);
  }, 0);

  console.log(totalPagoNoMesNovaAPI, 'Nova API');
  console.log(totalPagoNoMesAntigaAPI, 'Antiga API');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Código Município"
        keyboardType="numeric"
        value={codigoMunicipio}
        onChangeText={setCodigoMunicipio}
      />
      <TextInput
        style={styles.input}
        placeholder="Exercício Orçamento"
        keyboardType="numeric"
        value={exercicioOrcamento}
        onChangeText={setExercicioOrcamento}
      />
      <TextInput
        style={styles.input}
        placeholder="Data Referência (YYYY-MM-DD)"
        value={dataReferencia}
        onChangeText={setDataReferencia}
      />
      <TextInput
        style={styles.input}
        placeholder="Código Órgão"
        keyboardType="numeric"
        value={codigoOrgao}
        onChangeText={setCodigoOrgao}
      />
      <TextInput
        style={styles.input}
        placeholder="Código Unidade"
        keyboardType="numeric"
        value={codigoUnidade}
        onChangeText={setCodigoUnidade}
      />
      <TextInput
        style={styles.input}
        placeholder="Código Conta Extraorçamentária"
        keyboardType="numeric"
        value={codigoContaExtraorcamentaria}
        onChangeText={setCodigoContaExtraorcamentaria}
      />

      <Button title="Buscar Balancete" onPress={handleFetchData} />

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <>
          <Text style={styles.total}>
            Total Pago no Mês (Nova API): {(totalPagoNoMesNovaAPI - totalAnuladoNoMesNovaAPI).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>


          <Text style={styles.total}>
            Total Pago no Mês (Antiga API): {(totalPagoNoMesAntigaAPI - totalAnuladoNoMesAntigaAPI).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>


        </>
      )}
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    marginTop: 80,
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
  total: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#333",
  },
});
