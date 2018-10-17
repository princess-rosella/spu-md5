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

import { MD5 } from "../lib/index";

function assert(data: Uint8Array | string, expected: string) {
    let md5 = new MD5();

    if (typeof data === "string") {
        const str = data;
        data = new Uint8Array(str.length);

        for (let i = 0; i < str.length; i++)
            data[i] = str.charCodeAt(i);
    }

    md5.update(data);

    let got = md5.toString();
    if (got !== expected)
        throw new Error(`For message ${data}, expected ${expected}, got ${got}`);

    if (data.byteLength > 4) {
        md5 = new MD5();
        md5.update(data.subarray(0, 1));
        md5.update(data.subarray(1));
        got = md5.toString();

        if (got !== expected)
            throw new Error(`For message ${data}, expected ${expected}, got ${got}`);
    }
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

assert(new Uint8Array(0), "d41d8cd98f00b204e9800998ecf8427e");
assert(new Uint8Array([65]), "7fc56270e7a70fa81a5935b72eacbe29");
assert(new Uint8Array([65,66,67,68]), "cb08ca4a7bb5f9683c19133a84872ca7");
assert(alphabet, "f29939a25efabaef3b87e2cbfe641315");
assert(alphabet + alphabet + alphabet + alphabet, "0269bb6c2060579ecfd687c025ae2b47");
