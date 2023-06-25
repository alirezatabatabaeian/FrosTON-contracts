import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type SchnorrConfig = {
    id: number;
    counter: number;
};

export function schnorrConfigToCell(config: SchnorrConfig): Cell {
    return beginCell().endCell();
}

export const Opcodes = {
    increase: 0x7e8764ef,
};

export class Schnorr implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    static createFromAddress(address: Address) {
        return new Schnorr(address);
    }

    static createFromConfig(config: SchnorrConfig, code: Cell, workchain = 0) {
        const data = schnorrConfigToCell(config);
        const init = { code, data };
        return new Schnorr(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendEmpty(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .endCell(),
        });
    }

    // async getCounter(provider: ContractProvider) {
    //     const result = await provider.get('get_counter', []);
    //     return result.stack.readNumber();
    // }

    // async getID(provider: ContractProvider) {
    //     const result = await provider.get('get_id', []);
    //     return result.stack.readNumber();
    // }
}
