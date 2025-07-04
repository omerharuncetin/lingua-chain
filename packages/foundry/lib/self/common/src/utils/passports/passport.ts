import * as forge from 'node-forge';
import { poseidon5 } from 'poseidon-lite';
import {
  hashAlgos,
  k_csca,
  k_dsc,
  k_dsc_3072,
  k_dsc_4096,
  k_dsc_ecdsa,
  n_csca,
  n_dsc,
  n_dsc_3072,
  n_dsc_4096,
  n_dsc_ecdsa,
} from '../../constants/constants.js';
import { bytesToBigDecimal, hexToDecimal, splitToWords } from '../bytes.js';
import {
  CertificateData,
  PublicKeyDetailsECDSA,
  PublicKeyDetailsRSA,
} from '../certificate_parsing/dataStructure.js';
import {
  getCertificateFromPem,
  parseCertificateSimple,
} from '../certificate_parsing/parseCertificateSimple.js';
import { formatInput } from '../circuits/generateInputs.js';
import { findStartIndex, findStartIndexEC } from '../csca.js';
import { hash, packBytesAndPoseidon } from '../hash.js';
import { sha384_512Pad, shaPad } from '../shaPad.js';
import { getLeafDscTree } from '../trees.js';
import { PassportData, SignatureAlgorithm } from '../types.js';
import { formatMrz } from './format.js';
import { parsePassportData } from './passport_parsing/parsePassportData.js';

/// @dev will bruteforce passport and dsc signature
export function initPassportDataParsing(passportData: PassportData, skiPem: any = null) {
  const passportMetadata = parsePassportData(passportData, skiPem);
  passportData.passportMetadata = passportMetadata;
  const dscParsed = parseCertificateSimple(passportData.dsc);
  passportData.dsc_parsed = dscParsed;
  if (passportData.passportMetadata.csca) {
    const cscaParsed = parseCertificateSimple(passportData.passportMetadata.csca);
    passportData.csca_parsed = cscaParsed;
  }
  return passportData;
}

export function generateCommitment(
  secret: string,
  attestation_id: string,
  passportData: PassportData
) {
  const passportMetadata = passportData.passportMetadata;

  const dg1_packed_hash = packBytesAndPoseidon(formatMrz(passportData.mrz));

  const eContent_shaBytes = hash(
    passportMetadata.eContentHashFunction,
    Array.from(passportData.eContent),
    'bytes'
  );

  const eContent_packed_hash = packBytesAndPoseidon(
    (eContent_shaBytes as number[]).map((byte) => byte & 0xff)
  );

  const dsc_hash = getLeafDscTree(passportData.dsc_parsed, passportData.csca_parsed);
  // Log the values used to generate the commitment

  return poseidon5([
    secret,
    attestation_id,
    dg1_packed_hash,
    eContent_packed_hash,
    dsc_hash,
  ]).toString();
}

export function generateNullifier(passportData: PassportData) {
  const signedAttr_shaBytes = hash(
    passportData.passportMetadata.signedAttrHashFunction,
    Array.from(passportData.signedAttr),
    'bytes'
  );
  const signedAttr_packed_hash = packBytesAndPoseidon(
    (signedAttr_shaBytes as number[]).map((byte) => byte & 0xff)
  );
  return signedAttr_packed_hash;
}

export function pad(hashFunction: (typeof hashAlgos)[number]) {
  return hashFunction === 'sha1' || hashFunction === 'sha224' || hashFunction === 'sha256'
    ? shaPad
    : sha384_512Pad;
}

export function padWithZeroes(bytes: number[], length: number) {
  return bytes.concat(new Array(length - bytes.length).fill(0));
}

/// @notice Get the signature of the passport and the public key of the DSC
/// @dev valid for only for the passport/dsc chain
export function getPassportSignatureInfos(passportData: PassportData) {
  const passportMetadata = passportData.passportMetadata;
  const signatureAlgorithmFullName = getSignatureAlgorithmFullName(
    passportData.dsc_parsed,
    passportMetadata.signatureAlgorithm,
    passportMetadata.signedAttrHashFunction
  );
  const { n, k } = getNAndK(signatureAlgorithmFullName as SignatureAlgorithm);

  return {
    pubKey: getCertificatePubKey(
      passportData.dsc_parsed,
      passportMetadata.signatureAlgorithm,
      passportMetadata.signedAttrHashFunction
    ),
    signature: getPassportSignature(passportData, n, k),
    signatureAlgorithmFullName: signatureAlgorithmFullName,
  };
}

