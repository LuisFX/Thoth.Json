# Changelog: Native BigInt Support

## [Unreleased] - Native int64/uint64 Support

### Added
- **[BREAKING CHANGE - Fable only]** Native `int64` and `uint64` support in Fable 4.28.0+ compilation targets
- Smart encoding strategy: numbers for safe range (`±2^53-1`), strings for precision
- Flexible decoding: handles both number and string inputs automatically
- Comprehensive test suite for BigInt support scenarios

### Changed
- **[Fable]** `Decode.Auto.generateDecoder<'T>()` now works with int64/uint64 without `Extra.withInt64`
- **[Fable]** `Encode.Auto.generateEncoder<'T>()` now works with int64/uint64 without `Extra.withInt64`
- **[Fable]** int64 encoder optimizes for JavaScript safe integer range performance
- **[Fable]** int64 decoder accepts multiple input formats for maximum compatibility

### Deprecated
- **[Fable]** `Extra.withInt64` is no longer needed for Fable 4.28.0+ (still works for backward compatibility)

### Technical Details

#### Encoding Behavior (Fable only)
- Values in range `±9,007,199,254,740,991`: Encoded as JSON numbers
- Values outside safe range: Encoded as JSON strings
- .NET compilation unchanged: All int64 values encoded as strings

#### Decoding Behavior (Fable only)
- Accepts int64 values directly
- Accepts number values (within valid range)
- Accepts string values (parsed to int64)
- .NET compilation unchanged: Parses from strings

#### Migration Impact
```fsharp
// Before (still works)
let extraCoders = Extra.empty |> Extra.withInt64
let decoder = Decode.Auto.generateDecoder<MyRecord>(extra = extraCoders)

// After (recommended)
let decoder = Decode.Auto.generateDecoder<MyRecord>()
```

#### JSON Wire Format Examples
```json
// Safe range values (encoded as numbers)
{"score": 42, "id": 123456789}

// Large values (encoded as strings)
{"cryptoHash": "9223372036854775807"}
```

### Compatibility
- ✅ **Backward Compatible**: Existing code continues to work
- ✅ **Forward Compatible**: New code doesn't need Extra.withInt64
- ✅ **Cross-Platform**: .NET behavior unchanged
- ✅ **JSON Standard**: Compliant with JSON specification
- ✅ **JavaScript Safe**: Respects Number.MAX_SAFE_INTEGER limits

### Performance
- 🚀 **Faster**: Native JavaScript numbers for common values
- 📦 **Smaller**: More compact JSON for typical int64 values
- 🎯 **Precise**: String fallback preserves precision for large values

### Minimum Requirements
- **Fable**: 4.28.0 or later for automatic int64/uint64 support
- **@fable-org/fable-library-js**: 1.11.0 or later (required for native BigInt operations)
- **Earlier Fable**: Continue using `Extra.withInt64` as before
- **.NET**: No changes required

### Installation Requirements

For Fable projects using this enhancement, ensure minimum versions:

```json
{
  "dependencies": {
    "@fable-org/fable-library-js": "^1.11.0"
  }
}
```

```xml
<PackageReference Include="Fable.Core" Version="4.4.0" />
```

### Breaking Changes
- **None**: This is a pure enhancement that maintains backward compatibility
- **Note**: Some Fable apps may see different JSON output format (numbers vs strings) for int64 values in the JavaScript safe integer range

### Credits
Implements native BigInt support for Fable compilation targets while maintaining enterprise-grade JSON compatibility and performance characteristics.