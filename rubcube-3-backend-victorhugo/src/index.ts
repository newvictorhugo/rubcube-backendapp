import "dotenv/config";
import express from "express";
import usuarioRoute from "routes/UsuarioRoute"
import enderecoRoute from "routes/EnderecoRoute"
import contaBRoute from "routes/ContaBRoute"
import transRoute from "routes/TransRoute"
import RUBBANKRoute from "routes/RUBBANKRoutes";
import { authentication } from "middlewares/auth";

import { DateTime } from "luxon";

DateTime.local().setZone("America/Sao_Paulo");


const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  return res.send("Hello World");
});

app.use("/usuario", authentication, usuarioRoute);
app.use("/endereco", authentication, enderecoRoute)
app.use("/conta", authentication, contaBRoute)
app.use("/transferencia", authentication, transRoute)
app.use("/banco", authentication, RUBBANKRoute)

app.listen(process.env.PORT || 3344);


//* NODE CRON *\\

const cron = require('node-cron');
const timezone = 'America/Sao_Paulo'

cron.schedule('*/5 * * * *', async () => {
  try{
    await fetch('https://rubcube-3-backend-victorhugo.onrender.com/usuario/tudo')
    console.log("SERVIDOR EXECUTADO")
  }catch(error){
    console.error("Erro ao acessar o servidor: ", error)
  }
}, {
    timezone
})