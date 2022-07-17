class CustomError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new CustomError(401, 'Будь ласка, авторизуйтесь');
    }

    static BadRequestError(message, error = []) {
        return  new CustomError(400, message, error);
    }

    static AccessDeniedError() {
        return new CustomError(403, 'Відмовлено в доступі');
    }

    static FilesError(message) {
        return new CustomError(400, message);
    }
}

module.exports = CustomError;