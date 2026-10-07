const express = require('express')
const app = express()
app.use(express.json())

const totais = {avistamentos: 0, relatos: 0, confirmacoes: 0}
const locais = {}
const ordemLocais = []
const localPorAvistamentoId = {}

const funcoes = {
    AvistamentoCriado: (avistamento) => {
        localPorAvistamentoId[avistamento.id] = avistamento.local
        if (!locais[avistamento.local]){
            locais[avistamento.local] = {avistamentos: 0, relatos: 0, confirmacoes: 0}
            ordemLocais.push(avistamento.local)
        }
        locais[avistamento.local].avistamentos++
        totais.avistamentos++
    },
    RelatoCriado: (relato) => {
    const local = localPorAvistamentoId[relato.avistamentoId]
    if (local) {
      locais[local].relatos++
      totais.relatos++
    }
  },
    RelatoConfirmado: (dados) => {
    const local = localPorAvistamentoId[dados.avistamentoId]
    if (local) {
      locais[local].confirmacoes++
      totais.confirmacoes++
        }
    }
} 


app.get('/estatisticas', (req, res) => {
    res.json({ totais, locais })
})

app.get('/estatisticas/destaque', (req, res) => {
  if (ordemLocais.length === 0) {
    return res.status(404).json({ erro: 'sem dados' })
  }
  let destaque = ordemLocais[0]
  let maior = locais[destaque].relatos + locais[destaque].confirmacoes
  for (let local of ordemLocais) {
    const engajamento = locais[local].relatos + locais[local].confirmacoes
    //só troca se for estritamente maior: em empate, vence quem apareceu primeiro
    if (engajamento > maior) {
      destaque = local
      maior = engajamento
    }
  }
  res.json({ local: destaque, engajamento: maior })
})

app.post('/eventos', (req, res) => {
    const evento = req.body
    const funcao = funcoes[evento.tipo]
    if(funcao) {
        funcao(evento.dados)
    }
    res.status(200).json ({ msg: 'ok' })
})

const port = 4300
app.listen(port, () => console.log(`Estatísticas. Porta ${port}`))
