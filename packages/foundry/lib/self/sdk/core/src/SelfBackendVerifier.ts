import { ethers } from 'ethers';
import { hashEndpointWithScope } from '@selfxyz/common/utils/scope';
import {
  IdentityVerificationHubImpl,
  IdentityVerificationHubImpl__factory,
  Registry__factory,
  Verifier,
  Verifier__factory,
} from './typechain-types/index.js';
import { discloseIndices } from './utils/constants.js';
import { formatRevealedDataPacked } from './utils/id.js';
import { AttestationId, VcAndDiscloseProof, VerificationConfig } from './types/types.js';
import { Country3LetterCode } from '@selfxyz/common';
import { calculateUserIdentifierHash } from './utils/hash.js';
import { castToUserIdentifier, UserIdType } from '@selfxyz/common/utils/circuits/uuid';
import { ConfigMismatch, ConfigMismatchError } from './errors.js';
import { IConfigStorage } from './store/interface.js';
import { unpackForbiddenCountriesList } from './utils/utils.js';
import { BigNumberish } from 'ethers';

const CELO_MAINNET_RPC_URL = 'https://forno.celo.org';
const CELO_TESTNET_RPC_URL = 'https://alfajores-forno.celo-testnet.org';

const IDENTITY_VERIFICATION_HUB_ADDRESS = '0x0000000000000000000000000000000000000000';
const IDENTITY_VERIFICATION_HUB_ADDRESS_STAGING = '0x68c931C9a534D37aa78094877F46fE46a49F1A51';

export class SelfBackendVerifier {
  protected scope: string;
  protected identityVerificationHubContract: IdentityVerificationHubImpl;
  protected configStorage: IConfigStorage;
  protected provider: ethers.JsonRpcProvider;
  protected allowedIds: Map<AttestationId, boolean>;
  protected userIdentifierType: UserIdType;

  constructor(
    scope: string,
    endpoint: string,
    mockPassport: boolean = false,
    allowedIds: Map<AttestationId, boolean>,
    configStorage: IConfigStorage,
    userIdentifierType: UserIdType
  ) {
    const rpcUrl = mockPassport ? CELO_TESTNET_RPC_URL : CELO_MAINNET_RPC_URL;
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const identityVerificationHubAddress = mockPassport
      ? IDENTITY_VERIFICATION_HUB_ADDRESS_STAGING
      : IDENTITY_VERIFICATION_HUB_ADDRESS;
    this.identityVerificationHubContract = IdentityVerificationHubImpl__factory.connect(
      identityVerificationHubAddress,
      provider
    );
    this.provider = provider;
    this.scope = hashEndpointWithScope(endpoint, scope);
    this.allowedIds = allowedIds;
    this.configStorage = configStorage;
    this.userIdentifierType = userIdentifierType;
  }

