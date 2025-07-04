import { assert, expect } from 'chai';
import { describe, it } from 'mocha';
import {
  bigIntToString,
  formatEndpoint,
  hashEndpointWithScope,
  stringToBigInt,
} from '../src/utils/scope.js';

describe('Scope Utilities', function () {
  describe('formatEndpoint', function () {
    const testCases = [
      { input: 'https://example.com/path', expected: 'example.com' },
      { input: 'http://subdomain.example.org/path?query=1', expected: 'subdomain.example.org' },
      { input: 'example.net', expected: 'example.net' },
      { input: '', expected: '' },
      { input: 'https://multiple.dots.in.domain.com', expected: 'multiple.dots.in.domain.com' },
      {
        input: 'https://multiple.dots.in.domain.com.that.exceeds.25.chars/path?query=1',
        expected: 'multiple.dots.in.domain.com.that.exceeds.25.chars',
      },
      {
        input: '0x37F5CB8cB1f6B00aa768D8aA99F1A9289802A968',
        expected: '0x37F5CB8cB1f6B00aa768D8aA99F1A9289802A968',
      },
    ];

    testCases.forEach(({ input, expected }) => {
      it(`should format "${input}" to "${expected}"`, () => {
        const result = formatEndpoint(input);
        expect(result).to.equal(expected);
      });
    });
  });

  describe('hashEndpointWithScope', function () {
    it('should hash endpoint and scope correctly', () => {
      const endpoint = 'https://example.com';
      const scope = 'scope1';
      const result = hashEndpointWithScope(endpoint, scope);
      expect(result).to.be.a('string');
      expect(Number.isNaN(Number(result))).to.be.false;
    });

    it('should produce different hashes for different endpoints with same scope', () => {
      const scope = 'scope1';
      const hash1 = hashEndpointWithScope('https://example.com', scope);
      const hash2 = hashEndpointWithScope('https://different.com', scope);

      expect(hash1).to.not.equal(hash2);
    });

    it('should produce different hashes for different scopes with same endpoint', () => {
      const endpoint =
        'https://example-endpoint-that-exceeds-31-but-is-not-too-long-to-be-a-valid-domain-as-the-max-is-496-chars.com';
      const hash1 = hashEndpointWithScope(endpoint, 'scope1');
      const hash2 = hashEndpointWithScope(endpoint, 'scope2');
      expect(hash1).to.not.equal(hash2);
    });

    it('should hash 0x37F5CB8cB1f6B00aa768D8aA99F1A9289802A968 correctly', () => {
      const hash = hashEndpointWithScope('0x37F5CB8cB1f6B00aa768D8aA99F1A9289802A968', 'scope1');
      expect(hash).to.equal(
        '21792212437898267310059828522707476766793174271399605592779109529816681750611'
      );
    });
  });

  describe('stringToBigInt', function () {
    it('should convert various strings to bigint correctly', () => {
      const testCases = [
        'hello-world',
        'test123',
        'UPPERCASE',
        'mixed_CASE_123',
        'symbols!@#$%',
        'short',
        '',
        'a',
        '12345',
        'exactly-31-characters-in-length',
      ];

      for (const str of testCases) {
        const result = stringToBigInt(str);
        const roundTrip = bigIntToString(result);
        expect(roundTrip).to.equal(str, `Failed for string: ${str}`);
      }
    });

    it('should throw an error for strings longer than 25 characters', () => {
      const longScope = '1234567890123456789012345678901212983719283719283791287391287312379123798';
      expect(() => stringToBigInt(longScope)).to.throw(
        'Resulting BigInt exceeds maximum size of 31 bytes'
      );
    });
  });
});
