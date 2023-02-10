import * as fs from 'fs';
import { ITransaction } from './interfaces/ITransaction';
import { IPDFGenerator } from './interfaces/IPDFGenerator';
import { IResponse } from './interfaces/IResponse';
import { uploadToS3 } from './helpers/uploadToS3';
import * as puppeteer from 'puppeteer-core';
import * as Mustache from 'mustache';
import * as moment from 'moment';
import calculateTotalPrice from './helpers/calculateTotal';
import { IAWS } from './interfaces/IAWS';

const generateDocument: IPDFGenerator["generateDocument"] = async (
        documentType: string,
        transaction: ITransaction,
        awsConfig: IAWS
    ) : Promise<IResponse> => {
    try {
        // Check if the documentType is valid
        (!fs.existsSync(`./lib/templates/${documentType}/index.html`)) ? (function(){throw new Error('Template not found')}()) : null;
        //

        // Adapt input data to interface
        const transactionData: ITransaction = transaction as ITransaction;
        //

        // Verify if the workshop logo exists and if not, use the default one
        if (!transactionData.workshop.logo_url) {
            transactionData.workshop.logo_url =
                'https://mitallerapp-documents.s3.us-west-1.amazonaws.com/logos/mitaller-logo.png';
        };
        //
        
        // Read the index.html template and fill it with the provided transaction data
        fs.readFile(`./lib/templates/${documentType}/index.html`, async (err: NodeJS.ErrnoException | null, fileBuffer: Buffer) => {
            if (err) {
                throw new Error(err.message);
            }
            const totalPrice = calculateTotalPrice(transactionData.details);

            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            const htmlTemplate = fileBuffer.toString();
            const formatedHTML = Mustache.render(htmlTemplate,
                { date: moment().format('D/MM/YYYY'),
                totalPrice,
                ...transactionData });
            
            await page.setContent(formatedHTML);
            await page.addStyleTag({ path: `./lib/templates/${documentType}/styles.css` });
            await page.pdf({
                format: 'A4',
                printBackground: false,
                margin: {
                    top: '1px',
                    bottom: '1px',
                    left: '1px',
                    right: '1px',
                },
            }).then(
                async (pdf: Buffer) => {
                    await uploadToS3(
                        pdf, transaction.id, documentType, awsConfig
                        ).then((fileUrl: string): IResponse => {
                            browser.close()
                            return { ok: true, error: null, documentUrl: fileUrl } as IResponse;
                        });
                }
            );
        });
        //

        throw new Error('Error generating PDF');
    } catch (error) {
        return { ok: false, error: error, documentUrl: null} as IResponse;
    }
};

export default generateDocument;