  public async verify(
    attestationId: AttestationId,
    proof: VcAndDiscloseProof,
    pubSignals: BigNumberish[],
    userContextData: string
  ) {
    //check if attestation id is allowed
    const allowedId = this.allowedIds.get(attestationId);
    let issues: Array<{ type: ConfigMismatch; message: string }> = [];
    if (!allowedId) {
      issues.push({ type: ConfigMismatch.InvalidId, message: 'Attestation ID is not allowed' });
    }

    const publicSignals = pubSignals.map(String).map((x) => (/[a-f]/g.test(x) ? '0x' + x : x));
    //check if user context hash matches
    const userContextHashInCircuit = BigInt(
      publicSignals[discloseIndices[attestationId].userIdentifierIndex]
    );
    const userContextHash = BigInt(
      calculateUserIdentifierHash(Buffer.from(userContextData, 'hex'))
    );

    if (userContextHashInCircuit !== userContextHash) {
      issues.push({
        type: ConfigMismatch.InvalidUserContextHash,
        message: 'User context hash does not match with the one in the circuit',
      });
    }

    //check if scope matches
    const isValidScope = this.scope === publicSignals[discloseIndices[attestationId].scopeIndex];
    if (!isValidScope) {
      issues.push({
        type: ConfigMismatch.InvalidScope,
        message: 'Scope does not match with the one in the circuit',
      });
    }

    //check the root
    try {
      const registryAddress = await this.identityVerificationHubContract.registry(
        '0x' + attestationId.toString(16).padStart(64, '0')
      );
      if (registryAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error('Registry contract not found');
      }
      const registryContract = Registry__factory.connect(registryAddress, this.provider);
      const currentRoot = await registryContract.checkIdentityCommitmentRoot(
        publicSignals[discloseIndices[attestationId].merkleRootIndex]
      );
      if (!currentRoot) {
        issues.push({
          type: ConfigMismatch.InvalidRoot,
          message: 'Onchain root does not match with the one in the circuit',
        });
      }
    } catch (error) {
      throw new Error('Registry contract not found');
    }

    //check if attestation id matches
    const isValidAttestationId =
      attestationId.toString() === publicSignals[discloseIndices[attestationId].attestationIdIndex];
    if (!isValidAttestationId) {
      issues.push({
        type: ConfigMismatch.InvalidAttestationId,
        message: 'Attestation ID does not match with the one in the circuit',
      });
    }

    const userIdentifier = castToUserIdentifier(
      BigInt('0x' + userContextData.slice(64, 128)),
      this.userIdentifierType
    );
    const userDefinedData = userContextData.slice(128);
    const configId = await this.configStorage.getActionId(userIdentifier, userDefinedData);
    let verificationConfig: VerificationConfig | null;
    try {
      verificationConfig = await this.configStorage.getConfig(configId);
    } catch (error) {
      issues.push({ type: ConfigMismatch.ConfigNotFound, message: 'Config not found' });
    } finally {
      if (!verificationConfig) throw new ConfigMismatchError(issues);
    }

    //check if forbidden countries list matches
    const forbiddenCountriesList: string[] = unpackForbiddenCountriesList(
      [0, 1, 2, 3].map(
        (x) => publicSignals[discloseIndices[attestationId].forbiddenCountriesListPackedIndex + x]
      )
    );
    const forbiddenCountriesListVerificationConfig = verificationConfig.excludedCountries;

    const isForbiddenCountryListValid = forbiddenCountriesListVerificationConfig.every((country) =>
      forbiddenCountriesList.includes(country as Country3LetterCode)
    );
    if (!isForbiddenCountryListValid) {
      issues.push({
        type: ConfigMismatch.InvalidForbiddenCountriesList,
        message: 'Forbidden countries list in config does not match with the one in the circuit',
      });
    }

    const genericDiscloseOutput = formatRevealedDataPacked(attestationId, publicSignals);
    //check if minimum age matches
    const isMinimumAgeValid =
      verificationConfig.olderThan !== undefined
        ? verificationConfig.olderThan === Number.parseInt(genericDiscloseOutput.olderThan, 10) ||
          genericDiscloseOutput.olderThan === '00'
        : true;
    if (!isMinimumAgeValid) {
      issues.push({
        type: ConfigMismatch.InvalidMinimumAge,
        message: 'Minimum age in config does not match with the one in the circuit',
      });
    }

    const circuitTimestampYy = [
      2,
      0,
      publicSignals[discloseIndices[attestationId].currentDateIndex],
      publicSignals[discloseIndices[attestationId].currentDateIndex + 1],
    ];
    const circuitTimestampMm = [
      publicSignals[discloseIndices[attestationId].currentDateIndex + 2],
      publicSignals[discloseIndices[attestationId].currentDateIndex + 3],
    ];
    const circuitTimestampDd = [
      publicSignals[discloseIndices[attestationId].currentDateIndex + 4],
      publicSignals[discloseIndices[attestationId].currentDateIndex + 5],
    ];
    const circuitTimestamp = new Date(
      Number(circuitTimestampYy.join('')),
      Number(circuitTimestampMm.join('')) - 1,
      Number(circuitTimestampDd.join(''))
    );
    const currentTimestamp = new Date();

    //check if timestamp is in the future
    const oneDayAhead = new Date(currentTimestamp.getTime() + 24 * 60 * 60 * 1000);
    if (circuitTimestamp > oneDayAhead) {
      issues.push({
        type: ConfigMismatch.InvalidTimestamp,
        message: 'Circuit timestamp is in the future',
      });
    }

    //check if timestamp is 1 day in the past
    const oneDayAgo = new Date(currentTimestamp.getTime() - 24 * 60 * 60 * 1000);
    if (circuitTimestamp < oneDayAgo) {
      issues.push({
        type: ConfigMismatch.InvalidTimestamp,
        message: 'Circuit timestamp is too old',
      });
    }

    if (!verificationConfig.ofac && genericDiscloseOutput.ofac[0]) {
      issues.push({
        type: ConfigMismatch.InvalidOfac,
        message: 'Passport number OFAC check is not allowed',
      });
    }

    if (!verificationConfig.ofac && genericDiscloseOutput.ofac[1]) {
      issues.push({
        type: ConfigMismatch.InvalidOfac,
        message: 'Name and DOB OFAC check is not allowed',
      });
    }

    if (!verificationConfig.ofac && genericDiscloseOutput.ofac[2]) {
      issues.push({
        type: ConfigMismatch.InvalidOfac,
        message: 'Name and YOB OFAC check is not allowed',
      });
    }

    if (issues.length > 0) {
      throw new ConfigMismatchError(issues);
    }

    let verifierContract: Verifier;
    try {
      const verifierAddress = await this.identityVerificationHubContract.discloseVerifier(
        '0x' + attestationId.toString(16).padStart(64, '0')
      );
      if (verifierAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error('Verifier contract not found');
      }
      verifierContract = Verifier__factory.connect(verifierAddress, this.provider);
    } catch (error) {
      throw new Error('Verifier contract not found');
    }

    let isValid = false;
    try {
      isValid = await verifierContract.verifyProof(
        proof.a,
        [
          [proof.b[0][1], proof.b[0][0]],
          [proof.b[1][1], proof.b[1][0]],
        ],
        proof.c,
        publicSignals
      );
    } catch (error) {
      isValid = false;
    }

    return {
      attestationId,
      isValidDetails: {
        isValid,
        isOlderThanValid:
          verificationConfig.olderThan !== undefined
            ? verificationConfig.olderThan <= Number.parseInt(genericDiscloseOutput.olderThan, 10)
            : true,
        isOfacValid:
          verificationConfig.ofac !== undefined && verificationConfig.ofac
            ? genericDiscloseOutput.ofac.every((enabled: boolean, index: number) =>
                enabled ? genericDiscloseOutput.ofac[index] : true
              )
            : true,
      },
      forbiddenCountriesList,
      discloseOutput: genericDiscloseOutput,
      userData: {
        userIdentifier,
        userDefinedData,
      },
    };
  }
}
