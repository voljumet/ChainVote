// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

import "./SafeMath.sol";

contract Storage {

    // 1. case Number  2. variable Name  3. variable Value
    mapping(uint => mapping(string => uint256)) _uintStorage;
    mapping(uint => mapping(string => uint256[])) _uintArrayStorage;
    mapping(uint => mapping(string => string)) _stringStorage;
    mapping(uint => mapping(string => string[])) _stringArrayStorage;
    mapping(uint => mapping(string => address)) _addressStorage;
    mapping(uint => mapping(string => bool)) _boolStorage;
    mapping(uint => mapping(string => bytes4)) _bytesStorage;
    
}
