// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

import "../../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

contract Storage {

    struct User {
        mapping(string => uint256) _uintUser;
        mapping(string => uint256[]) _uintArrayUser;
        mapping(string => string) _stringUser;
        mapping(string => string[]) _stringArryUser;
        mapping(string => bool) _boolUser;
        mapping(string => address) _addressUser;
        mapping(string => bytes4) _bytesUser;
    }

    struct Case {
        mapping(string => uint256) _uintCase;
        mapping(string => uint256[]) _uintArrayCase;
        mapping(string => string) _stringCase;
        mapping(string => string[]) _stringArrayCase;
        mapping(string => bool) _boolCase;

    }

    // 1 = variable Name |  2 = variable Value
    mapping(string => uint256) _uintStorage;
    mapping(string => uint256[]) _uintArrayStorage;
    mapping(string => string) _stringStorage;
    mapping(string => string[]) _stringArrayStorage;
    mapping(string => address[]) _addressArrayStorage;
    mapping(string => address) _addressStorage;
    mapping(string => bool) _boolStorage;
    mapping(string => bytes4) _bytesStorage;

    mapping(uint => Case) _cases;
    mapping(address => User) _users;
    
}
