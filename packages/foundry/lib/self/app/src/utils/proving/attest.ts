// SPDX-License-Identifier: BUSL-1.1; Copyright (c) 2025 Social Connect Labs, Inc.; Licensed under BUSL-1.1 (see LICENSE); Apache-2.0 from 2029-06-11

import { X509Certificate } from '@peculiar/x509';
import { PCR0_MANAGER_ADDRESS, RPC_URL } from '@selfxyz/common';
import { decode } from '@stablelib/cbor';
import { fromBER } from 'asn1js';
import { Buffer } from 'buffer';
import elliptic from 'elliptic';
import { ethers } from 'ethers';
import { sha384 } from 'js-sha512';
import { Certificate } from 'pkijs';

import { AWS_ROOT_PEM } from './awsRootPem';
import cose from './cose';

/**
 * @notice An array specifying the required fields for a valid attestation.
 */
const requiredFields = [
  'module_id',
  'digest',
  'timestamp',
  'pcrs',
  'certificate',
  'cabundle',
];

/**
 * @notice Utility function to check if a number is within (start, end] range.
 * @param start The start of the range (exclusive).
 * @param end The end of the range (inclusive).
 * @param value The number to check.
 * @return True if value is within the range; otherwise, false.
 */
export const numberInRange = (
  start: number,
  end: number,
  value: number,
): boolean => {
  return value > start && value <= end;
};

/**
 * @notice Verifies a certificate chain against a provided trusted root certificate.
 * @param rootPem The trusted root certificate in PEM format.
 * @param certChainStr An array of certificates in PEM format, ordered from leaf to root.
 * @return True if the certificate chain is valid, false otherwise.
 */
export const verifyCertChain = async (
  rootPem: string,
  certChainStr: string[],
): Promise<boolean> => {
  try {
    // Parse all certificates
    const certChain = certChainStr.map(cert => new X509Certificate(cert));

    // Verify the chain from leaf to root
    // certChain[0] is the root, we use the hardcoded rootPem
    for (let i = 1; i < certChain.length; i++) {
      const currentCert = certChain[i];
      // Verify certificate validity period
      const now = new Date();
      if (now < currentCert.notBefore || now > currentCert.notAfter) {
        console.error('Certificate is not within its validity period');
        return false;
      }

      // Verify signature
      try {
        const isValid = verifyCertificateSignature(
          certChainStr[i],
          i === 1 ? rootPem : certChainStr[i - 1],
        );
        if (!isValid) {
          console.error(`Certificate at index ${i} has invalid signature`);
          return false;
        }
      } catch (e) {
        console.error(`Error verifying signature at index ${i}:`, e);
        return false;
      }
    }
    console.log('Certificate chain verified');
    return true;
  } catch (error) {
    console.error('Certificate chain verification error:', error);
    return false;
  }
};

/**
 * @notice Verifies a TEE attestation document encoded as a COSE_Sign1 structure.
 * @param attestation An array of numbers representing the COSE_Sign1 encoded attestation document.
 * @return A promise that resolves to true if the attestation is verified successfully.
 * @throws Error if the attestation document is improperly formatted or missing required fields.
 */
