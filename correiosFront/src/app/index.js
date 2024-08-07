import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, Image, Pressable } from 'react-native';
import { supabase } from './supabase';
import { Link, useRouter } from 'expo-router';

const LoginForm = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!user || !password) {
      Alert.alert('Error', 'Preencha todos os campos');
      return;
    }

    const { data, error } = await supabase
      .from('login')
      .select('*')
      .eq('user', user)
      .eq('password', password);

    if (error) {
      Alert.alert('Error', 'Login falhou');
      console.error(error);
    } else if (data.length === 0) {
      Alert.alert('Error', 'Usuario ou senha invalidos');
    } else {
      Alert.alert('Login Bem-Sucedido!', `Bem Vindo ${data[0].user}`);
      setUser('');
      setPassword('');
      router.push('/home');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <Image source={require('./logoTrack.png')} style={styles.logo} />
        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 23, marginHorizontal: 10 }}>Package Tracker</Text>
      </View>
      <View style={styles.wrapper}>
        <Text style={styles.texts}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="User"
          value={user}
          onChangeText={setUser}
          keyboardType="default"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Pressable onPress={handleLogin}>
          <View style={styles.btnview}>
            <Text style={styles.textbtn}>Entrar</Text>
          </View>
        </Pressable>
        <Text style={{marginTop: '5%'}}>Novo por aqui?</Text>
        <Link style={{color: '#6e8ac3', textDecorationLine: 'underline', marginTop: '3%' }} href="/cadastro">Fazer registro</Link>
      </View>
      <Link href="/home" style={styles.semRegistro}>Entrar sem registro</Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ededed',
    justifyContent: 'space-between',
  },
  wrapper: {
    
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    
  },
  textbtn: {
    textAlign: 'center',
    backgroundColor: '#133258',
    borderRadius: 4,
    padding: 10,
    fontWeight: '500',
    borderColor: 'lightgray',
    borderWidth: 1,
    width: 200,
    color: '#fff',
    marginVertical: 5,
  },
  btnview: {
    alignItems: 'center',
  },
  texts: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    
  },
  input: {
    width: 300,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  navBar: {
    backgroundColor: "#133258",
    padding: 20,
    flexDirection: 'row',
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
  },
  semRegistro: {
    padding: 10,
    color: '#6e8ac3',
    textDecorationLine: 'underline',
    marginBottom: 20,
    alignSelf: 'center',
  },
});

export default LoginForm;
