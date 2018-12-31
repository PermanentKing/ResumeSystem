pragma solidity ^0.4.23;
import "./ResumeSystem.sol";
import "./AccountSystem.sol";

contract ControlBus is AccountSystem, ResumeSystem {

    function sendResume(string mainTitle, string mainContent, uint length, address _employer) public {
        uint employeeIndex = getEmployeeIndex(msg.sender);
        uint employerIndex = getEmployerIndex(_employer);

        uint resumeIndex = _addResume(msg.sender, _employer, mainTitle, mainContent, length);

        employees[employeeIndex].sendResumes[employees[employeeIndex].sendResumeCounter] = resumeIndex;
        employers[employerIndex].getResumes[employers[employerIndex].getResumeCounter] = resumeIndex;

        // _addWriterOwnedArticle(writerIndex, articleIndex);
        employees[employeeIndex].sendResumeCounter++;
        employers[employerIndex].getResumeCounter++;
        
    }

    // function _addWriterOwnedArticle(uint writerIndex, uint articleIndex) internal validWriter(writerIndex) validArticle(articleIndex) {
    //     writers[writerIndex].account.ownedArticles[writers[writerIndex].account.articleCounter] = OwnedIndex(articleIndex, true);
    //     writers[writerIndex].account.articleCounter++;
    // }

}