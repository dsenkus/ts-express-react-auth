import * as config from 'config';
import app from "./app";

process.on("uncaughtException", (e): void => {
    console.log(e);
    process.exit(1);
});
  
process.on("unhandledRejection", (e): void => {
    console.log(e);
    process.exit(1);
});

export const server = app.listen(config.get('app.port'), (): void => {
    console.log(`Server started on port ${config.get('app.port')}`);
});
