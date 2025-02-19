import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { data } from './data/index'

dotenv.config();
const PORT: number = parseInt(process.env.PORT! || "4001");
const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
    res.send("Hello World");
});

app.get("/api/info", async (req: Request, res: Response) => {
    try {
        const ids = req.query.ids as string;

        const response = await fetch(
            `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${ids}`,
            {
                headers: {
                    "X-CMC_PRO_API_KEY": process.env.CRYPTO_API_KEY!,
                },
            },
        );

        const result = await response.json();
        res.status(200).json({
            success: true,
            data: result.data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: (error as Error).message || "Server Error",
        });
    }
});

app.get('/api/listings', async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string || "10");

        const response = await fetch(
            `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=${limit}&convert=EUR`,
            {
                headers: {
                    "X-CMC_PRO_API_KEY": process.env.CRYPTO_API_KEY!,
                },
            },
        );
        
        const result = await response.json();
        // console.log(result);
        res.status(200).json({
            success: true,
            data: result.data,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: (error as Error).message || "Server Error",
        });
    }
});

app.get('/api/tickers', async (req: Request, res: Response) => {
    try {
        res.status(200).json({
            success: true,
            data: data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: (error as Error).message || "Server Error",
        });
    }
});

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
        process.exit(1);
    }

    console.log(`Server is running on port ${PORT}`);
});
