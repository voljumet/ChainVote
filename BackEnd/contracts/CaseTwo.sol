// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;


contract CaseTwo {
    event casetwoemit(string cool);
    function verifyNewCase()public {
            emit casetwoemit("Cool");
    }
}