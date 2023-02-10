import { IAWS } from './IAWS';
import { IResponse } from './IResponse';
import { ITransaction } from './ITransaction';

export interface IPDFGenerator {
    generateDocument: (
        documentType: string, transaction: ITransaction, awsConfig: IAWS
    ) => Promise<IResponse>;
}
