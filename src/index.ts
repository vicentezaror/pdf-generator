import generateDocument from './lib/generateDocument';
import { ITransaction } from './lib/interfaces/ITransaction';
import { IResponse } from './lib/interfaces/IResponse';
import { IAWS } from './lib/interfaces/IAWS';

class PDFGenerator {
    aws: IAWS;

    constructor(aws: IAWS) {
        this.aws = aws;
    }

    async generatePDF(documentType: string, transaction: ITransaction): Promise<IResponse> {
        return await generateDocument(documentType, transaction, this.aws);
    }
}

export default PDFGenerator;
