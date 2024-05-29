import { Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert,  } from 'react-native'
import React, { useState } from 'react'


export default function Inserir() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [genero, setGenero] = useState('');
    const [error, setError] = useState(false);
    const [sucesso, setSucesso] = useState(false);
  

    async function Cadastro()
    {
        await fetch("http://10.139.75.34:5251/api/Clients/InsertClients/", {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify( {
               clientName:nome,
               clientEmail:email,
               clientGenere:genero
            })
          })
      
          .then(( res) => res.json(),setEmail(""),
          setGenero(""),
          setNome("") )
          .then( json => console.log(json))
          .catch(err => setError( true ) )
          
      
    }

    return (
        <ScrollView contentContainerStyle={css.container}>
            {sucesso ?
                <Text style={css.text}>Obrigado por se cadastrar. Seu cadastro foi realizado com sucesso!!</Text>
                :
            <>
          <Text style={css.text}>Inserir dados:</Text>
    <TextInput
    style={css.input}
    placeholder="Nome "
     value={nome}
     onChangeText={(digitado) => setNome( digitado)}
     />
     
     <TextInput
     style={css.input}
     placeholder="E-mail"
     value={email}
     onChangeText={(digitado) => setEmail( digitado)}
   />

<TextInput
     style={css.input}
     placeholder="Genere"
     value={genero}
     onChangeText={(digitado) => setGenero( digitado)}
   />
  
   
    
      
     
     
        <TouchableOpacity style={css.btn} onPress={()=> {Cadastro()
          Alert.alert("Cadastro realizado com sucesso!")
        }}>
            <Text style={css.btnText}>Cadastrar</Text>
        </TouchableOpacity>
        {error && <Text style={css.errorText}>Revise os campos. Tente Novamente </Text>}
        </>
        }
        </ScrollView>
    )
}

const css = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: "#E4E4E5"


    },
    input: {
        width: "90%",
        backgroundColor: "white",
        height: 60,
        borderRadius: 3,
        padding: 15,
        marginTop: 15,
        marginBottom: 10,
        borderWidth: 0,
        elevation: 60,

    },
    text: {
        fontSize: 24,
        marginBottom: 20,
        color: "black",
        marginTop: 10
    },
    btn: {
        width: "90%",
        height: 45,
        borderRadius: 5,
        backgroundColor: "#0A2351",
        marginTop: 10,
        
       
    },
    btnText: {
        lineHeight: 45,
        color: "white",
        textAlign: "center",
        fontSize: 20,
        elevation:90
    },
   
})