function getPassportSignature(passportData: PassportData, n: number, k: number): any {
  const { signatureAlgorithm } = passportData.dsc_parsed;
  if (signatureAlgorithm === 'ecdsa') {
    const { r, s } = extractRSFromSignature(passportData.encryptedDigest);
    const signature_r = splitToWords(BigInt(hexToDecimal(r)), n, k);
    const signature_s = splitToWords(BigInt(hexToDecimal(s)), n, k);
    return [...signature_r, ...signature_s];
  } else {
    return splitToWords(BigInt(bytesToBigDecimal(passportData.encryptedDigest)), n, k);
  }
}

/// @notice Get the public key from the certificate
/// @dev valid for both DSC and CSCA
export function getCertificatePubKey(
  certificateData: CertificateData,
  signatureAlgorithm: string,
  hashFunction: string
): any {
  const signatureAlgorithmFullName = getSignatureAlgorithmFullName(
    certificateData,
    signatureAlgorithm,
    hashFunction
  );
  const { n, k } = getNAndK(signatureAlgorithmFullName as SignatureAlgorithm);
  const { publicKeyDetails } = certificateData;
  if (signatureAlgorithm === 'ecdsa') {
    const { x, y } = publicKeyDetails as PublicKeyDetailsECDSA;
    const x_dsc = splitToWords(BigInt(hexToDecimal(x)), n, k);
    const y_dsc = splitToWords(BigInt(hexToDecimal(y)), n, k);
    return [...x_dsc, ...y_dsc];
  } else {
    const { modulus } = publicKeyDetails as PublicKeyDetailsRSA;
    return splitToWords(BigInt(hexToDecimal(modulus)), n, k);
  }
}

/// @notice Get the public key from the certificate padded as per the DSC circuit's requirements.
export function formatCertificatePubKeyDSC(
  certificateData: CertificateData,
  signatureAlgorithm: string
): string[] {
  const { publicKeyDetails } = certificateData;
  if (signatureAlgorithm === 'ecdsa') {
    const { x, y } = publicKeyDetails as PublicKeyDetailsECDSA;
    // const normalizedX = x.length % 2 === 0 ? x : '0' + x;
    // const normalizedY = y.length % 2 === 0 ? y : '0' + y;
    const fullPubKey = x + y;

    // Splits to 525 words of 8 bits each
    return splitToWords(BigInt(hexToDecimal(fullPubKey)), 8, 525);
  } else {
    // Splits to 525 words of 8 bits each
    const { modulus } = publicKeyDetails as PublicKeyDetailsRSA;
    return splitToWords(BigInt(hexToDecimal(modulus)), 8, 525);
  }
}

export function extractSignatureFromDSC(dscCertificate: string) {
  const cert = getCertificateFromPem(dscCertificate);
  const dscSignature = cert.signatureValue.valueBlock.valueHexView;
  return Array.from(dscSignature);
}

export function formatSignatureDSCCircuit(
  cscaSignatureAlgorithm: string,
  cscaHashFunction: string,
  cscaCertificateData: CertificateData,
  signature: number[]
): string[] {
  const cscaSignatureAlgorithmFullName = getSignatureAlgorithmFullName(
    cscaCertificateData,
    cscaSignatureAlgorithm,
    cscaHashFunction
  );
  const { n, k } = getNAndK(cscaSignatureAlgorithmFullName as SignatureAlgorithm);
  if (cscaSignatureAlgorithm === 'ecdsa') {
    const { r, s } = extractRSFromSignature(signature);
    const signature_r = splitToWords(BigInt(hexToDecimal(r)), n, k);
    const signature_s = splitToWords(BigInt(hexToDecimal(s)), n, k);
    return [...signature_r, ...signature_s];
  } else {
    return formatInput(splitToWords(BigInt(bytesToBigDecimal(signature)), n, k));
  }
}

