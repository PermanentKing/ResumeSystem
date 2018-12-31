pragma solidity ^0.4.23;

contract AccountSystem {

    struct Account {
        address owner;

        string intro;
    }

    struct Employer {
        Account account;
        uint empolyerId;
        uint getResumeCounter;
        // uint introIndex;
        mapping (uint => uint) getResumes;
    }

    struct Employee {
        Account account;
        uint employeeId;
        uint sendResumeCounter;
        mapping (uint => uint) sendResumes;
    }


    uint internal employeeCounter = 1;
    mapping (address => uint) internal employeeIndex;
    mapping (uint => Employee) internal employees; 

    uint internal employerCounter = 1;
    mapping (address => uint) internal employerIndex;
    mapping (uint => Employer) internal employers;

    
    // mapping (address => string) internal intros;

    function createEmployee() public {
        require(employeeIndex[msg.sender] == 0);
        employees[employeeCounter] = Employee(Account(msg.sender, ""), employeeCounter, 0);
        employeeIndex[msg.sender] = employeeCounter;
        employeeCounter++;
    }

    function createEmployer() public {
        require(employerIndex[msg.sender] == 0);
        employers[employerCounter] = Employer(Account(msg.sender, ""), employerCounter, 0);
        employerIndex[msg.sender] = employerCounter;
        // intros[introCounter] = "";
        // introCounter++;
        // intros[msg.sender] = "123123";
        employerCounter++;
    }

    function getEmployeeCount() public view returns(uint) {
        return employeeCounter - 1;
    }

    function getEmployerCount() public view returns(uint) {
        return employerCounter - 1;
    }

    modifier validEmployee(uint index) {
        require(index < employeeCounter);
        _;
    }

    modifier validEmployer(uint index) {
        require(index < employerCounter);
        _;
    }

    function getEmployeeIndex(address owner) public view returns(uint) {
        require(employeeIndex[owner] != 0);
        return employeeIndex[owner];
    }

    function getEmployeeAddress(uint index) public view validEmployee(index) returns(address) {
        return employees[index].account.owner;
    }

    function getEmployerIndex(address owner) public view returns(uint) {
        require(employerIndex[owner] != 0);
        return employerIndex[owner];
    }

    function getEmployerAddress(uint index) public view validEmployer(index) returns(address) {
        return employers[index].account.owner;
    }


    function getEmployeeSendResumeCounter(uint index) public view validEmployee(index) returns(uint) {
        return employees[index].sendResumeCounter;
    }

    function getEmployerGetResumeCounter(uint index) public view validEmployer(index) returns(uint) {
        return employers[index].getResumeCounter;
    }

    function _getEmployeeAt(uint index) internal view validEmployee(index) returns(Employee) {
        return employees[index];
    }

    function _getEmployerAt(uint index) internal view validEmployer(index) returns(Employer) {
        return employers[index];
    }

    function getSendResumeAt(uint employee, uint index) public view returns(uint) {
        require(index < getEmployeeSendResumeCounter(employee));
        return employees[employee].sendResumes[index];
    }

    function getGetResumeAt(uint employer, uint index) public view returns(uint) {
        require(index < getEmployerGetResumeCounter(employer));
        return employers[employer].getResumes[index];
    }

    function setEmployerIntro(string intro, uint employer) public returns(string){
        employers[employer].account.intro = intro;
        return intro;
        
    }



    function getEmployerIntro(uint employer) public view returns(string){
        return employers[employer].account.intro;
        
    }


}