pragma solidity ^0.6.1;
pragma experimental ABIEncoderV2;

import "./File.sol";

contract Box {

    mapping(address => address[]) private _userFiles;
    mapping(address => File) private _files;
    address private _owner ;
    
    event Upload(address indexed file, address indexed creator, string hash);
    
    event Share(address indexed file, address indexed creator, address with);
    
    event Remove(address indexed file, address indexed creator, address with);
    
    modifier Authorized(address of_file){
        require(_files[of_file].isauthorized(msg.sender), "UNAUTHORIZED ADDRESS!");
        _;
    }
    
    modifier FileCreator(address of_file){
        require(_files[of_file]._creator() == msg.sender, "CANNOT USE THIS METHOD!");
        _;
    }
    
    constructor() public {
        _owner = msg.sender;
    }
    
    function uploadFile(string memory filename, string memory description, string memory hash, string memory typep, uint256 size) public {
        require(bytes(filename).length > 0);
        require(bytes(hash).length > 0);
        require(msg.sender != address(0));
        File file = new File(filename, description, hash, typep, size, msg.sender);
        _files[address(file)] = file;
        _userFiles[msg.sender].push(address(file));
        emit Upload(address(file), msg.sender, hash);
    }
    
    function addUserToFile(address user, address file) public FileCreator(file) {
        require(user != address(0));
        _files[file].share(user);
        emit Share(file, msg.sender, user);
    }
    
    function removeUser(uint256 userId, address file) public FileCreator(file) {
        address user_address = _files[file].getUser(userId);
        require( user_address != address(0), "ANY USER WITH THIS ID");
        _files[file].remove_user(userId);
        emit Remove(file, msg.sender, user_address);
    }
    
    function fileUsers(address file) public view returns(address[] memory){
        return _files[file].users();
    }
    
    function getFile(address  file) public Authorized(file) view returns (string memory filename, string memory hash, string memory description, uint created ){
        filename = _files[file]._file_name();
        hash = _files[file]._hash();
        description = _files[file]._description();
        created = _files[file]._created();
    }
    
    function getFileOwner(address file) public view returns(address){
        return _files[file]._creator();
    }
    
    function myFiles() public view returns(address[] memory ) {
        return _userFiles[msg.sender];
    }

}