# JavaScript MD5

This project implements, in pure JavaScript, and without any dependancies, a way to compute MD5 hashes from binary data.

## Typescript Example

```typescript

import { MD5 } from "spu-md5";

MD5.process(new Uint8Array()) === "d41d8cd98f00b204e9800998ecf8427e";
MD5.process(new Uint8Array([65])) === "7fc56270e7a70fa81a5935b72eacbe29";

const md5 = new MD5();
md5.update(new Uint8Array([65,66]))
md5.update(new Uint8Array([67,68]))
md5.toString() === "cb08ca4a7bb5f9683c19133a84872ca7"
```

## Classes

### MD5

```typescript
export declare const BLOCK_SIZE = 64;
export declare const BLOCK_LENGTH = 16;

/**
 * MD5 message-digest algorithm
 */
export declare class MD5 {
    /**
     * Dynamic version of MD5.update that accepts different types to binary data as parameters.
     *
     * @param data Data to hash
     * @see MD5.update
     */
    dynamicUpdate(data: Uint8Array | DataView | ArrayBuffer | Buffer): void;

    /**
     * Process an array of bytes to hash.
     *
     * @param data Bytes to hash
     */
    update(data: Uint8Array): void;
    
    /**
     * Produce the hash as a sequence of 16 bytes.
     */
    toUint8Array(): Uint8Array;
    
    /**
     * Produce the hash as string in hexadecimal format.
     */
    toString(): string;

    static process(data: Uint8Array | DataView | ArrayBuffer | Buffer): string;
}
```
