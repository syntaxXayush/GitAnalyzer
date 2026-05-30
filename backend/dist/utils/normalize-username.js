"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeUsername = normalizeUsername;
exports.isValidGithubUsername = isValidGithubUsername;
function normalizeUsername(input) {
    return input.trim().replace(/^@/, '').toLowerCase();
}
function isValidGithubUsername(username) {
    return /^([a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38})$/.test(username);
}
