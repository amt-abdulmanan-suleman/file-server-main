var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var registerBtn = document.querySelector('.submit-reg-btn');
var verifyBtn = document.querySelector('.submit-verify-btn');
var loginBtn = document.querySelector('.login-btn');
var usernameInput = document.querySelector('#name');
var emailLogInput = document.querySelector('#email-log');
var passwordLogInput = document.querySelector('#password-log');
var emailInput = document.querySelector('#email');
var passwordInput = document.querySelector('#password');
var verifyInput = document.querySelector('#verify-token');
var registerDiv = document.querySelector('.container-reg');
var verifyForm = document.querySelector('.verify-form');
var loginDiv = document.querySelector('.container-login');
var alreadyLoginBtn = document.querySelector('.already-btn-login');
var alreadyRegBtn = document.querySelector('.already-btn-reg');
var errorList = document.createElement('ul');
var LoggedIn = localStorage.getItem('profile');
var receiveBtn = document.querySelector('.receive-btn');
var emailResetInput = document.querySelector('#email-reset');
var resetForm = document.querySelector('.reset-form');
var verifyResetBtn = document.querySelector('.submit-verify-reset-btn');
var verifyResetForm = document.querySelector('.verify-reset-form');
var verifyResetInput = document.querySelector('#verify-reset-token');
var resetPasswordForm = document.querySelector('.reset-password');
var resetPasswordBtn = document.querySelector('.reset-password-btn');
var newPasswordInput = document.querySelector('#new-password');
var confirmPasswordInput = document.querySelector('#confirm-password');
var forgotPasswordBtn = document.querySelector('.forgot');
if (LoggedIn) {
    window.location.href = 'http://127.0.0.1:5500/client/filesPage.html';
}
var registerFunc = function (user) { return __awaiter(_this, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch('https://file-server-main.vercel.app/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(user)
                })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response];
        }
    });
}); };
var verifyFunc = function (token) { return __awaiter(_this, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("https://file-server-main.vercel.app/verify-email/".concat(token), {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    }
                })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response];
        }
    });
}); };
var loginFunc = function (cred) { return __awaiter(_this, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("https://file-server-main.vercel.app/auth/login", {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(cred)
                })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response];
        }
    });
}); };
var receiveResetTokenFunc = function (email) { return __awaiter(_this, void 0, void 0, function () {
    var response, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch('https://file-server-main.vercel.app/auth/reset-token', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ email: email })
                })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                return [2 /*return*/, data];
        }
    });
}); };
var resetPasswordFunc = function (password, id) { return __awaiter(_this, void 0, void 0, function () {
    var response, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("https://file-server-main.vercel.app/auth/reset-password/".concat(id), {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ password: password })
                })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                return [2 /*return*/, data];
        }
    });
}); };
function errorDisplay(errArray) {
    var errorList = errArray.map(function (error) {
        return "\n          <li>\n            <i class=\"fas fa-times-circle\"></i>\n            <p>".concat(error.msg, "</p>\n          </li>\n        ");
    }).join('');
    return errorList;
}
var getUser = function (id) { return __awaiter(_this, void 0, void 0, function () {
    var response, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("https://file-server-main.vercel.app/user/".concat(id), {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json'
                    }
                })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                return [2 /*return*/, data];
        }
    });
}); };
registerBtn.addEventListener('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
    var user, response, data, errorList_1, secondChild;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                user = {
                    name: usernameInput.value,
                    email: emailInput.value,
                    password: passwordInput.value
                };
                return [4 /*yield*/, registerFunc(user)];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                if (data.success) {
                    registerDiv.classList.add('hide');
                    verifyForm.classList.remove('hide');
                }
                else {
                    errorList_1 = document.createElement('ul');
                    errorList_1.innerHTML = errorDisplay(data.errors);
                    secondChild = registerDiv.children[1];
                    registerDiv.insertBefore(errorList_1, secondChild);
                }
                return [2 /*return*/];
        }
    });
}); });
loginBtn.addEventListener('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
    var cred, response, data, user, info_1, infoString_1, secondChild;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                cred = {
                    email: emailLogInput.value,
                    password: passwordLogInput.value
                };
                return [4 /*yield*/, loginFunc(cred)];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                if (!data.success) return [3 /*break*/, 4];
                return [4 /*yield*/, getUser(data.id)];
            case 3:
                user = _a.sent();
                info_1 = { user: user, token: data.token };
                infoString_1 = JSON.stringify(info_1);
                localStorage.setItem('profile', infoString_1);
                window.location.href = 'http://127.0.0.1:5500/client/filesPage.html';
                return [3 /*break*/, 5];
            case 4:
                // create a new <ul> element
                errorList.innerHTML = errorDisplay(data.errors);
                secondChild = loginDiv.children[1];
                loginDiv.insertBefore(errorList, secondChild);
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
receiveBtn.addEventListener('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
    var email, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                email = emailResetInput.value;
                return [4 /*yield*/, receiveResetTokenFunc(email)];
            case 1:
                data = _a.sent();
                if (data.success) {
                    registerDiv.classList.add('hide');
                    loginDiv.classList.add('hide');
                    verifyForm.classList.add('hide');
                    resetForm.classList.add('hide');
                    verifyResetForm.classList.remove('hide');
                }
                return [2 /*return*/];
        }
    });
}); });
verifyBtn.addEventListener('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
    var token, response, success;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                token = verifyInput.value;
                return [4 /*yield*/, verifyFunc(token)];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                success = (_a.sent()).success;
                if (success) {
                    verifyForm.classList.add('hide');
                    loginDiv.classList.remove('hide');
                }
                return [2 /*return*/];
        }
    });
}); });
var resetId;
verifyResetBtn.addEventListener('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
    var token, response, _a, success, id;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                e.preventDefault();
                token = verifyResetInput.value;
                return [4 /*yield*/, verifyFunc(token)];
            case 1:
                response = _b.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                _a = _b.sent(), success = _a.success, id = _a.id;
                if (success) {
                    resetId = id;
                    verifyForm.classList.add('hide');
                    loginDiv.classList.add('hide');
                    registerDiv.classList.add('hide');
                    resetPasswordForm.classList.remove('hide');
                    verifyResetForm.classList.add('hide');
                }
                return [2 /*return*/];
        }
    });
}); });
alreadyLoginBtn.addEventListener('click', function () {
    registerDiv.classList.add('hide');
    loginDiv.classList.remove('hide');
});
alreadyRegBtn.addEventListener('click', function () {
    registerDiv.classList.remove('hide');
    loginDiv.classList.add('hide');
});
resetPasswordBtn.addEventListener('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
    var password, success;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                password = newPasswordInput.value;
                return [4 /*yield*/, resetPasswordFunc(password, resetId)];
            case 1:
                success = (_a.sent()).success;
                if (success) {
                    verifyForm.classList.add('hide');
                    loginDiv.classList.remove('hide');
                    registerDiv.classList.add('hide');
                    resetPasswordForm.classList.add('hide');
                    resetForm.classList.add('hide');
                }
                return [2 /*return*/];
        }
    });
}); });
forgotPasswordBtn.addEventListener('click', function (e) {
    e.preventDefault();
    verifyForm.classList.add('hide');
    resetForm.classList.remove('hide');
    loginDiv.classList.add('hide');
    registerDiv.classList.add('hide');
    resetPasswordForm.classList.add('hide');
});
confirmPasswordInput.addEventListener('input', function (e) {
    var newPassword = newPasswordInput.value;
    var input = e.target;
    if (newPassword === input.value) {
        resetPasswordBtn.disabled = false;
    }
});
