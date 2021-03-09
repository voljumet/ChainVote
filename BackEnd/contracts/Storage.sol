// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

contract Storage {

// 1. caseNumber  2. variableName  3. variable
    mapping(uint => mapping(string => uint256)) _uintStorage;
    mapping(uint => mapping(string => string)) _stringStorage;
    mapping(uint => mapping(string => string[])) _stringArrayStorage;
    mapping(uint => mapping(string => address)) _addressStorage;
    mapping(uint => mapping(string => bool)) _boolStorage;
    mapping(uint => mapping(string => bytes4)) _bytesStorage;
    
    address owner;
    bool _initialized;
    uint internal caseNumber;

    // 1. case title, 2. caseNumber. -- mapping to search cases in frontend
    // mapping(string => uint) caseIndexRegister;
    
    // 1. caseNumber, 2. alternativeText, 3. alternativesVotes. -- mapping caseNumber to alternatives.
    // mapping(uint => mapping(string => uint)) caseAlternatives;

}
