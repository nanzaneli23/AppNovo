import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function Busca() {
    const [clients, setClients] = useState([]);
    const [error, setError] = useState(false);
    const [edicao, setEdicao] = useState(false);
    const [clientId, setClientId] = useState(0);
    const [clientNome, setNome] = useState();
    const [clientEmail, setEmail] = useState();
    const [clientGenero, setGenero] = useState();
    const [deleteResposta, setResposta] = useState(false);

    async function getClients() {        
        await fetch('http://10.139.75.34:5251/api/Clients/GetAllClients', {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(json => setClients(json))
            .catch(err => setError(true))
    }


    async function getClient(id) {  
        await fetch('http://10.139.75.34:5251/api/Clients/GetClientId/' + id, {
            method: 'GET',
            headers: {
                'Content-type': 'aplication/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())           
            .then(json => {
                setClientId(json.clientId);
                setNome(json.clientName);
                setEmail(json.clientEmail);
                setGenero(json.clientGenere);
            });
    }
    async function editClient() {       
        await fetch('http://10.139.75.34:5251/api/Clients/UpdateClients/' + clientId, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                clientId: clientId,
                clientEmail:clientEmail,
                clientGenero: clientGenero,
                clientName: clientNome
            })
        })
        .then((response) => response.json())
        .catch(err => console.log(err));
        getClients();
        setEdicao(false);
    }

    function showAlert(id,clientName) {
      Alert.alert(
        '', 
        'Deseja realmente excluir esse cliente?',
        [
          { text: 'Sim', onPress: () => deleteClient(id, clientName)},
          { text: 'Não', onPress: () =>('')},
        ],
        { cancelable: false}
      );
    }

    async function deleteClient(id, clientName){
      await fetch('http://10.139.75.34:5251/api/Clients/DeleteClients/' + id, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .then(res => res.json())
      .then(json => setResposta(json))
      .catch(err => setError(true))

      if(deleteResposta == true)
        {
          Alert.alert(
            '',
            'Client' + clientName + 'excluido com sucesso',
            [
              { text: '', onPress: () => ('')},
              { text: 'Ok', onPress: () => ('')},
            ],
            { cancelable: false }
          );
          getClients();
        }
        else{
          Alert.alert(
            '',
            'Client' + clientName + 'não foi excluido.',
            [
              { text: '', onPress: () => ('')},
              { text: 'Ok', onPress: () => ('')},
            ],
            { cancelable: false }
          );
          getClients();
        }
    }

    useEffect(() => {
        getClients();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getClients();
        }, [])
    );

    return (
        <View style={css.container}>
            <StatusBar/>
            {edicao == false ?
                <FlatList
                    style={css.flat}
                    data={clients}
                    keyExtractor={(item) => item.ClientId}
                    renderItem={({ item }) => (
                        <View style={css.itemContainer}>
                            <Text style={css.text}>
                                {item.clientName}
                            </Text>
                            <TouchableOpacity style={css.btnEdit} onPress={() => { setEdicao(true); getClient(item.clientId) }}>
                                <Text style={css.btnText}>EDITAR</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={css.btnDelete} onPress={()=> showAlert(item.clientId, item.clientName)}>
                                <Text style={css.btnText}>EXCLUIR</Text> 
                            </TouchableOpacity>
                        </View>
                    )}
                />
                :
                <View style={css.editar}>
                    <TextInput
                        inputMode="text"
                        style={css.input}
                        value={clientNome}
                        onChangeText={(digitado) => setNome(digitado)}
                        placeholderTextColor="black"
                        placeholder='Nome'
                    />
                    <TextInput
                        inputMode="email"
                        style={css.input}
                        value={clientEmail}
                        onChangeText={(digitado) => setEmail(digitado)}
                        placeholderTextColor="black"
                        placeholder='E-mail'
                    />
                    <TextInput
                        inputMode="text"
                        secureTextEntry={true}
                        style={css.input}
                        value={clientGenero}
                        onChangeText={(digitado) => setGenero(digitado)}
                        placeholderTextColor="black"
                        placeholder='Genero'
                    />
                    <TouchableOpacity style={css.btnCreate} onPress={() => editClient()}>
                        <Text style={css.btnLoginText}>SALVAR</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

const css = StyleSheet.create({
    container: {
        width: "90%",
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        marginLeft: 20,
        elevation: 10,
        marginTop: 50
    },
    flat: {
        // Estilos da FlatList, se necessário
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    text: {
        // Estilos para o texto do item, se necessário
    },
    btnEdit: {
        backgroundColor: '#00008B',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    btnDelete: {
        backgroundColor: '#FF0000',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
    },
});