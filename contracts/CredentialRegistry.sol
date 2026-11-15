// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract CredentialRegistry is AccessControl, Pausable {
    bytes32 public constant UNIVERSITY_ROLE =
        keccak256("UNIVERSITY_ROLE");

    bytes32 public constant VERIFIER_ROLE =
        keccak256("VERIFIER_ROLE");

    struct Credential {
        bytes32 documentHash;
        address issuer;
        uint256 issuedAt;
        bool revoked;
    }

    mapping(bytes32 => Credential) private credentials;

    event CredentialIssued(
        bytes32 indexed credentialId,
        address indexed issuer,
        bytes32 documentHash
    );

    event CredentialRevoked(
        bytes32 indexed credentialId,
        address indexed issuer
    );

    constructor(address admin) {
        require(admin != address(0), "Invalid admin");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function addUniversity(address university)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        grantRole(UNIVERSITY_ROLE, university);
    }

    function addVerifier(address verifier)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        grantRole(VERIFIER_ROLE, verifier);
    }

    function issueCredential(
        bytes32 credentialId,
        bytes32 documentHash
    )
        external
        onlyRole(UNIVERSITY_ROLE)
        whenNotPaused
    {
        require(credentialId != bytes32(0), "Invalid ID");
        require(documentHash != bytes32(0), "Invalid hash");
        require(
            credentials[credentialId].issuedAt == 0,
            "Credential already exists"
        );

        credentials[credentialId] = Credential({
            documentHash: documentHash,
            issuer: msg.sender,
            issuedAt: block.timestamp,
            revoked: false
        });

        emit CredentialIssued(
            credentialId,
            msg.sender,
            documentHash
        );
    }

    function verifyCredential(bytes32 credentialId)
        external
        view
        onlyRole(VERIFIER_ROLE)
        returns (
            bytes32 documentHash,
            address issuer,
            uint256 issuedAt,
            bool revoked
        )
    {
        Credential memory credential = credentials[credentialId];

        require(credential.issuedAt != 0, "Credential not found");

        return (
            credential.documentHash,
            credential.issuer,
            credential.issuedAt,
            credential.revoked
        );
    }

    function revokeCredential(bytes32 credentialId)
        external
        onlyRole(UNIVERSITY_ROLE)
        whenNotPaused
    {
        Credential storage credential = credentials[credentialId];

        require(credential.issuedAt != 0, "Credential not found");
        require(
            credential.issuer == msg.sender,
            "Not the issuing university"
        );
        require(!credential.revoked, "Already revoked");

        credential.revoked = true;

        emit CredentialRevoked(credentialId, msg.sender);
    }

    function pause()
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _pause();
    }

    function unpause()
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _unpause();
    }
}
