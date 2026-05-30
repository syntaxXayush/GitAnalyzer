"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUtcDate = toUtcDate;
exports.yearsBetween = yearsBetween;
exports.monthLabels = monthLabels;
function toUtcDate(value) {
    if (!value) {
        return null;
    }
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }
    return date.toISOString().slice(0, 19).replace('T', ' ');
}
function yearsBetween(startDate, endDate) {
    const diffMs = Math.max(0, endDate.getTime() - startDate.getTime());
    return Number((diffMs / (1000 * 60 * 60 * 24 * 365.25)).toFixed(2));
}
function monthLabels(count = 12) {
    const labels = [];
    const now = new Date();
    for (let offset = count - 1; offset >= 0; offset -= 1) {
        const cursor = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
        const key = cursor.toISOString().slice(0, 7);
        const month = cursor.toLocaleString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' });
        labels.push({ key, month });
    }
    return labels;
}
