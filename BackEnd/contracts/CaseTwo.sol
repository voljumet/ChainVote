// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;
pragma abicoder v2;

import "./Ownable.sol";
import "./MultiSig.sol";

contract CaseTwo is Ownable, MultiSig {

    constructor() {
        initialize(msg.sender);
    }

      function initialize(address _owner) private {
        require(!_boolStorage["initialized"], "ERR2");
        _addressStorage["owner"] = _owner;
        _boolStorage["initialized"] = true;

        assert( keccak256(abi.encodePacked(
                     _addressStorage["owner"],
                   _boolStorage["initialized"]))
            ==
                keccak256(abi.encodePacked(
                    _owner,
                    true))
        );
    }

    function verifyNewCase()public pure returns(string memory){
            string memory cool = "cool";
            return cool;
    }
}