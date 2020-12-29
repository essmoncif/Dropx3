pragma solidity ^0.6.1;


contract File {
    
    string public _file_name;
    string public _hash;
    string public _type;
    address public _creator;
    uint256 public _size;
    uint256 public _created;
    string public _description;
    uint private len = 0;
    mapping(uint => address) private _authorized;
    
    
    
    constructor(string memory filename, string memory description, string memory hash, string memory typep, uint256 size, address creator) public {
        _file_name = filename;
        _description = description;
        _hash = hash;
        _size = size;
        _creator = creator;
        _created = now;
        _type = typep;
        _authorized[len++] = _creator;
    }
    
    function share(address user) public {
        require(!isauthorized(user));
        _authorized[len++] = user;
    }
    
    function remove_user(uint num) public  {
        require(_authorized[num] != _creator, "CANNOT DELETE YOURSELF!");
        delete _authorized[num];
    }
    
    function isauthorized(address user) public view returns(bool){
        for(uint index =0; index < len; index++){
            if(user == _authorized[index]){
                return true;
            }
        }
        return false;
    }
    
    function getUser(uint userId) public view returns(address){
        return _authorized[userId];
    }
    
    function users() public view returns( address[] memory){
        address[] memory userin = new address[](len);
        for(uint index = 0; index < len; index++){
            userin[index] = _authorized[index];
        }
        return userin;
    }
}