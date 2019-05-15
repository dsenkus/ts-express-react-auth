import app from "./app";

export const server = app.listen(process.env.PORT, (): void => {
    console.log(`Server started on port ${process.env.PORT}`);
});
