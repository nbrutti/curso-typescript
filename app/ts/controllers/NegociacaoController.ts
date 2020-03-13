import { MensagemView, NegociacoesView } from '../views/index';
import { Negociacao, Negociacoes, NegociacaoParcial } from '../models/index';
import { domInject, throttle } from '../helpers/decorators/index';
import { NegociacaoService, HandlerFunction } from '../services/index';
import { imprime } from '../helpers/Utils';

let timer = 0;

export class NegociacaoController {

    @domInject("#data")
    private _inputData: JQuery;

    @domInject('#quantidade')
    private _inputQuantidade: JQuery;

    @domInject('#valor')
    private _inputValor: JQuery;
    
    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView', true);
    private _mensagemView = new MensagemView('#mensagemView', true);

    private _service = new NegociacaoService();

    constructor() {
        this._negociacoesView.update(this._negociacoes);
    }   

    adicionar(event: Event) {
        event.preventDefault();

        let data = new Date(this._inputData.val().replace(/-/g, ','));

        if (!this._ehDiaUtil(data)) {
            this._mensagemView.update("Somente negociações em dias úteis, por favor!");
            return;
        }

        const negociacao = new Negociacao(
            new Date(this._inputData.val().replace(/-/g, ',')),
            parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val())
        );

        
        this._negociacoes.adiciona(negociacao);
        
        imprime(negociacao, this._negociacoes);
        
        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso!');
    }

    @throttle()
    importarDados() {
        
        const isOk: HandlerFunction = (res: Response) => {
            if (res.ok) return res;
            throw new Error(res.statusText);
        }

        this._service
            .obterNegociacoes(isOk)
            .then(negociacoesParaImportar => {
                const negociacoesJaImportadas = this._negociacoes.paraArray();

                (<Negociacao[]> negociacoesParaImportar)
                    .filter(negociacao =>
                        !negociacoesJaImportadas.some(jaImportadas =>
                            negociacao.ehIgual(jaImportadas)))
                    .forEach(negociacao => {
                        this._negociacoes.adiciona(negociacao)
                    });

                this._negociacoesView.update(this._negociacoes);
            });

    }

    private _ehDiaUtil(data: Date) {
        let dia = data.getDay();
        return (dia != DiaSemana.Domingo) &&
               (dia != DiaSemana.Sabado);
    }

}

enum DiaSemana {
    Domingo,
    Segunda,
    Terca,
    Quarta,
    Quinta,
    Sexta,
    Sabado
}