import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, Image, Pressable } from 'react-native';
import { supabase } from './supabase';
import { Link, useRouter } from 'expo-router';

const RegisterForm = () => {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(password);
  };

  const handleRegister = async () => {
    if (!user || !email || !password) {
      Alert.alert('Error', 'Preencha todos os campos.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Insira um email valido');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert('Error', 'A senha deve ter mais de 8 caracteres, ao menos um caracter maiusculo e ao menos 1 numero.');
      return;
    }

    const { error } = await supabase
      .from('login')
      .insert([{ user, email, password }]);

    if (error) {
      Alert.alert('Error', 'Registro Falhou');
      console.error(error);
    } else {
      Alert.alert('Registro concluido!', `Bem vindo ${user}`);
      setUser('');
      setEmail('');
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
        <View >
          <View style={{ alignItems:'center' }}>

            <Text style={styles.texts}>Criar Conta</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="User"
            value={user}
            onChangeText={setUser}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <Pressable onPress={handleRegister}>
          <View style={styles.btnview}>
            <Text style={styles.textbtn}>Register</Text>
          </View>
        </Pressable>
        

        <Text style={{marginTop: '5%'}}>Já tem conta?</Text>
        
        <Link style={{color: '#6e8ac3', textDecorationLine: 'underline', marginTop: '3%' }} href="/">Fazer Login</Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ededed',
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
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  texts: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  btnview: {
    alignItems: 'center',
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
});

export default RegisterForm;

