import createHttpError from "http-errors";

const notFoundHandler = () => {
    throw createHttpError(404, 'Route not found');
};

export default notFoundHandler;
