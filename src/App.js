import firebase from './firebaseConnection';
import { useState, useEffect } from 'react'

function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [posts, setPosts] = useState([])

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

  return (
    <div>
      <h1>REACT FIREBASE</h1>
      <br />
      <label>Titulo</label>
      <textarea type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      <br />
      <label>Autor</label>
      <input type="text" value={autor} onChange={(e) => setAutor(e.target.value)} /><br />

      <button onClick={handleAdd}>CADASTRAR</button><br />

      <button onClick={buscarPost}>BUSCAR</button>

      <br />
      <ul>
        {posts.map((item) => {
          return (
            <li key={item.id}>
              <span>Autor: {item.autor}</span><br />
              <span>titulo: {item.titulo}</span><br />

            </li>
          )
        })}
      </ul>
    </div>
  );
}

export default App;