export function findStartPubKeyIndex(
  certificateData: CertificateData,
  rawCert: any,
  signatureAlgorithm: string
): [number, number] {
  const { publicKeyDetails } = certificateData;
  if (signatureAlgorithm === 'ecdsa') {
    const { x, y } = publicKeyDetails as PublicKeyDetailsECDSA;
    const [x_index, x_totalLength] = findStartIndexEC(x, rawCert);
    const [y_index, y_totalLength] = findStartIndexEC(y, rawCert);

    return [x_index, x_totalLength + y_totalLength];
  } else {
    // Splits to 525 words of 8 bits each
    const { modulus } = publicKeyDetails as PublicKeyDetailsRSA;
    return findStartIndex(modulus, rawCert);
  }
}

/// @notice Get the signature algorithm full name
/// @dev valid for both DSC and CSCA
export function getSignatureAlgorithmFullName(
  certificateData: CertificateData,
  signatureAlgorithm: string,
  hashAlgorithm: string
): string {
  const { publicKeyDetails } = certificateData;
  if (signatureAlgorithm === 'ecdsa') {
    return `${signatureAlgorithm}_${hashAlgorithm}_${(publicKeyDetails as PublicKeyDetailsECDSA).curve}_${publicKeyDetails.bits}`;
  } else {
    const { exponent } = publicKeyDetails as PublicKeyDetailsRSA;
    return `${signatureAlgorithm}_${hashAlgorithm}_${exponent}_${publicKeyDetails.bits}`;
  }
}

export function extractRSFromSignature(signatureBytes: number[]): { r: string; s: string } {
  const derSignature = Buffer.from(signatureBytes).toString('binary');
  const asn1 = forge.asn1.fromDer(derSignature);
  const signatureAsn1 = asn1.value;

  if (signatureAsn1.length !== 2) {
    throw new Error('Invalid signature format');
  }

  if (!Array.isArray(asn1.value) || asn1.value.length !== 2) {
    throw new Error('Invalid signature format');
  }
  const r = forge.util.createBuffer(asn1.value[0].value as string).toHex();
  const s = forge.util.createBuffer(asn1.value[1].value as string).toHex();

  return { r, s };
}

export function getNAndK(sigAlg: SignatureAlgorithm) {
  if (sigAlg === 'rsa_sha256_65537_3072') {
    return { n: n_dsc_3072, k: k_dsc }; // 3072/32 = 96
  }

  if (sigAlg.startsWith('ecdsa_')) {
    if (sigAlg.endsWith('224')) {
      return { n: 32, k: 7 };
    } else if (sigAlg.endsWith('256')) {
      return { n: n_dsc_ecdsa, k: 4 };
    } else if (sigAlg.endsWith('384')) {
      return { n: n_dsc_ecdsa, k: 6 };
    } else if (sigAlg.endsWith('512')) {
      return { n: n_dsc_ecdsa, k: 8 };
    } else if (sigAlg.endsWith('521')) {
      return { n: 66, k: 8 };
    } else {
      throw new Error('invalid key size');
    }
  }

  if (sigAlg.startsWith('rsapss_')) {
    const keyLength = parseInt(sigAlg.split('_')[3]);

    if (keyLength === 3072) {
      return { n: n_dsc_3072, k: k_dsc_3072 }; // 3072/32 = 96
    }

    if (keyLength === 4096) {
      return { n: n_dsc_4096, k: k_dsc_4096 }; // 4096/32 = 128
    }
    return { n: n_dsc, k: k_dsc }; // 2048/32 = 64
  }

  if (sigAlg === 'rsa_sha256_65537_4096' || sigAlg === 'rsa_sha512_65537_4096') {
    return { n: n_dsc_4096, k: k_dsc_4096 }; // 4096/32 = 128
  }

  return { n: n_dsc, k: k_dsc }; // 2048/32 = 64
}

export function getNAndKCSCA(sigAlg: 'rsa' | 'ecdsa' | 'rsapss') {
  const n = sigAlg === 'ecdsa' ? n_dsc_ecdsa : n_csca;
  const k = sigAlg === 'ecdsa' ? k_dsc_ecdsa : k_csca;
  return { n, k };
}
