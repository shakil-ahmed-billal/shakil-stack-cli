import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window as any);

export const sanitize = (data: any): any => {
    if (typeof data === 'string') return DOMPurify.sanitize(data);
    if (typeof data === 'object' && data !== null) {
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) data[key] = sanitize(data[key]);
        }
    }
    return data;
};
