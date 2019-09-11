"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
function loggerMiddleware(request, response, next) {
    console.log(request.method + " " + request.path);
    next();
}
var app = express_1.default();
app.use(loggerMiddleware);
app.get('/hello', function (request, response) {
    response.send('Hello world!');
});
app.listen(5000);
//# sourceMappingURL=server.js.map