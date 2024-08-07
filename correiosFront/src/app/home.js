import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [rastreamentos, setRastreamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshingIndex, setRefreshingIndex] = useState(null);

  useEffect(() => {
    const loadRastreamentos = async () => {
      try {
        const savedRastreamentos = await AsyncStorage.getItem('rastreamentos');
        
        if (savedRastreamentos) {
          setRastreamentos(JSON.parse(savedRastreamentos));
        }
      } catch (error) {
        console.error('falha em encontrar rastreamentos', error);
      }
    };
    loadRastreamentos();
  }, []);

  useEffect(() => {
    const saveRastreamentos = async () => {
      try {
        await AsyncStorage.setItem('rastreamentos', JSON.stringify(rastreamentos));
      } catch (error) {
        console.error('Nao foi possivel salvar rastreamentos', error);
      }
    };
    saveRastreamentos();
  }, [rastreamentos]);

  const handleFetch = () => {
    setLoading(true);
    axios.get(`https://api.linketrack.com/track/json?user={{{{aqui vai seu token}}}}&codigo=${codigo}`)
      .then((response) => {
        const novoRastreamento = {
          codigo: codigo,
          nome: nome,
          status: response.data.eventos && response.data.eventos.length > 0 ? response.data.eventos[0].status : 'Sem status disponível',
          eventos: response.data.eventos || [],
          expanded: false,
        };
        setRastreamentos([novoRastreamento, ...rastreamentos]);
        setLoading(false);
        setCodigo('');
        setNome(''); 
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const refreshAllRastreamentos = async () => {
    setRefreshing(true);
    for (let i = 0; i < rastreamentos.length; i++) {
      setRefreshingIndex(i);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos antes de continuar
      axios.get(`https://api.linketrack.com/track/json?user=&codigo=${rastreamentos[i].codigo}`)
        .then((response) => {
          console.log(`Atualizado código: ${rastreamentos[i].codigo}, Novo status: ${response.data.eventos && response.data.eventos.length > 0 ? response.data.eventos[0].status : 'Sem status disponível'}`);
          setRastreamentos(prevRastreamentos => prevRastreamentos.map((rastreamento, index) => {
            if (index === i) {
              return {
                ...rastreamento,
                status: response.data.eventos && response.data.eventos.length > 0 ? response.data.eventos[0].status : 'Sem status disponível',
                eventos: response.data.eventos || [],
              };
            }
            return rastreamento;
          }));
        })
        .catch((error) => {
          console.error(error);
        });
    }
    setRefreshing(false);
    setRefreshingIndex(null);
  };

  const toggleExpand = (index) => {
    setRastreamentos(rastreamentos.map((item, i) => i === index ? { ...item, expanded: !item.expanded } : item));
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.navBar}>
        <Image source={require('./logoTrack.png')} style={styles.logo} />
        
        <Text style={styles.navText}>Package Tracker</Text>
      </View>

      <View style={styles.content}>

        <Text style={{fontSize: 25, fontWeight: 'bold', paddingBottom: 20}}>Rastrear Encomendas</Text>

        <TextInput
          style={styles.input}
          placeholder="Codigo de Rastreio"
          value={codigo}
          onChangeText={setCodigo}
        />
        <TextInput
          style={styles.input}
          placeholder="Nome da Encomenda (opcional)"
          value={nome}
          onChangeText={setNome}
        />
        <TouchableOpacity style={styles.button} onPress={handleFetch} disabled={loading}>
          <Text style={styles.buttonText}>Rastrear</Text>
        </TouchableOpacity>
      </View>

      {loading && <Text>Carregando...</Text>}

      <TouchableOpacity style={styles.button} onPress={refreshAllRastreamentos} disabled={refreshing}>
        <Text style={styles.buttonText}>Atualizar Todos</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {rastreamentos.map((rastreamento, index) => (
          <View key={index} style={styles.rastreamentoContainer}>
            <TouchableOpacity onPress={() => toggleExpand(index)}>
              <Text style={styles.rastreamentoNome}>Nome: {rastreamento.nome}</Text>
              <Text style={styles.rastreamentoCodigo}>Código: {rastreamento.codigo}</Text>
              <Text style={styles.rastreamentoStatus}>Último status: {rastreamento.status}</Text>
              {refreshing && refreshingIndex === index && <Text style={styles.refreshingText}>Atualizando...</Text>}
            </TouchableOpacity>
            {rastreamento.expanded && (
              <View style={styles.expandedContent}>
                <Text style={styles.eventTitle}>Histórico de Eventos:</Text>
                {rastreamento.eventos.map((evento, idx) => (
                  <View key={idx} style={styles.event}>
                    <Text style={styles.eventText}>Data: {evento.data}</Text>
                    <Text style={styles.eventText}>Status: {evento.status}</Text>
                    <Text style={styles.eventText}>Local: {evento.local}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
        <Text style={styles.credit}>Creditos: Link&Track API</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ededed',
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingTop: 80, 
  },
  content: {
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center', 
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  rastreamentoContainer: {
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    backgroundColor: '#ededed',
  },
  rastreamentoNome: {
    fontWeight: 'bold',
  },
  rastreamentoCodigo: {
    marginTop: 5,
  },
  rastreamentoStatus: {
    marginTop: 5,
  },
  refreshingText: {
    color: 'red',
    marginTop: 5,
  },
  expandedContent: {
    marginTop: 10,
  },
  eventTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  event: {
    marginBottom: 10,
  },
  eventText: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#133258',
    padding: 10,
    marginVertical: 8,
    alignItems: 'center',
    width: '100%', 
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  navBar: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: '#133258',
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  credit: {
    fontSize: 10,
    color: 'gray',
    textAlign: 'center',
    padding: 10,
  },
  navText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 23,
  },
});

export default App;
