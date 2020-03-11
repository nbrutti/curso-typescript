class NegociacaoController {
    private _inputData: Element;
    private _inputQuantidade: Element;
    private _inputValor: Element;

    constructor() {
        this._inputData = document.querySelector('#data');
        this._inputQuantidade = document.querySelector('#quantidade');
        this._inputValor = document.querySelector('#valor');
    }

    adicionar(event: Event) {
        event.preventDefault();
        const negociacao = new Negociacao(
            this._inputData,
            this._inputQuantidade.value,
            this._inputValor.value
        );
        console.log(negociacao.quantidade + 20);
    }

}