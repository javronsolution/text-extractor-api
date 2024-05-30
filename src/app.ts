import express, { Request, Response } from 'express';
import { globalErrorHandler, notFound } from './middlewares/error.middleware';
import multer from 'multer';
import { asyncHandler } from './utils/asyncHandler';
import { ApiError } from './utils/ApiError';
import fs from 'node:fs';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import path from 'node:path';

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

const upload = multer({ dest: 'uploads/' });
const client = new DocumentProcessorServiceClient();
let letterDetails : {key: string | null | undefined; value: string | null | undefined}[] | undefined = [];
let passportDetails: {key: string | null | undefined; value: string | null | undefined}[] | undefined = [];
app.get('/', (req: Request, res: Response) => {
    res.render('pages/upload', {
        detailsLetter: [],
        detailsPassport: [],
        routeName: 'Aadhar',
    });
});
// app.post(
//     '/upload/aadhar',
//     upload.single('document'),
//     asyncHandler(async (req: Request, res: Response) => {
//         console.log('received');
//         if (!req.file) {
//             throw new ApiError(400, 'No file uploaded');
//         }

//         const dataBuffer = fs.readFileSync(req.file.path);

//         const name = `projects/${'643888402760'}/locations/${'us'}/processors/${'5d5daaca0a10cd17'}`;

//         // Convert the image data to a Buffer and base64 encode it.
//         const encodedImage = Buffer.from(dataBuffer).toString('base64');
//         const request = {
//             name,
//             rawDocument: {
//                 content: encodedImage,
//                 mimeType: req.file.mimetype,
//             },
//         };

//         // Recognizes text entities in the PDF document
//         const [result] = await client.processDocument(request);
//         const { document } = result;
//         const data = document?.entities?.map((entity) => {
//             return {
//                 key: entity.type,
//                 value: entity.mentionText,
//             };
//         });
//         // Desired order of keys
//         const order = [
//             'id',
//             'first-name',
//             'last-name',
//             'gender',
//             'dob',
//             'address',
//         ];
//         // Sort the array
//         data?.sort((a, b) => {
//             return (
//                 order.indexOf(a.key as string) - order.indexOf(b.key as string)
//             );
//         });
        
//         // res.render('pages/upload', {
//         //     detailsAadhar: [],
//         //     detailsPassport: passportDetails,
//         //     routeName: 'Aadhar',
//         // });
//     }),
// );
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
        console.log(data)
        res.render('pages/upload', {
            detailsPassport: data,
            detailsLetter: [],
            routeName: 'Passport',
        });
    }),
);
app.post(
    '/upload/letter',
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
        // Desired order of keys
        const order = [
            'given-name',
            'family-name',
            'date-of-birth',
            'student-id',
            'caq-or-midi-letter',
            'studdent-full-mailing-address',
            'institution-name',
            'designated-learning-institution-number',
            'address-of-institution',
            'telephone-number',
            'fax-number',
            'type-of-institution',
            'institution-website',
            'institution-email',
            'academic-status',
            'field-of-study',
            'level-of-stude',
            'type-of-training',
            'exchange-program',
            'estimated-program-tuition-fees',
            'scholarship',
            'internship',
            'condition-of-acceptance',
            'length-of-program',
            'program-start-date',
            'program-end-date',
            'expiration-of-letter-of-acceptance',
            'other-relevant-information',
        ];
        // Sort the array
        data?.sort((a, b) => {
            return (
                order.indexOf(a.key as string) - order.indexOf(b.key as string)
            );
        });
        console.log(data);
        // letterDetails = data
        res.render('pages/upload', {
            detailsPassport: [],
            detailsLetter: data,
            routeName: 'Letter',
        });
    }),
);

app.use(notFound);
app.use(globalErrorHandler);
export default app;
