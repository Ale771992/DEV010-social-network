import { createPostProgrammingWall, exit, qFn, deletePost, editPost } from '../FirebaseFn.js'
import { auth } from '../FirebaseConfig.js'
// (onSnapshot)Función de Firebase permite escuchar cambios en tiempo real de una coleccion de firebase
import { onSnapshot } from 'firebase/firestore'
function programmingWall (navigateTo) {
  const section = document.createElement('section')
  section.classList.add('sectionPost')
  // TITULO
  const title = document.createElement('h1')
  title.textContent = 'Zona de programación'
  title.classList.add('titlePost')
  // LABEL
  const labelPost = document.createElement('label')
  labelPost.textContent = 'Escribe tu pregunta de programación'
  // TEXT AREA
  const textAreaPost = document.createElement('textarea')
  textAreaPost.classList.add('textAreaPost')
  textAreaPost.rows = '10'
  textAreaPost.cols = '10'
  textAreaPost.id = 'textAreaPost'
  // DIV POST CONTENT
  const divPostContent = document.createElement('div')
  divPostContent.classList.add('divPostContent')
  divPostContent.id = 'idPostContent'
  // BOTON POSTEAR
  const buttonCrear = document.createElement('button')
  buttonCrear.type = 'submit'
  buttonCrear.textContent = 'Crear'
  buttonCrear.classList.add('btn-publicar')
  buttonCrear.addEventListener('click', () => {
    console.log('text', textAreaPost.value)
    const newPost = {
      date: new Date(),
      text: textAreaPost.value,
      email: auth.currentUser.email,
      likesCount: []
    }
    createPostProgrammingWall(newPost)
      .then((docRef) => {
        textAreaPost.value = ''
      })
      .catch((error) => {
        console.error('Error al agregar el documento: ', error)
      })
  })

  onSnapshot(qFn(), (querySnapshot) => { // (querySnapshot) Es un callback que se ejecuta cada vez que se realiza un cambio
    const postContent = document.getElementById('idPostContent')
    postContent.innerHTML = '' // limpia el contenido antes de actualizarlo
    const posts = []
    querySnapshot.forEach((doc) => { // Recorre cada documento en el objecto querySnapshot
      // console.log(doc.id, doc.data());
      const objPost = {
        id: doc.id,
        email: doc.data().email,
        date: doc.data().date,
        text: doc.data().text,
        likesCount: doc.data().likesCount
      }
      //  console.log(objPost);
      posts.push(objPost) // agrega datos de cada documento al arreglo de post
    })

    posts.forEach((post) => {
      // console.log(post.id);
      const sectionPost = document.createElement('section') // Por cada elemento crea un nuevo elemento
      sectionPost.classList.add('contenidoPost')
      const postText = document.createElement('p')
      sectionPost.append(postText) // metodo(append()) agrega elementos al final de otro element
      // BOTON LIKE
      const btnLike = document.createElement('button')
      btnLike.textContent = 'Me gusta'
      btnLike.classList.add('btn-like')
      btnLike.id = post.id
      btnLike.setAttribute('usuario-email', post.email)
      btnLike.setAttribute('data-likes-count', '0')
      // EVENTO DE LIKE
      const usersWhoLiked = [] // Array para almacenar los usuarios que dieron like
      btnLike.addEventListener('click', (e) => {
        const postId = btnLike.id
        const userEmail = btnLike.getAttribute('usuario-email')
        let currentLikesCount = parseInt(btnLike.getAttribute('data-likes-count'))
        const userAlreadyLikesThis = usersWhoLiked.includes(userEmail)
        if (userAlreadyLikesThis) {
          currentLikesCount--
          const index = usersWhoLiked.indexOf(userEmail)
          usersWhoLiked.splice(index, 1) // Remover el correo electrónico del usuario del array
        } else {
          currentLikesCount++
          usersWhoLiked.push(userEmail)
        }
        btnLike.setAttribute('data-likes-count', currentLikesCount.toString())
        btnLike.textContent = `${currentLikesCount} Me gusta`
        console.log('ID del post:', postId)
        console.log('Email del usuario:', userEmail)
        console.log('Número de likes:', currentLikesCount)
      })
      // BOTTON EDITAR
      const buttonEdit = document.createElement('button')
      buttonEdit.id = post.id
      buttonEdit.id = post.id
      buttonEdit.textContent = 'Editar'
      buttonEdit.addEventListener('click', (e) => {
        const postEditarId = e.target.id // Obtén el ID de la publicación
        const sectionPost = e.target.parentElement
        console.log(e)

        // Traer texto original
        const textOriginal = sectionPost.querySelector('.contenidoPost p')

        if (textOriginal) {
        // texto nuevo
          const textEditPost = document.createElement('textarea')
          textEditPost.classList.add('textAreEdit')
          textEditPost.rows = '10'
          textEditPost.cols = '10'
          textEditPost.id = 'textAreaEdit'
          textEditPost.value = textOriginal.textContent // (textContent) Es una propiedad que devuelve el contenido de un texto
          console.log('ingresar texto')

          // BOTON GUARDAR CAMBIOS
          const buttonUpdate = document.createElement('button')
          buttonUpdate.textContent = 'Guardar Cambios'

          // Remplaza en texto original
          sectionPost.innerHTML = '' // Limpia el contenido de la sección
          sectionPost.append(textEditPost, buttonUpdate) // Agrega elementos a sectionPost

          buttonUpdate.addEventListener('click', () => {
            const updatedText = textEditPost.value
            const updatedData = { // Almacena los datos actualizados
              text: updatedText
            }
            editPost(postEditarId, updatedData)
              .then(() => {
                const updatedTextElement = document.createElement('p')
                updatedTextElement.textContent = updatedText
                sectionPost.innerHTML = '' // Limpia el contenido de la sección nuevamente
                sectionPost.append(updatedTextElement, btnLike, buttonEdit, buttonDelete)
              })
              .catch((error) => {
                console.error('Error al actualizar la publicación:', error)
              })
          })
        }
      })

      // BOTTON DELETE
      const buttonDelete = document.createElement('button')
      buttonDelete.id = post.id
      buttonDelete.textContent = 'Borrar'
      buttonDelete.addEventListener('click', (e) => { // se coloca (e) para ingresar al evento
        const confirmacion = confirm('¿Estás seguro de que deseas eliminar este post?') // Es como el aler pero ya se uctiliza es para la confirmacion
        if (confirmacion) {
          const postIdToDelete = e.target.id // Aquí ingresamos al evento.target que es donde lo encontramos en la consola
          console.log(e.target.id)
          console.log(e)
          deletePost(postIdToDelete)
            .then(() => {
              sectionPost.remove()
              console.log('Post eliminado con éxito')
            })
            .catch((error) => {
              console.error('Error al eliminar el post:', error)
            })
        }
      })
      postContent.append(sectionPost, btnLike, buttonDelete)
      sectionPost.append(buttonEdit, btnLike, buttonDelete)
      postText.textContent = post.text
    })
  })

  // BOTON CERRAR
  const buttonReturn = document.createElement('button')
  buttonReturn.textContent = 'cerrar'
  buttonReturn.classList.add('btn-cerrar')
  buttonReturn.addEventListener('click', function () {
    exit()
  })

  // append agrega nuevo elemento al contenedor en este caso agrega tittle a section que es el principal
  section.append(title, buttonReturn, textAreaPost, divPostContent, buttonCrear)
  return section
}

export default programmingWall
