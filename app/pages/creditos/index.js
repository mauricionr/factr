const template = require('./index.marko');
const dados = [{id:1, data_transacao:"17/01/217", lancamento:"Manual", tipo:"Produtos", estabelecimento:"João Carlos ME", segmento:"Água Potável", num_cupom:13995, valor_compra:"15,00",credito_compra:"1,00", mes_reembolso:"Março/2017"},{id:2, data_transacao:"16/01/217", lancamento:"Manual", tipo:"Serviços", estabelecimento:"Axl Rose ME", segmento:"Escola de Línguas", num_cupom:13623, valor_compra:"250,00",credito_compra:"10,00", mes_reembolso:"Março/2017"}, {id:3, data_transacao:"10/01/217", lancamento:"Automático", tipo:"Serviços", estabelecimento:"Zeca Camargo ME", segmento:"Academia", num_cupom:12500, valor_compra:"233,00",credito_compra:"12,00", mes_reembolso:"Fevereiro/2017"}, {id:4, data_transacao:"10/01/217", lancamento:"Automático", tipo:"Serviços", estabelecimento:"Zeca Camargo ME", segmento:"Academia", num_cupom:32989, valor_compra:"250,00",credito_compra:"15,00", mes_reembolso:"Fevereiro/2017"}, {id:5, data_transacao:"05/01/217", lancamento:"Automático", tipo:"Produtos", estabelecimento:"Zeca Camargo ME", segmento:"Posto de Gasolina", num_cupom:10987, valor_compra:"20,00",credito_compra:"2,00", mes_reembolso:"Fevereiro/2017"}];
module.exports = (req, res) => {
    res.marko(template, {
        title: 'Créditos',
        dados,
    });
}
