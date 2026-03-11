import { printf, toConsole } from "./fable_modules/fable-library-js.4.24.0/String.js";

export const testInt64Value = 123456789n;

export const testLargeInt64 = 9223372036854775807n;

export const boxedSmall = testInt64Value;

export const boxedLarge = testLargeInt64;

toConsole(printf("Small int64 type: %s"))("Object");

toConsole(printf("Small int64 value: %A"))(boxedSmall);

toConsole(printf("Large int64 type: %s"))("Object");

toConsole(printf("Large int64 value: %A"))(boxedLarge);

(function () {
    let arg;
    throw 1;
    toConsole(printf("JavaScript typeof small: %s"))(arg);
})();

(function () {
    let arg;
    throw 1;
    toConsole(printf("JavaScript typeof large: %s"))(arg);
})();

export const isSmallBigInt = (() => {
    throw 1;
})();

export const isLargeBigInt = (() => {
    throw 1;
})();

toConsole(printf("Small is BigInt: %b"))(isSmallBigInt);

toConsole(printf("Large is BigInt: %b"))(isLargeBigInt);

