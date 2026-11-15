
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";
import { keccak256, toBytes } from "viem";

describe("CredentialRegistry", async function () {
  const { viem } = await network.create();

  const publicClient = await viem.getPublicClient();
  const walletClients = await viem.getWalletClients();

  const admin = walletClients[0];
  const university = walletClients[1];
  const verifier = walletClients[2];
  const outsider = walletClients[3];
  const anotherUniversity = walletClients[4];

  async function deployRegistry() {
    const registry = await viem.deployContract(
      "CredentialRegistry",
      [admin.account.address]
    );

    await registry.write.addUniversity([
      university.account.address,
    ]);

    await registry.write.addUniversity([
      anotherUniversity.account.address,
    ]);

    await registry.write.addVerifier([
      verifier.account.address,
    ]);

    return registry;
  }
const credentialId = keccak256(
    toBytes("diploma-001")
);

const documentHash = keccak256(
    toBytes("document-content")
);

  it("1. Admin can add a university", async function () {
    const registry = await deployRegistry();

    const role = await registry.read.UNIVERSITY_ROLE();

    assert.equal(
      await registry.read.hasRole([
        role,
        university.account.address,
      ]),
      true
    );
  });

  it("2. University can issue a credential", async function () {
    const registry = await deployRegistry();

    await registry.write.issueCredential([
      credentialId,
      documentHash,
    ], {
      account: university.account,
    });

    const result = await registry.read.verifyCredential([
      credentialId,
    ], {
      account: verifier.account,
    });

    assert.equal(result[0], documentHash);
    assert.equal(result[1].toLowerCase(), university.account.address.toLowerCase());
    assert.equal(result[3], false);
  });

  it("3. Verifier can check a credential", async function () {
    const registry = await deployRegistry();

    await registry.write.issueCredential([
      credentialId,
      documentHash,
    ], {
      account: university.account,
    });

    const result = await registry.read.verifyCredential([
      credentialId,
    ], {
      account: verifier.account,
    });

    assert.equal(result[0], documentHash);
  });

  it("4. Outsider cannot issue a credential", async function () {
    const registry = await deployRegistry();

    await assert.rejects(
      registry.write.issueCredential(
        [credentialId, documentHash],
        { account: outsider.account }
      )
    );
  });

  it("5. University can revoke its own credential", async function () {
    const registry = await deployRegistry();

    await registry.write.issueCredential([
      credentialId,
      documentHash,
    ], {
      account: university.account,
    });

    await registry.write.revokeCredential(
      [credentialId],
      { account: university.account }
    );

    const result = await registry.read.verifyCredential([
      credentialId,
    ], {
      account: verifier.account,
    });

    assert.equal(result[3], true);
  });

  it("6. University cannot revoke another university's credential", async function () {
    const registry = await deployRegistry();

    await registry.write.issueCredential([
      credentialId,
      documentHash,
    ], {
      account: university.account,
    });

    await assert.rejects(
      registry.write.revokeCredential(
        [credentialId],
        { account: anotherUniversity.account }
      )
    );
  });

  it("7. Duplicate credentials cannot be issued", async function () {
    const registry = await deployRegistry();

    await registry.write.issueCredential([
      credentialId,
      documentHash,
    ], {
      account: university.account,
    });

    await assert.rejects(
      registry.write.issueCredential(
        [credentialId, documentHash],
        { account: university.account }
      )
    );
  });

  it("8. Paused contract cannot issue credentials", async function () {
    const registry = await deployRegistry();

    await registry.write.pause();

    await assert.rejects(
      registry.write.issueCredential(
        [credentialId, documentHash],
        { account: university.account }
      )
    );
  });
});
