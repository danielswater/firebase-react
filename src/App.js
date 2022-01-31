import firebase from './firebaseConnection';
import { useState, useEffect } from 'react'

function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [posts, setPosts] = useState([])
  const [idPost, setIdPost] = useState('');

  useEffect(() => {
    async function loadPost() {
      await firebase.firestore().collection('posts')
        .onSnapshot((doc) => {
          let meusPosts = []
          doc.forEach((item) => {
            meusPosts.push({
              id: item.id,
              titulo: item.data().titulo,
              autor: item.data().autor
            })
          })

          setPosts(meusPosts)
        })
    }

    loadPost()
  }, [])

  async function handleAdd() {
    /*     await firebase.firestore().collection('posts')
          .doc('12345')
          .set({
            titulo: titulo,
            autor: autor
          })
          .then(() => {
            console.log('dados cadsatrados')
          })
          .catch((error) => {
            console.log('erro ', error)
          }) */

    // gerar id aleatorio
    await firebase.firestore().collection('posts')
      .add({
        titulo: titulo,
        autor: autor
      })
      .then(() => {
        console.log('dados cadastrados')
        setAutor('')
        setTitulo('')
      })
      .catch((error) => {
        console.log('erro ', error)
      })

  }

  async function buscarPost() {

    /*     await firebase.firestore().collection('posts')
          .doc('roDK0Foet27sWN2Q9Ddr')
          .get()
          .then((snapshot) => {
            setTitulo(snapshot.data().titulo)
            setAutor(snapshot.data().autor)
          })
          .catch((error) => {
            console.log('erro', error)
          }) */

    //montar lista

    await firebase.firestore().collection('posts')
      .get()
      .then((snapshot) => {
        let lista = []
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          })
        })

        setPosts(lista)

      })
      .catch((error) => {
        console.log('deu erro')
      })



  }

  async function editarPost() {
    await firebase.firestore().collection('posts')
      .doc(idPost)
      .update({
        titulo: titulo,
        autor: autor
      })
      .then(() => {
        console.log('DADOS ATUALIZADOS')
        setTitulo('')
        setAutor('')
        setIdPost('')
      })
      .catch((error) => {
        console.log('erro ao atualizar', error)
      })
  }

  async function excluirPost(id) {
    await firebase.firestore().collection('posts')
      .doc(id)
      .delete()
      .then(() => {
        alert('EXCLUIDO')
      })
      .catch((error) => {

      })
  }

  return (
    <div>
      <h1>REACT FIREBASE</h1>
      <br />
      <label>id</label>
      <input type="text" value={idPost} onChange={(e) => setIdPost(e.target.value)} />
      <br />
      <label>Titulo</label>
      <textarea type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      <br />
      <label>Autor</label>
      <input type="text" value={autor} onChange={(e) => setAutor(e.target.value)} /><br />

      <button onClick={handleAdd}>CADASTRAR</button><br />

      <button onClick={buscarPost}>BUSCAR</button><br />

      <button onClick={editarPost}>EDITAR</button><br />

      <br />
      <ul>
        {posts.map((item) => {
          return (
            <li key={item.id}>
              <span>ID: {item.id}</span><br />
              <span>Autor: {item.autor}</span><br />
              <span>titulo: {item.titulo}</span><br />
              <button onClick={() => excluirPost(item.id)}>EXCLUIR</button>
            </li>
          )
        })}
      </ul>
    </div>
  );
}

export default App;
