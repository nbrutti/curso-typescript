import { NegociacaoController } from './controllers/NegociacaoController';

const controller = new NegociacaoController();

$('.form').submit(controller.adicionar.bind(controller));
$('#botao-importar').click(controller.importarDados.bind(controller));