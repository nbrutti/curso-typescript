const controller = new NegociacaoController();

$('.form').submit(controller.adicionar.bind(controller));