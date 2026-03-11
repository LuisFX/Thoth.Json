# Native BigInt Support in Thoth.Json

## Native int64/uint64 Support (Fable 4.28.0+)

🚀 **Resolves Issue #173** - Thoth.Json now provides **native support** for `int64` and `uint64` types in Fable compilation targets, **completely eliminating the need for `Extra.withInt64`** when using Fable 4.28.0 or later.

### Why This Enhancement Matters

- **Fable 4.28.0+** compiles int64 to native JavaScript BigInt (`123n`)
- **Previous limitation**: Auto decoders failed with "Cannot generate auto decoder for System.Int64"
- **Solution**: Native BigInt-aware encoder/decoder with smart JSON serialization

### Quick Start

```fsharp
open Thoth.Json

type UserProfile = {
    id: int64          // ✅ Works automatically
    score: uint64      // ✅ Works automatically
    name: string
}

// ✨ No Extra.withInt64 needed!
let decoder = Decode.Auto.generateDecoder<UserProfile>()
let encoder = Encode.Auto.generateEncoder<UserProfile>()

// Example usage
let json = """{"id": 123456789, "score": 987654321, "name": "Alice"}"""
let result = Decode.fromString decoder json
```

### Smart JSON Encoding for Native BigInt

Handles native JavaScript BigInt with intelligent JSON serialization:

| Native BigInt Value | JSON Output | Why |
|---------------------|-------------|-----|
| `123n` (safe range) | `{"id": 123456789}` | Optimal performance & compatibility |
| `9223372036854775807n` (large) | `{"hash": "9223372036854775807"}` | Preserves precision |

**Technical Detail**: Fable 4.28.0+ compiles F# `int64` to JavaScript `BigInt`, and our encoder detects the JavaScript safe integer range (`Number.MAX_SAFE_INTEGER`) to choose the optimal JSON representation.

### Why This Approach?

1. **Performance**: JavaScript numbers for common values
2. **Precision**: String preservation for large values
3. **Compatibility**: Works with all JSON consumers
4. **Standards**: Respects JavaScript/JSON limitations

### Compatibility Matrix

| Scenario | Fable 4.28.0+ | Earlier Fable | .NET |
|----------|---------------|---------------|------|
| Auto-generation | ✅ Native | ❌ Need Extra | ✅ Native |
| Manual encoding | ✅ `Encode.int64` | ❌ Need Extra | ✅ `Encode.int64` |
| Manual decoding | ✅ `Decode.int64` | ❌ Need Extra | ✅ `Decode.int64` |

### Migration from Extra.withInt64

#### Before
```fsharp
let extraCoders =
    Extra.empty
    |> Extra.withInt64

let decoder = Decode.Auto.generateDecoder<MyType>(extra = extraCoders)
let encoder = Encode.Auto.generateEncoder<MyType>(extra = extraCoders)
```

#### After (Recommended)
```fsharp
// ✨ Much simpler!
let decoder = Decode.Auto.generateDecoder<MyType>()
let encoder = Encode.Auto.generateEncoder<MyType>()
```

#### Backward Compatibility
Your existing `Extra.withInt64` code continues to work unchanged.

### Real-World Examples

#### Template Scores (Typical Use Case)
```fsharp
type TemplateChoice = {
    choiceId: int64    // Safe range → JSON number
    score: int64       // Safe range → JSON number
    text: string
}

// JSON output: {"choiceId": 123, "score": 1, "text": "Yes"}
```

#### High-Precision Timestamps
```fsharp
type Event = {
    id: int64                    // Safe range → JSON number
    nanoTimestamp: int64         // May exceed safe range → JSON string
    data: string
}

// JSON output: {"id": 12345, "nanoTimestamp": "1640995200123456789", "data": "..."}
```

#### Cryptographic Values
```fsharp
type SecureToken = {
    tokenId: int64      // Safe range → JSON number
    hash: uint64        // Large value → JSON string
}

// JSON output: {"tokenId": 98765, "hash": "18446744073709551615"}
```

### Performance Characteristics

- **Fast Path**: Values ≤ 2^53-1 use native JavaScript numbers
- **Precision Path**: Values > 2^53-1 use string encoding/parsing
- **Memory**: Optimal JSON size for typical int64 ranges
- **CPU**: Minimal overhead compared to Extra.withInt64

### JavaScript Safe Integer Range

The threshold `9,007,199,254,740,991` (Number.MAX_SAFE_INTEGER) ensures:

✅ **Covers 99.9% of real-world use cases:**
- Database IDs (up to 9 quadrillion)
- Unix timestamps (good until year 285,616,415)
- Medical measurements
- Financial calculations
- Template/form scores

⚠️ **Edge cases requiring string encoding:**
- Cryptographic hashes
- Nanosecond-precision timestamps
- Very large computed values

### Error Handling

The decoder provides clear error messages:

```fsharp
// Invalid number
Decode.fromString Decode.int64 "\"not-a-number\""
// Error: "Error at: `$` Expecting an int64 but instead got: \"not-a-number\""

// Out of range
Decode.fromString Decode.int64 "1e100"
// Error: "Error at: `$` Expecting an int64 but instead got: 1e100"
```

### Testing Your Implementation

Use the included test helpers:

```fsharp
// Test round-trip encoding/decoding
let testValue = 123456789L
let json = Encode.toString 0 (Encode.int64 testValue)
let decoded = Decode.fromString Decode.int64 json

match decoded with
| Ok value when value = testValue -> printfn "✅ Success"
| _ -> printfn "❌ Failed"
```

For comprehensive testing, see `BIGINT_LIBERATION.md` in the repository.