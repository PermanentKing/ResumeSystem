pragma solidity ^0.4.23;

contract ResumeSystem {
    struct Content {
        string mainTitle;
        string mainContent;
        uint length;
    }

    struct Resume {
        address employee;
        address employer;
        Content resumeContent;
    }

    uint resumeCounter = 0;
    mapping (uint => Resume) resumes;

    modifier validResume(uint index) {
        require(index < resumeCounter);
        _;
    }

    function _addResume(address _employee, address _employer, string mainTitle, string mainContent, uint length) internal returns(uint)
    {
        resumes[resumeCounter] = Resume(_employee, _employer, Content(mainTitle, mainContent, length));
        return resumeCounter++;
    }

    function getResumeTitle(uint resumeIndex) public view returns(string) {
        require(resumeIndex < resumeCounter);
        return resumes[resumeIndex].resumeContent.mainTitle;
    }

    function getResumeContent(uint resumeIndex) public view returns(string) {
        require(resumeIndex < resumeCounter);
        return resumes[resumeIndex].resumeContent.mainContent;
    }

    function getResumeOne(uint resumeIndex) public view returns(address, address, string, string) {
        require(resumeIndex < resumeCounter);
        return (resumes[resumeIndex].employee, resumes[resumeIndex].employer, resumes[resumeIndex].resumeContent.mainTitle, resumes[resumeIndex].resumeContent.mainContent);
    }


    // function verifyResume(uint resumeIndex, string resume, uint length) public view returns (bool) {
    //     require(resumeIndex < resumeCounter);
    //     return (resumes[resumeIndex].resumeContent.length == length && resumes[resumeIndex].resumeContent.hashedContent == keccak256(abi.encodePacked(keccak256(abi.encodePacked(resume)))));
    // }

    // function _changeOwner(uint resumIndex, address targetOwner) internal {
    //     require(resumIndex < resumeCounter);
    //     require(resumes[resumIndex].owner == msg.sender);
    //     resumes[resumIndex].owner = targetOwner;
    // }

    
}