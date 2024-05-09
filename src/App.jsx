import { useState, useEffect } from "react";
import "./App.css";
import {
  readUsers,
  addUser,
  readUserById,
  customDoc,
  customCollection,
  deleteById,
} from "./core/service/firebase/db/users";
import { listenFeaturesFlags } from "./core/service/firebase/db/config";
import { signIn, signUp } from "./core/service/firebase/auth";
import { getImageUrlByName } from "./core/service/firebase/storage";

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
  const [users, setUsers] = useState([]);
  const [deleteUserFeatureFlag, setDeleteUserFeatureFlag] = useState(true);
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

  let getUsersCallBack = async () => {
    let response = await readUsers();
    setUsers(response);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <>
        {users.length == 0 && <h1>No hay datos</h1>}
        {users.length > 0 &&
          users.map((user) => {
            let { name, lastName, id } = { ...user };
            return (
              <Card key={id} sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Name
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {name}
                  </Typography>
                  <Typography variant="h5" component="div">
                    Last Name
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {lastName}
                  </Typography>
                </CardContent>
                <CardActions>
                  {deleteUserFeatureFlag && (
                    <Button
                      onClick={async () => {
                        await deleteById(id);
                        let response = await readUsers();
                        await setUsers(response);
                      }}
                      size="small"
                    >
                      Eliminar
                    </Button>
                  )}
                  <Button size="small">Editar</Button>
                </CardActions>
              </Card>
            );
          })}
      </>
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
          label="name"
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
          label="name"
          id="name"
          value={lastName}
          onChange={(event) => {
            setLastName(event.target.value);
          }}
        />
      </div>
      <Box sx={{ mb: 2 }} />
      <Button
        onClick={async () => {
          await addUser(name, lastName);
          let response = await readUsers();
          await setUsers(response);
          setLastName("");
          setUsers("");
        }}
        variant="contained"
      >
        Agregar
      </Button>
      <Box sx={{ mb: 2 }} />
      <Button
        onClick={async () => {
          let response = await signUp(
            "ricardoandb@gmail.com",
            "siyofueraladronmerobariatusbesos"
          );
          console.log("response", response);
        }}
        variant="contained"
      >
        Create User Auth
      </Button>
      <Box sx={{ mb: 2 }} />
      <Button
        onClick={async () => {
          let response = await signIn(
            "ricardoandb@gmail.com",
            "siyofueraladronmerobariatusbesos"
          );
          console.log("response", response);
        }}
        variant="contained"
      >
        Login User Auth
      </Button>
      <Box sx={{ mb: 2 }} />
      <Button
        onClick={async () => {
          let response = await getImageUrlByName("one_way.png");
          window.open(response);
        }}
        variant="contained"
      >
        Get Image
      </Button>
    </div>
  );
}

export default App;
