import express from 'express';
import mongoose from 'mongoose';

import { route } from './routes/accountRouter.js';

const app = express();

(async () => {
  try {
    await mongoose.connect(process.env.MONGOURL,
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
      }
    );
    console.log('Conectado no MongoDB');
  } catch (error) {
    console.log('Erro ao conectar no MongoDB');
  }
})();

app.use(express.json());
app.use(route);

app.listen(process.env.PORT, () => console.log('Servidor em execucao'));
