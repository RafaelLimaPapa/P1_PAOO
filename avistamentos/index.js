const axios = require ('axios')
const express = require ('express')
const app = express()
app.use(express.json())

let contador = 0
const avistamentos = {}

app.get('/avistamentos', (req, res) => {
  res.json(avistamentos)
})

app.put('/avistamentos', (req, res) => {
  const { local, descricao } = req.body || {}
  if (!local || !descricao) {
    return res.status(400).json({ erro: 'local e descricao são obrigatórios' })
  }
  contador++
  const avistamento = { id: contador, local, descricao }
  avistamentos[contador] = avistamento
  res.status(201).json(avistamento)
})

const port = 4000
app.listen(port, () => console.log(`Avistamentos. Porta ${port}.`))