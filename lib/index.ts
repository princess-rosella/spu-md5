/*
 * Copyright (c) 2018 Princess Rosella. All rights reserved.
 *
 * @LICENSE_HEADER_START@
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @LICENSE_HEADER_END@
 */

export const BLOCK_SIZE   = 64;
export const BLOCK_LENGTH = 16;

const isLittleEndian = new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x78;

const rotl = function(n: number, b: number): number {
    return (n << b) | (n >>> (32 - b));
};

const swab32s = function(n: number): number {
    return (rotl(n, 8) & 0x00FF00FF) | (rotl(n, 24) & 0xFF00FF00);
};

const le32_to_cpu_uint32array = function(array: Uint32Array) {
    if (isLittleEndian)
        return;

    for (let i = 0; i < array.length; i++)
        array[i] = swab32s(array[i]);
};

const cpu_to_le32_uint32array = function(array: Uint32Array) {
    if (isLittleEndian)
        return;

    for (let i = 0; i < array.length; i++)
        array[i] = swab32s(array[i]);
};

const memcpy = function(dest: Uint8Array, destOffset: number, src: Uint8Array, srcOffset: number, length: number): void {
    dest.set(src.subarray(srcOffset, srcOffset + length), destOffset);
};

const bzero = function(dest: Uint8Array, offset: number, length: number): void {
    while (length--)
        dest[offset++] = 0;
}

const FF = function(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    const n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
};

const GG = function(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    const n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
};

const HH = function(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    const n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
};

const II = function(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    const n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
};

const transform = function(block: Uint32Array, hash: Uint32Array) {
    const aa = hash[0];
    const bb = hash[1];
    const cc = hash[2];
    const dd = hash[3];
    let   a  = aa;
    let   b  = bb;
    let   c  = cc;
    let   d  = dd;

    a = FF(a, b, c, d, block[ 0],  7, -680876936);
    d = FF(d, a, b, c, block[ 1], 12, -389564586);
    c = FF(c, d, a, b, block[ 2], 17,  606105819);
    b = FF(b, c, d, a, block[ 3], 22, -1044525330);
    a = FF(a, b, c, d, block[ 4],  7, -176418897);
    d = FF(d, a, b, c, block[ 5], 12,  1200080426);
    c = FF(c, d, a, b, block[ 6], 17, -1473231341);
    b = FF(b, c, d, a, block[ 7], 22, -45705983);
    a = FF(a, b, c, d, block[ 8],  7,  1770035416);
    d = FF(d, a, b, c, block[ 9], 12, -1958414417);
    c = FF(c, d, a, b, block[10], 17, -42063);
    b = FF(b, c, d, a, block[11], 22, -1990404162);
    a = FF(a, b, c, d, block[12],  7,  1804603682);
    d = FF(d, a, b, c, block[13], 12, -40341101);
    c = FF(c, d, a, b, block[14], 17, -1502002290);
    b = FF(b, c, d, a, block[15], 22,  1236535329);

    a = GG(a, b, c, d, block[ 1]|0,  5, -165796510);
    d = GG(d, a, b, c, block[ 6]|0,  9, -1069501632);
    c = GG(c, d, a, b, block[11]|0, 14,  643717713);
    b = GG(b, c, d, a, block[ 0]|0, 20, -373897302);
    a = GG(a, b, c, d, block[ 5]|0,  5, -701558691);
    d = GG(d, a, b, c, block[10]|0,  9,  38016083);
    c = GG(c, d, a, b, block[15]|0, 14, -660478335);
    b = GG(b, c, d, a, block[ 4]|0, 20, -405537848);
    a = GG(a, b, c, d, block[ 9]|0,  5,  568446438);
    d = GG(d, a, b, c, block[14]|0,  9, -1019803690);
    c = GG(c, d, a, b, block[ 3]|0, 14, -187363961);
    b = GG(b, c, d, a, block[ 8]|0, 20,  1163531501);
    a = GG(a, b, c, d, block[13]|0,  5, -1444681467);
    d = GG(d, a, b, c, block[ 2]|0,  9, -51403784);
    c = GG(c, d, a, b, block[ 7]|0, 14,  1735328473);
    b = GG(b, c, d, a, block[12]|0, 20, -1926607734);

    a = HH(a, b, c, d, block[ 5]|0,  4, -378558);
    d = HH(d, a, b, c, block[ 8]|0, 11, -2022574463);
    c = HH(c, d, a, b, block[11]|0, 16,  1839030562);
    b = HH(b, c, d, a, block[14]|0, 23, -35309556);
    a = HH(a, b, c, d, block[ 1]|0,  4, -1530992060);
    d = HH(d, a, b, c, block[ 4]|0, 11,  1272893353);
    c = HH(c, d, a, b, block[ 7]|0, 16, -155497632);
    b = HH(b, c, d, a, block[10]|0, 23, -1094730640);
    a = HH(a, b, c, d, block[13]|0,  4,  681279174);
    d = HH(d, a, b, c, block[ 0]|0, 11, -358537222);
    c = HH(c, d, a, b, block[ 3]|0, 16, -722521979);
    b = HH(b, c, d, a, block[ 6]|0, 23,  76029189);
    a = HH(a, b, c, d, block[ 9]|0,  4, -640364487);
    d = HH(d, a, b, c, block[12]|0, 11, -421815835);
    c = HH(c, d, a, b, block[15]|0, 16,  530742520);
    b = HH(b, c, d, a, block[ 2]|0, 23, -995338651);

    a = II(a, b, c, d, block[ 0]|0,  6, -198630844);
    d = II(d, a, b, c, block[ 7]|0, 10,  1126891415);
    c = II(c, d, a, b, block[14]|0, 15, -1416354905);
    b = II(b, c, d, a, block[ 5]|0, 21, -57434055);
    a = II(a, b, c, d, block[12]|0,  6,  1700485571);
    d = II(d, a, b, c, block[ 3]|0, 10, -1894986606);
    c = II(c, d, a, b, block[10]|0, 15, -1051523);
    b = II(b, c, d, a, block[ 1]|0, 21, -2054922799);
    a = II(a, b, c, d, block[ 8]|0,  6,  1873313359);
    d = II(d, a, b, c, block[15]|0, 10, -30611744);
    c = II(c, d, a, b, block[ 6]|0, 15, -1560198380);
    b = II(b, c, d, a, block[13]|0, 21,  1309151649);
    a = II(a, b, c, d, block[ 4]|0,  6, -145523070);
    d = II(d, a, b, c, block[11]|0, 10, -1120210379);
    c = II(c, d, a, b, block[ 2]|0, 15,  718787259);
    b = II(b, c, d, a, block[ 9]|0, 21, -343485551);

    hash[0] = (a + aa) >>> 0;
    hash[1] = (b + bb) >>> 0;
    hash[2] = (c + cc) >>> 0;
    hash[3] = (d + dd) >>> 0;
};

