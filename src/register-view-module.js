export const registerViewModule = (app, container, definition) => {
    const gameNameInSocketNamespace = definition.name.toLowerCase();
    console.log("app", app, app.socketServer);
    app.socketServer.of(`/view/${gameNameInSocketNamespace}`).on("connection", (socketClient) => {
        const baseViewRouter = container.resolve("baseViewRouter");
        baseViewRouter.init(socketClient);
    });
};
