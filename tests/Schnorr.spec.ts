import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Schnorr } from '../wrappers/Schnorr';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Schnorr', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Schnorr');
    });

    let blockchain: Blockchain;
    let schnorr: SandboxContract<Schnorr>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        schnorr = blockchain.openContract(
            Schnorr.createFromConfig(
                {
                    id: 0,
                    counter: 0,
                },
                code
            )
        );

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await schnorr.sendDeploy(deployer.getSender(), toNano('0.05'));
        // try {
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: schnorr.address,
            deploy: true,
            success: true,
        });
        // } catch {
        //     console.assert(false);
        // }
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and consensus are ready to use
    });

    it('should run', async () => {
        const increaser = await blockchain.treasury('increaser');
        const increaseResult = await schnorr.sendEmpty(increaser.getSender(), {
            value: toNano('0.05'),
        });
        let fees = increaseResult.transactions[0].totalFees;
        console.log('Fee:', fees);
        console.log(increaseResult.transactions[0].vmLogs);
        // let tx = increaseResult.transactions[0];

        // try {
        expect(increaseResult.transactions).toHaveTransaction({
            from: increaser.address,
            to: schnorr.address,
            deploy: false,
            success: true,
        });
        // } catch {
        //     console.assert(false);
        // }
    });
});
