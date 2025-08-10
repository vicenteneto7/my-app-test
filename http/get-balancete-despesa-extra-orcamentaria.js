import { Parser } from 'htmlparser2';
import { apiTCE, apiTCEAtual } from '../src/services/api';

export async function getBalanceteDespesaExtraOrcamentariaAPIAntiga({
  codigo_municipio,
  exercicio_orcamento,
  data_referencia,
  codigo_orgao,
  codigo_unidade,
  codigo_conta_extraorcamentaria
}) {
  try {
    const params = {
      codigo_municipio,
      exercicio_orcamento,
      data_referencia,
      codigo_orgao,
      codigo_unidade,
      codigo_conta_extraorcamentaria
    };

    // Limpar parâmetros undefined
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    // Chamada da API
    const response = await apiTCE.get('/balancete_despesa_extra_orcamentaria', { params });
    const html = response?.data;

    if (!html || typeof html !== 'string') {
      throw new Error("A resposta da API não contém HTML válido.");
    }

    // Array para armazenar os dados extraídos
    const processedData = [];

    let currentData = {};  // Armazenar dados da linha atual

    // Criar o parser
    const parser = new Parser({
      onopentag(name, attributes) {
        // Filtra as tags <tr> com a classe 'balancete_despesa_extra_orcamentaria'
        if (name === 'tr' && attributes.class === 'balancete_despesa_extra_orcamentaria') {
          currentData = {};  // Inicia um objeto para armazenar os dados da linha
        }
      },
      ontext(text) {
        // Capture o conteúdo do texto das células <td>
        const trimmedText = text.trim();

        if (currentData && trimmedText) {
          // Associando os dados das células de forma sequencial
          const tdIndex = Object.keys(currentData).length;  // Pega a quantidade de dados já preenchidos

          switch (tdIndex) {
            case 0:
              currentData.codigo_municipio = trimmedText;
              break;
            case 1:
              currentData.exercicio_orcamento = trimmedText;
              break;
            case 2:
              currentData.codigo_orgao = trimmedText;
              break;
            case 3:
              currentData.codigo_unidade = trimmedText;
              break;
            case 4:
              currentData.codigo_conta_extraorcamentaria = trimmedText;
              break;
            case 5:
              currentData.data_referencia = trimmedText;
              break;
            case 6:
              currentData.tipo_balancete = trimmedText;
              break;
            case 7:
              currentData.valor_anulacao_no_mes = parseFloat(trimmedText) || 0;
              break;
            case 8:
              currentData.valor_anulacao_ate_mes = parseFloat(trimmedText) || 0;
              break;
            case 9:
              currentData.valor_pago_no_mes = parseFloat(trimmedText) || 0;
              break;
            case 10:
              currentData.valor_pago_ate_mes = parseFloat(trimmedText) || 0;
              break;
            default:
              break;
          }
        }
      },
      onclosetag(name) {
        // Quando a tag <tr> for fechada, adiciona a linha processada
        if (name === 'tr' && Object.keys(currentData).length > 0) {
          processedData.push(currentData);  // Adiciona os dados da linha ao array
          currentData = {};  // Reseta para a próxima linha
        }
      }
    });

    // Parsear o HTML
    parser.write(html);
    parser.end();

    // Retornar os dados processados
    return processedData;

  } catch (error) {
    console.error('Erro ao buscar balancete despesa extra orçamentária:', error);
    return [];
  }
}

export async function getBalanceteDespesaExtraOrcamentaria({
  codigo_municipio,
  exercicio_orcamento,
  data_referencia,
  codigo_orgao,
  codigo_unidade,
  codigo_conta_extraorcamentaria
}) {
  try {
    const params = {
      codigo_municipio,
      exercicio_orcamento,
      data_referencia,
    };

    // Limpar parâmetros undefined
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    // Verificando os parâmetros antes da requisição
    console.log('Parâmetros enviados para a API:', params);

    const response = await apiTCEAtual.get('/balancete_despesa_extra_orcamentaria', { params });

    // Verificando a resposta da API
    if (!response?.data?.data || response?.data?.data.length === 0) {
      console.warn('Sem dados disponíveis para os parâmetros fornecidos.');
    }

    console.log(response, 'responsekkkkkkkkk');

    return response?.data?.data || [];
  } catch (error) {
    console.error('Erro ao buscar balancete despesa extra orçamentária:', error);
    return [];
  }
}
