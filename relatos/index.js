const axios = require ('axios')
const express = require ('express')
const {v4: uuidv4} = require('uuid')
const app = express()
app.use(express.json())

const relatosPorAvistamentoId = {}

app.put('/avistamentos/:id/relatos', async (req, res) => {
    const { texto } = req.body || {}
    const relato = { id: uuidv4(), texto: texto, confirmacoes: 0 }
    const relatos = relatosPorAvistamentoId[req.params.id] || []
    relatos.push(relato)
    relatosPorAvistamentoId[req.params.id] = relatos
    await axios.post('http://localhost:10000/eventos', {
    tipo: 'RelatoCriado',
    dados: {
      id: relato.id,
      texto: relato.texto,
      confirmacoes: relato.confirmacoes,
      avistamentoId: req.params.id
    }
    })
    res.status(201).json(relatos)
})
app.get('/avistamentos/:id/relatos', (req, res) => {
    res.json(relatosPorAvistamentoId[req.params.id] || [])
})

app.post('/eventos', (req, res) => {
  const evento = req.body
  console.log(evento.tipo)
  res.status(200).json({ msg: 'ok' })
})

app.put('/avistamentos/:id/relatos/:idRelato/confirmacoes', async (req, res) => {
    const relatos = relatosPorAvistamentoId[req.params.id] || []
    let relato = null
    for (let r of relatos){
        if (r.id === req.params.idRelato){
            relato = r
        }
    }
    if (!relato) {
        return res.status(404).json({erro: 'relato não encontrado'})
    }
    relato.confirmacoes++

    await axios.post('http://localhost:10000/eventos', {
        tipo: 'RelatoConfirmado',
        dados: {
            id: relato.id,
            avistamentoId: req.params.id, 
            confirmacoes: relato.confirmacoes
        }
    })
    res.status(200).json(relato)
})

const port = 4100
app.listen(port, () => console.log(`Relatos. Porta ${port}.`))