export const verifyAttestation = async (attestation: Array<number>) => {
  const coseSign1 = await decode(Buffer.from(attestation));

  if (!Array.isArray(coseSign1) || coseSign1.length !== 4) {
    throw new Error('Invalid COSE_Sign1 format');
  }

  const [_protectedHeaderBytes, _unprotectedHeader, payload, _signature] =
    coseSign1;

  const attestationDoc = (await decode(payload)) as AttestationDoc;

  for (const field of requiredFields) {
    //@ts-ignore
    if (!attestationDoc[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (!(attestationDoc.module_id.length > 0)) {
    throw new Error('Invalid module_id');
  }
  if (!(attestationDoc.digest === 'SHA384')) {
    throw new Error('Invalid digest');
  }

  if (!(attestationDoc.timestamp > 0)) {
    throw new Error('Invalid timestamp');
  }

  // for each key, value in pcrs
  for (const [key, value] of Object.entries(attestationDoc.pcrs)) {
    if (parseInt(key, 10) < 0 || parseInt(key, 10) >= 32) {
      throw new Error('Invalid pcr index');
    }

    if (![32, 48, 64].includes(value.length)) {
      throw new Error('Invalid pcr value length at: ' + key);
    }
  }

  if (!(attestationDoc.cabundle.length > 0)) {
    throw new Error('Invalid cabundle');
  }

  for (let i = 0; i < attestationDoc.cabundle.length; i++) {
    if (!numberInRange(0, 1024, attestationDoc.cabundle[i].length)) {
      throw new Error('Invalid cabundle');
    }
  }

  if (attestationDoc.public_key) {
    if (!numberInRange(0, 1024, attestationDoc.public_key.length)) {
      throw new Error('Invalid public_key');
    }
  }

  if (attestationDoc.user_data) {
    if (!numberInRange(-1, 512, attestationDoc.user_data.length)) {
      throw new Error('Invalid user_data');
    }
  }

  if (attestationDoc.nonce) {
    if (!numberInRange(-1, 512, attestationDoc.nonce.length)) {
      throw new Error('Invalid nonce');
    }
  }

  const certChain = attestationDoc.cabundle.map((cert: Buffer) =>
    derToPem(cert),
  );

  const cert = derToPem(attestationDoc.certificate);
  const isPCR0Set = await checkPCR0Mapping(attestation);
  console.log('isPCR0Set', isPCR0Set);
  if (!isPCR0Set && !__DEV__) {
    throw new Error('Invalid image hash');
  }
  if (__DEV__ && !isPCR0Set) {
    console.warn('\x1b[31m%s\x1b[0m', '⚠️  WARNING: PCR0 CHECK SKIPPED ⚠️');
  }
  console.log('TEE image hash verified');

  if (!(await verifyCertChain(AWS_ROOT_PEM, [...certChain, cert]))) {
    throw new Error('Invalid certificate chain');
  }

  const { x, y, curve } = getPublicKeyFromPem(cert);

  const verifier = {
    key: {
      x,
      y,
      curve,
    },
  };
  console.log('verifier', verifier);
  await cose.sign.verify(Buffer.from(attestation), verifier, {
    defaultType: 18,
  });
  return true;
};

/**
 * @notice Extracts the public key from a TEE attestation document.
 * @param attestation An array of numbers representing the COSE_Sign1 encoded attestation document.
 * @return The public key as a string.
 */
export function getPublicKey(attestation: Array<number>) {
  const coseSign1 = decode(Buffer.from(attestation));
  const [_protectedHeaderBytes, _unprotectedHeader, payload, _signature] =
    coseSign1;
  const attestationDoc = decode(payload) as AttestationDoc;
  return attestationDoc.public_key;
}

/**
 * @notice Converts a DER-encoded certificate to PEM format.
 * @param der A Buffer containing the DER-encoded certificate.
 * @return The PEM-formatted certificate string.
 * @throws Error if the conversion fails.
 */
function derToPem(der: Buffer): string {
  try {
    const base64 = Buffer.from(der).toString('base64');
    return (
      '-----BEGIN CERTIFICATE-----\n' +
      base64.match(/.{1,64}/g)!.join('\n') +
      '\n-----END CERTIFICATE-----'
    );
  } catch (error) {
    console.error('DER to PEM conversion error:', error);
    throw error;
  }
}

/**
 * @notice Extracts the image hash (PCR0) from the attestation document.
 * @param attestation An array of numbers representing the COSE_Sign1 encoded attestation document.
 * @return The image hash (PCR0) as a hexadecimal string.
 * @throws Error if the COSE_Sign1 format is invalid or PCR0 is missing/incorrect.
 * @see https://docs.aws.amazon.com/enclaves/latest/user/set-up-attestation.html
 */
function getImageHash(attestation: Array<number>) {
  const coseSign1 = decode(Buffer.from(attestation));

  if (!Array.isArray(coseSign1) || coseSign1.length !== 4) {
    throw new Error('Invalid COSE_Sign1 format');
  }
  const [_protectedHeaderBytes, _unprotectedHeader, payload, _signature] =
    coseSign1;
  const attestationDoc = decode(payload);
  if (!attestationDoc.pcrs) {
    throw new Error('Missing required field: pcrs');
  }
  const pcr0 = attestationDoc.pcrs[0];
  if (!pcr0) {
    throw new Error('PCR0 (image hash) is missing in the attestation document');
  }
  if (pcr0.length !== 48) {
    // SHA384 produces a 48-byte hash
    throw new Error(
      `Invalid PCR0 length - expected 48 bytes, got ${pcr0.length} bytes`,
    );
  }
  return Buffer.from(pcr0).toString('hex');
}

type AttestationDoc = {
  module_id: string;
  digest: string;
  timestamp: number;
  pcrs: { [key: number]: Buffer };
  certificate: Buffer;
  cabundle: Array<Buffer>;
  public_key: string | null;
  user_data: string | null;
  nonce: string | null;
};

/**
 * @notice Extracts the public key from a PEM formatted certificate.
 * @param pem A string containing the PEM formatted certificate.
 * @return An object with the x and y coordinates of the public key and the curve used.
 * @see https://docs.aws.amazon.com/enclaves/latest/user/set-up-attestation.html for p384 usage
 * @dev This function parses the certificate using getCertificateFromPem(), then uses the elliptic library
 *      on the "p384" curve to derive the public key's x and y coordinates. This public key is then returned,
 *      ensuring it is padded correctly.
 */
function getPublicKeyFromPem(pem: string) {
  const cert = getCertificateFromPem(pem);
  const curve = 'p384';
  const publicKeyBuffer =
    cert.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHexView;
  const ec = new elliptic.ec(curve);
  const key = ec.keyFromPublic(publicKeyBuffer);
  const x_point = key.getPublic().getX().toString('hex');
  const y_point = key.getPublic().getY().toString('hex');

  const x = x_point.length % 2 === 0 ? x_point : '0' + x_point;
  const y = y_point.length % 2 === 0 ? y_point : '0' + y_point;
  return { x, y, curve };
}

/**
 * @notice Converts a PEM formatted certificate to a PKI.js Certificate object.
 * @param pemContent A string containing the PEM formatted certificate including header/footer markers.
 * @return A Certificate object parsed from the PEM content.
 * @dev The function strips the PEM header/footer and line breaks, decodes the base64 content into binary,
 *      creates an ArrayBuffer, and then parses the ASN.1 structure using fromBER. Throws an error if parsing fails.
 */
function getCertificateFromPem(pemContent: string): Certificate {
  const pemFormatted = pemContent.replace(
    /(-----(BEGIN|END) CERTIFICATE-----|\n|\r)/g,
    '',
  );
  const binary = Buffer.from(pemFormatted, 'base64');
  const arrayBuffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < binary.length; i++) {
    view[i] = binary[i];
  }

  const asn1Data = fromBER(arrayBuffer);
  if (asn1Data.offset === -1) {
    throw new Error(`ASN.1 parsing error: ${asn1Data.result.error}`);
  }

  return new Certificate({ schema: asn1Data.result });
}

function verifyCertificateSignature(child: string, parent: string): boolean {
  const certBuffer_csca = Buffer.from(
    parent.replace(/(-----(BEGIN|END) CERTIFICATE-----|\n)/g, ''),
    'base64',
  );
  const asn1Data_csca = fromBER(certBuffer_csca);
  const cert_csca = new Certificate({ schema: asn1Data_csca.result });
  const publicKeyInfo_csca = cert_csca.subjectPublicKeyInfo;
  const publicKeyBuffer_csca =
    publicKeyInfo_csca.subjectPublicKey.valueBlock.valueHexView;
  const curve = 'p384';
  const ec_csca = new elliptic.ec(curve);
  const key_csca = ec_csca.keyFromPublic(publicKeyBuffer_csca);

  const tbsHash = getTBSHash(child);

  const certBuffer_dsc = Buffer.from(
    child.replace(/(-----(BEGIN|END) CERTIFICATE-----|\n)/g, ''),
    'base64',
  );
  const asn1Data_dsc = fromBER(certBuffer_dsc);
  const cert_dsc = new Certificate({ schema: asn1Data_dsc.result });
  const signatureValue = cert_dsc.signatureValue.valueBlock.valueHexView;
  const signature_crypto = Buffer.from(signatureValue).toString('hex');
  return key_csca.verify(tbsHash, signature_crypto);
}

function getTBSHash(pem: string): string {
  const certBuffer = Buffer.from(
    pem.replace(/(-----(BEGIN|END) CERTIFICATE-----|\n)/g, ''),
    'base64',
  );
  const asn1Data_cert = fromBER(certBuffer);
  const cert = new Certificate({ schema: asn1Data_cert.result });
  const tbsAsn1 = cert.encodeTBS();
  const tbsDer = tbsAsn1.toBER(false);
  const tbsBytes = Buffer.from(tbsDer);
  const tbsBytesArray = Array.from(tbsBytes);
  const msgHash = sha384(tbsBytesArray);
  return msgHash as string;
}

// Minimal ABI containing only the view function we need.
const PCR0ManagerABI = [
  'function isPCR0Set(bytes calldata pcr0) external view returns (bool)',
];

/**
 * @notice Queries the PCR0Manager contract to verify that the PCR0 value extracted from the attestation
 *         is mapped to true.
 * @param attestation An array of numbers representing the COSE_Sign1 encoded attestation document.
 * @return A promise that resolves to true if the PCR0 value is set in the contract, or false otherwise.
 */
export async function checkPCR0Mapping(
  attestation: Array<number>,
): Promise<boolean> {
  // Obtain the PCR0 image hash from the attestation
  const imageHashHex = getImageHash(attestation);
  console.log('imageHash', imageHashHex);
  // The getImageHash function returns a hex string (without the "0x" prefix)
  // For a SHA384 hash, we expect 96 hex characters (48 bytes)
  if (imageHashHex.length !== 96) {
    throw new Error(
      `Invalid PCR0 hash length: expected 96 hex characters, got ${imageHashHex.length}`,
    );
  }

  // Convert the PCR0 hash from hex to a byte array, ensuring proper "0x" prefix
  const pcr0Bytes = ethers.getBytes(`0x${imageHashHex}`);
  if (pcr0Bytes.length !== 48) {
    throw new Error(
      `Invalid PCR0 bytes length: expected 48, got ${pcr0Bytes.length}`,
    );
  }

  const celoProvider = new ethers.JsonRpcProvider(RPC_URL);

  // Create a contract instance for the PCR0Manager
  const pcr0Manager = new ethers.Contract(
    PCR0_MANAGER_ADDRESS,
    PCR0ManagerABI,
    celoProvider,
  );

  try {
    // Query the contract: isPCR0Set returns true if the given PCR0 value is set
    return await pcr0Manager.isPCR0Set(pcr0Bytes);
  } catch (error) {
    console.error('Error checking PCR0 mapping:', error);
    throw error;
  }
}

// Add a helper function to validate and format PCR0 values
export function formatPCR0Value(pcr0: string): Uint8Array {
  // Remove "0x" prefix if present
  const cleanHex = pcr0.startsWith('0x') ? pcr0.slice(2) : pcr0;

  // Validate hex string length (96 characters for 48 bytes)
  if (cleanHex.length !== 96) {
    throw new Error(
      `Invalid PCR0 length: expected 96 hex characters, got ${cleanHex.length}`,
    );
  }

  // Validate hex string format
  if (!/^[0-9a-fA-F]+$/.test(cleanHex)) {
    throw new Error('Invalid hex string: contains non-hex characters');
  }

  // Convert to bytes
  return ethers.getBytes(`0x${cleanHex}`);
}
