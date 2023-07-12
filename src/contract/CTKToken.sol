//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint);
    function balanceOf(address _owner) external view returns (uint);
    function transfer(address _to, uint _value) external returns (bool success);

    function approve(address _spender, uint _value) external returns (bool success);
    function allowance(address _owner, address _spender) external view returns (uint remaining);
    function transferFrom(address _from, address _to, uint _value) external returns (bool success);

    event Transfer(address indexed _from, address indexed _to, uint _value);
    event Approve(address indexed _owner, address indexed _spender, uint _value);
}

contract CTKToken is IERC20 {
    string public name = "Cryptokenium";
    string public symbol = "CTK";
    uint public decimals = 18;

    uint public override totalSupply; 

    address public owner;
    mapping(address => uint) public balances;

    mapping(address => mapping(address => uint)) public allowed;

    constructor () {
        totalSupply = 5000 * (10 ** decimals);
        owner = msg.sender;
        balances[owner] = totalSupply;
    }

    function balanceOf(address _owner) public view override returns(uint) {
        return balances[_owner];
    }

    function transfer(address _to, uint _value) public override returns(bool success) {
        require(balances[msg.sender] >= _value);

        balances[msg.sender] -= _value;
        balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function allowance(address _owner,address _spender) public view override returns(uint) {
        return allowed[_owner][_spender];
    }

    function approve(address _spender, uint _value) public override returns(bool success) {
        require(balances[msg.sender] >= _value);
        require(_value > 0);

        allowed[msg.sender][_spender] += _value;

        emit Approve(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint _value) public override returns(bool success) {
        require(allowed[_from][msg.sender] >= _value);
        require(balances[_from] >= _value);


        balances[_from] -= _value;
        allowed[_from][msg.sender] -= _value;
        balances[_to] += _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

}