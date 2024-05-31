import express, { Request, Response } from 'express';
import { globalErrorHandler, notFound } from './middlewares/error.middleware';
import multer from 'multer';
import { asyncHandler } from './utils/asyncHandler';
import { ApiError } from './utils/ApiError';
import fs from 'node:fs';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { ApiResponse } from './utils/ApiResponse';
import { orderPassport } from './utils/helpres';
import cors from 'cors'


const app = express();
const upload = multer({ dest: 'uploads/' });
const client = new DocumentProcessorServiceClient();

app.use(cors({origin: '*'}))


app.get('/', (req: Request, res: Response) => {
    res.json('server is running');
});
app.post(
    '/upload/passport',
    upload.single('document'),
    asyncHandler(async (req: Request, res: Response) => {
        console.log('received');
        if (!req.file) {
            throw new ApiError(400, 'No file uploaded');
        }

        const dataBuffer = fs.readFileSync(req.file.path);

        const name = `projects/${'643888402760'}/locations/${'us'}/processors/${'2a353290215f753c'}`;

        // Convert the image data to a Buffer and base64 encode it.
        const encodedImage = Buffer.from(dataBuffer).toString('base64');
        const request = {
            name,
            rawDocument: {
                content: encodedImage,
                mimeType: req.file.mimetype,
            },
        };

        // Recognizes text entities in the PDF document
        const [result] = await client.processDocument(request);
        const { document } = result;
        const data = document?.entities?.map((entity) => {
            return {
                key: entity.type,
                value: entity.mentionText,
            };
        });
        // Desired order of keys
        const order = [
            'id',
            'first-name',
            'last-name',
            'gender',
            'dob',
            'father-name',
            'mother-name',
            'nationality',
            'passport-code',
            'passport-type',
            'place-of-issue',
            'date-of-issue',
            'date-of-expiry',
            'file-number',
            'address',
        ];
        // Sort the array
        data?.sort((a, b) => {
            return (
                order.indexOf(a.key as string) - order.indexOf(b.key as string)
            );
        });
        console.log(data);
        res.status(200).json(new ApiResponse(200, data));
    }),
);
app.post(
    '/upload/loa',
    upload.single('document'),
    asyncHandler(async (req: Request, res: Response) => {
        console.log('received');
        if (!req.file) {
            throw new ApiError(400, 'No file uploaded');
        }

        const dataBuffer = fs.readFileSync(req.file.path);

        const name = `projects/${'643888402760'}/locations/${'us'}/processors/${'a339a1daa652849f'}`;

        // Convert the image data to a Buffer and base64 encode it.
        const encodedImage = Buffer.from(dataBuffer).toString('base64');
        const request = {
            name,
            rawDocument: {
                content: encodedImage,
                mimeType: req.file.mimetype,
            },
        };

        // Recognizes text entities in the PDF document
        const [result] = await client.processDocument(request);
        const { document } = result;
        const data = document?.entities?.map((entity) => {
            return {
                key: entity.type,
                value: entity.mentionText,
            };
        });
        // Sort the array
        data?.sort((a, b) => {
            return (
                orderPassport.indexOf(a.key as string) -
                orderPassport.indexOf(b.key as string)
            );
        });
        console.log(data);
        res.status(200).json(new ApiResponse(200, data));
    }),
);

app.use(notFound);
app.use(globalErrorHandler);
export default app;
