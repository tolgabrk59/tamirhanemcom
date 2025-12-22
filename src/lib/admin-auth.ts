import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET;
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export function hasAdminConfig(): boolean {
    return Boolean(process.env.ADMIN_PASSWORD && SESSION_SECRET);
}

export function generateToken(): string {
    if (!SESSION_SECRET) {
        throw new Error('SESSION_SECRET is not configured');
    }

    const timestamp = Date.now().toString();
    const random = crypto.randomBytes(16).toString('hex');
    const payload = `${timestamp}:${random}`;
    const signature = crypto
        .createHmac('sha256', SESSION_SECRET)
        .update(payload)
        .digest('hex');

    return Buffer.from(`${payload}:${signature}`).toString('base64');
}

export function validateToken(token: string): boolean {
    if (!SESSION_SECRET) return false;

    try {
        const decoded = Buffer.from(token, 'base64').toString();
        const [timestamp, random, signature] = decoded.split(':');
        if (!timestamp || !random || !signature) return false;

        const tokenTime = Number(timestamp);
        if (!Number.isFinite(tokenTime)) return false;

        const payload = `${timestamp}:${random}`;
        const expectedSignature = crypto
            .createHmac('sha256', SESSION_SECRET)
            .update(payload)
            .digest('hex');

        const sigBuf = Buffer.from(signature);
        const expectedBuf = Buffer.from(expectedSignature);
        if (sigBuf.length !== expectedBuf.length) return false;
        if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;

        const now = Date.now();
        return (now - tokenTime) < TOKEN_TTL_MS;
    } catch {
        return false;
    }
}
