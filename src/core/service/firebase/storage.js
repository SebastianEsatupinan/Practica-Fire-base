import { storage } from "./firebase";
import { ref, getDownloadURL, listAll, uploadBytes } from "firebase/storage";

// Función para obtener URL de una imagen por nombre
async function getImageUrlByName(name) {
  const imagesRef = ref(storage, `images/${name}`);
  let response = await getDownloadURL(imagesRef);
  return response;
}

// Función para listar todas las imágenes
async function listImages() {
  const imagesRef = ref(storage, 'images/');
  const imagesList = await listAll(imagesRef);
  const urls = await Promise.all(imagesList.items.map(itemRef => getDownloadURL(itemRef)));
  return urls;
}

// Función para subir una imagen
async function uploadImage(imageFile) {
  const storageRef = ref(storage, `images/${imageFile.name}`);
  await uploadBytes(storageRef, imageFile);
  const url = await getDownloadURL(storageRef);
  return url;
}

export { getImageUrlByName, listImages, uploadImage };
