import { useState, useEffect } from "react";
import "./App.css";
import {
  readUsers,
  addUser,
  deleteById,
  updateUser,
} from "./core/service/firebase/db/users";
import { listenFeaturesFlags } from "./core/service/firebase/db/config";
import { signIn, signUp, deleteUserAccount, updateUserEmail } from "./core/service/firebase/auth";
import { uploadImage, listImages } from "./core/service/firebase/storage"; // Importar las funciones necesarias

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { inputLabelClasses } from "@mui/material/InputLabel";
import { styled } from "@mui/material/styles";

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "white",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "red",
  },
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "blue",
    },
    "&.Mui-focused fieldset": {
      borderColor: "pink",
    },
  },
});

function App() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authUsers, setAuthUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [deleteUserFeatureFlag, setDeleteUserFeatureFlag] = useState(true);
  const [editUserId, setEditUserId] = useState(null);
  const [editAuthUserId, setEditAuthUserId] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  let unsubscribe;

  useEffect(() => {
    getUsersCallBack();
    unsubscribe = listenFeaturesFlags((value) => {
      let { delete_users } = { ...value };
      setDeleteUserFeatureFlag(delete_users);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const getUsersCallBack = async () => {
    let response = await readUsers();
    setUsers(response);
  };

  const handleEdit = (user) => {
    setName(user.name);
    setLastName(user.lastName);
    setEditUserId(user.id);
  };

  const handleAuthEdit = (user) => {
    setEmail(user.email);
    setEditAuthUserId(user.id);
  };

  const handleSave = async () => {
    if (editUserId) {
      await updateUser(editUserId, name, lastName);
    } else {
      await addUser(name, lastName);
    }
    let response = await readUsers();
    setUsers(response);
    setName("");
    setLastName("");
    setEditUserId(null);
  };

  const handleAuthSave = async () => {
    try {
      if (editAuthUserId) {
        const user = authUsers.find(u => u.id === editAuthUserId);
        if (user) {
          await updateUserEmail(user, email);
          setAuthUsers(authUsers.map(u => (u.id === editAuthUserId ? { ...u, email } : u)));
        }
      } else {
        const user = await signUp(email, password);
        setAuthUsers([...authUsers, { id: user.uid, email: user.email }]);
      }
      setEmail("");
      setPassword("");
      setEditAuthUserId(null);
    } catch (error) {
      console.error("Error creando usuario:", error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signIn(loginEmail, loginPassword);
      setLoginMessage("Felicitaciones, estás registrado!");
    } catch (error) {
      setLoginMessage("No estás registrado.");
    }
  };

  const handleImageUpload = async (event) => {
    event.preventDefault();
    if (imageFile) {
      try {
        const url = await uploadImage(imageFile);
        alert("Imagen subida correctamente");
        setImageFile(null);
      } catch (error) {
        console.error("Error subiendo la imagen:", error);
        alert("Error subiendo la imagen");
      }
    }
  };

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleListImages = async () => {
    try {
      const urls = await listImages();
      setImageUrls(urls);
    } catch (error) {
      console.error("Error obteniendo las imágenes:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Gestión de Usuarios */}
      <div className="section">
        <h2 className="section-title">Gestión de Usuarios</h2>
        {users.length === 0 && <h1>No hay datos</h1>}
        {users.length > 0 &&
          users.map((user) => {
            let { name, lastName, id } = { ...user };
            return (
              <Card key={id} sx={{ minWidth: 275, marginBottom: '1rem' }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    Nombre
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 1.5 }} color="text.secondary">
                    {name}
                  </Typography>
                  <Typography variant="h6" component="div">
                    Apellido
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 1.5 }} color="text.secondary">
                    {lastName}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={async () => {
                      await deleteById(id);
                      let response = await readUsers();
                      setUsers(response);
                    }}
                    size="small"
                  >
                    Eliminar
                  </Button>
                  <Button size="small" onClick={() => handleEdit(user)}>
                    Editar
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        <Box sx={{ mb: 2 }} />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <CssTextField
            InputLabelProps={{
              sx: {
                color: "white",
                [`&.${inputLabelClasses.shrink}`]: {
                  color: "white",
                },
              },
            }}
            label="Nombre"
            id="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <Box sx={{ mr: 2 }} />
          <CssTextField
            InputLabelProps={{
              sx: {
                color: "white",
                [`&.${inputLabelClasses.shrink}`]: {
                  color: "white",
                },
              },
            }}
            label="Apellido"
            id="lastName"
            value={lastName}
            onChange={(event) => {
              setLastName(event.target.value);
            }}
          />
        </div>
        <Box sx={{ mb: 2 }} />
        <Button onClick={handleSave} variant="contained">
          {editUserId ? "Guardar" : "Agregar"}
        </Button>
      </div>

      {/* Gestión de Autenticación */}
      <div className="section">
        <h2 className="section-title">Gestión de Autenticación</h2>
        <Box sx={{ mb: 2 }} />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <CssTextField
            InputLabelProps={{
              sx: {
                color: "white",
                [`&.${inputLabelClasses.shrink}`]: {
                  color: "white",
                },
              },
            }}
            label="Email"
            id="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <Box sx={{ mr: 2 }} />
          <CssTextField
            InputLabelProps={{
              sx: {
                color: "white",
                [`&.${inputLabelClasses.shrink}`]: {
                  color: "white",
                },
              },
            }}
            label="Contraseña"
            id="password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </div>
        <Box sx={{ mb: 2 }} />
        <Button onClick={handleAuthSave} variant="contained">
          {editAuthUserId ? "Guardar" : "Crear Usuario"}
        </Button>
      </div>

      {/* Gestión de Imágenes */}
      <div className="section">
        <h2 className="section-title">Gestión de Imágenes</h2>
        <form onSubmit={handleImageUpload}>
          <input type="file" onChange={handleImageChange} />
          <Button type="submit" variant="contained">
            Subir Imagen
          </Button>
        </form>
        <Button onClick={handleListImages} variant="contained" sx={{ mt: 2 }}>
          Traer Imágenes
        </Button>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "1rem" }}>
          {imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`uploaded-${index}`} style={{ maxWidth: "100%", marginBottom: "1rem" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