/**
 * MD5 message-digest algorithm
 */
export class MD5 {
    private hash  = new Uint32Array([1732584193, -271733879, -1732584194, 271733878]);
    private block = new Uint32Array(16);
    private block8: Uint8Array;
    private byteCount = 0;

    constructor() {
        this.block8 = new Uint8Array(this.block.buffer, this.block.byteOffset, this.block.byteLength);
    }

    /**
     * Dynamic version of MD5.update that accepts different types to binary data as parameters.
     * 
     * @param data Data to hash
     * @see MD5.update
     */
    dynamicUpdate(data: Uint8Array | DataView | ArrayBuffer | Buffer): void {
        if (data instanceof DataView)
            data = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        else if (data instanceof ArrayBuffer)
            data = new Uint8Array(data);
        else if (Buffer.isBuffer(data))
            data = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);

        return this.update(data);
    }

    /**
     * Process an array of bytes to hash.
     * 
     * @param data Bytes to hash
     */
    update(data: Uint8Array): void {
        const avail  = (BLOCK_SIZE - (this.byteCount & 0x3f))|0;
        let   length = data.length;

        this.byteCount += length;

        if (avail > length) {
            memcpy(this.block8, BLOCK_SIZE - avail, data, 0, length);
            return;
        }

        memcpy(this.block8, BLOCK_SIZE - avail, data, 0, avail);
        this.transformHelper();

        let offset = avail;
        length -= avail;

        while (length >= BLOCK_SIZE) {
            memcpy(this.block8, 0, data, offset, BLOCK_SIZE);
            this.transformHelper();
            offset += BLOCK_SIZE;
            length -= BLOCK_SIZE;
        }

        memcpy(this.block8, 0, data, offset, length);
    }

    /**
     * Produce the hash as a sequence of 16 bytes.
     */
    toUint8Array(): Uint8Array {
        const offset  = this.byteCount & 0x3f;
        let   p       = offset;
        let   padding = 56 - (offset + 1);

        const block8  = this.block8.slice(0);
        const block   = new Uint32Array(block8.buffer);
        const hash    = this.hash.slice(0);

        block8[p++] = 0x80;
        if (padding < 0) {
            bzero(block8, p, padding + 8);

            if (!isLittleEndian)
                le32_to_cpu_uint32array(block);

            transform(block, hash);
            p       = 0;
            padding = 56;
        }

        bzero(block8, p, padding);
        block[14] = this.byteCount << 3;
        block[15] = this.byteCount >>> 29;

        if (!isLittleEndian) {
            le32_to_cpu_uint32array(block.subarray(0, BLOCK_LENGTH - 2));
            transform(block, hash);
            cpu_to_le32_uint32array(hash);
        }
        else {
            transform(block, hash);
        }
        
        return new Uint8Array(hash.buffer);
    }

    /**
     * Produce the hash as string in hexadecimal format.
     */
    toString(): string {
        let   hex        = "";
        const hash       = this.toUint8Array();
        const hashLength = hash.byteLength;

        for (let i = 0; i < hashLength; i++) {
            hex += ((hash[i] >>> 4)  & 0xF).toString(16);
            hex += ((hash[i] >>> 0)  & 0xF).toString(16);
        }

        return hex;
    }

    private transformHelper() {
        if (!isLittleEndian)
            le32_to_cpu_uint32array(this.block);

        return transform(this.block, this.hash);
    }

    static process(data: Uint8Array | DataView | ArrayBuffer | Buffer): string {
        const md5 = new MD5();
        md5.dynamicUpdate(data);
        return md5.toString();
    }
}
