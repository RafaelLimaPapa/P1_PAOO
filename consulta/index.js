const express = require('express')
const app = express()
app.use(express.json())

const baseConsulta = {}

const funcoes = {
  AvistamentoCriado: (avistamento) => {
    avistamento.relatos = []
    baseConsulta[avistamento.id] = avistamento
  },
  RelatoCriado: (relato) => {
    const avistamento = baseConsulta[relato.avistamentoId]
    if (avistamento) {
      avistamento.relatos.push(relato)
    }
  },

    RelatoConfirmado: (dados) => {
        const avistamento = baseConsulta[dados.avistamentoId]
        if (avistamento) {
            for (let relato of avistamento.relatos){
                if (relato.id === dados.id){
                    relato.confirmacoes = dados.confirmacoes
                }
            }
        }
    }
 }

app.get('/avistamentos', (req, res) => {
  res.json(baseConsulta)
})

app.post('/eventos', (req, res) => {
  const evento = req.body
  console.log(evento)
  const funcao = funcoes[evento.tipo]
  if (funcao) {
    funcao(evento.dados)
  }
  res.status(200).json({ msg: 'ok' })
})

const port = 4200
app.listen(port, () => console.log(`Consulta. Porta ${port}.`))