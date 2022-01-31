import firebase from './firebaseConnection';
import { useState } from 'react'

function App() {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cargo, setCargo] = useState('');
  const [nome, setNome] = useState('');

  const [user, setUser] = useState({});


  async function novoUsuario() {
    logout()
    await firebase.auth().createUserWithEmailAndPassword(email, senha)
      .then(async (value) => {

        firebase.firestore().collection('users')
          .doc(value.user.uid)
          .set({
            nome: nome,
            cargo: cargo,
            status: true
          })
          .then(() => {
            setNome('')
            setCargo('')
            setEmail('')
            setSenha('')
          })

      })
      .catch((error) => {
        setEmail('')
        setSenha('')
        if (error.code === 'auth/weak-password') {
          alert('senha fraca')
        }
        else if (error.code === 'auth/email-already-in-use') {
          alert('email ja cadastrado')
        }
      })
  }

  async function logout() {
    await firebase.auth().signOut()
    setUser({})
  }

  async function login() {
    await firebase.auth().signInWithEmailAndPassword(email, senha)
      .then(async (value) => {
        await firebase.firestore().collection('users')
          .doc(value.user.uid)
          .get()
          .then((snapshot) => {
            setUser({
              nome: snapshot.data().nome,
              cargo: snapshot.data().cargo,
              status: snapshot.data().status,
              email: value.user.email
            })
          })
      })
      .catch((error) => {
        console.log('erro ao logar', error)
      })
  }


  return (
    <div>

      <h1>REACT FIREBASE</h1>
      <br />




      <div >
        <h2>CADASTRAR</h2>

        <label>NOME</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} /><br />

        <label>CARGO</label>
        <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} /><br /><br /><br />

        <label>EMAIL</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        <label>SENHA</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} /><br /><br /><br />

        <button onClick={novoUsuario}>CADASTRAR</button><br />
        <button onClick={logout}>SAIR DA CONTA</button><br />
        <button onClick={login}>LOGIN</button>
      </div>

      <br />
      <br />
      <br />

      {Object.keys(user).length > 0 && (
        <div>
          <strong>OLÁ {user.nome}</strong><br />
          <strong>CARGO: {user.cargo}</strong><br />
          <strong>STATUS: {String(user.status ? 'ativo' : 'inativo')}</strong><br />
          <strong>EMAIL: {user.email}</strong><br />
        </div>
      )}

    </div>
  );
}

export default App;
