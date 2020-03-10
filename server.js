'use strict';
const http = require('http'),
    https = require('https'),
    bent = require('bent'),
    bodyParser = require('body-parser'),
    express = require('express'),
    app = express();
var port = process.env.PORT || 8337;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(port, console.log("Crawler ML escutando na porta " + port));

const getJSON = bent('json', 200, 204);

app.post("/", async (req, res, next) => {
    try {
        if (req.body && req.body.search && req.body.limit) {
            const lista = await pesquisa(req.body);
            res.json(lista);
        }
        else {
            res.status(204).send();
        }
    }
    catch (error) {
        return next(error);
    }
});

async function pesquisa(objeto) {
    let url = "https://api.mercadolibre.com/sites/MLB/search?q=" + objeto.search + "&limit=" + objeto.limit;
    try {
        const getPesquisaProdutos = await getJSON(url);

        if (getPesquisaProdutos && getPesquisaProdutos.results) {
            const listaDeProdutos = await geraListaDeProdutos(getPesquisaProdutos.results);

            return listaDeProdutos;
        }
        else {
            return {};
        }
    } catch (error) {
        return error;
    }

}
async function geraListaDeProdutos(listaDeResultados) {
    let listaDeProdutos = [];

    //AS DUAS LINHAS A SEGUIR RESOLVEM AS REQUISICOES PARA ACHAR O NOME DO VENDEDOR EM PARALELO
    let listaDePromisesDeProdutos = listaDeResultados.map((resultado) => transformaResultadoEmProduto(resultado));
    listaDeProdutos = await Promise.all(listaDePromisesDeProdutos);

    //CASO QUISESSEMOS QUE A SEGUNDA REQUISICAO PARA ACHAR O NOME DO VENDEDOR FOSSE SEQUENCIAL, USARIAMOS ESSE BLOCO
    //for (let resultado of listaDeResultados) {
    //    let produto = await transformaResultadoEmProduto(resultado);
    //    listaDeProdutos.push(produto);
    //}

    return listaDeProdutos;
}

async function transformaResultadoEmProduto(resultado){
    let produto = {};
    produto.name = resultado.title;
    produto.link = resultado.permalink;
    produto.price = resultado.price;
    if (resultado.seller && resultado.seller.id) {
        let url = "https://api.mercadolibre.com/users/" + resultado.seller.id;
        let vendedor = await getJSON(url);
        produto.store = vendedor.nickname;
    }
    produto.state = resultado.address.state_name;

    return produto;
}

