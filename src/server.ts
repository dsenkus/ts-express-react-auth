import * as config from 'config';
import app from "./app";

export const server = app.listen(config.get('app.port'), (): void => {
    console.log(`Server started on port ${config.get('app.port')}`);
});
