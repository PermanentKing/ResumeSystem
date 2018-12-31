// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
// import metaCoinArtifact from '../../build/contracts/MetaCoin.json'
import controlBus from '../../build/contracts/ControlBus.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
// const MetaCoin = contract(metaCoinArtifact)

window.ControlBus = contract(controlBus);
window.controlBusInstance = null;

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
// let accounts
// let account

// const App = {
//   start: function () {
//     const self = this

//     // Bootstrap the MetaCoin abstraction for Use.
//     MetaCoin.setProvider(web3.currentProvider)

//     // Get the initial account balance so it can be displayed.
//     web3.eth.getAccounts(function (err, accs) {
//       if (err != null) {
//         alert('There was an error fetching your accounts.')
//         return
//       }

//       if (accs.length === 0) {
//         alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
//         return
//       }

//       accounts = accs
//       account = accounts[0]

//       self.refreshBalance()
//     })
//   },

//   setStatus: function (message) {
//     const status = document.getElementById('status')
//     status.innerHTML = message
//   },

//   refreshBalance: function () {
//     const self = this

//     let meta
//     MetaCoin.deployed().then(function (instance) {
//       meta = instance
//       return meta.getBalance.call(account, { from: account })
//     }).then(function (value) {
//       const balanceElement = document.getElementById('balance')
//       balanceElement.innerHTML = value.valueOf()
//     }).catch(function (e) {
//       console.log(e)
//       self.setStatus('Error getting balance; see log.')
//     })
//   },

//   sendCoin: function () {
//     const self = this

//     const amount = parseInt(document.getElementById('amount').value)
//     const receiver = document.getElementById('receiver').value

//     this.setStatus('Initiating transaction... (please wait)')

//     let meta
//     MetaCoin.deployed().then(function (instance) {
//       meta = instance
//       return meta.sendCoin(receiver, amount, { from: account })
//     }).then(function () {
//       self.setStatus('Transaction complete!')
//       self.refreshBalance()
//     }).catch(function (e) {
//       console.log(e)
//       self.setStatus('Error sending coin; see log.')
//     })
//   }
// }

// window.App = App

// window.addEventListener('load', function () {
//   // Checking if Web3 has been injected by the browser (Mist/MetaMask)
//   if (typeof web3 !== 'undefined') {
//     console.warn(
//       'Using web3 detected from external source.' +
//       ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
//       ' ensure you\'ve configured that source properly.' +
//       ' If using MetaMask, see the following link.' +
//       ' Feel free to delete this warning. :)' +
//       ' http://truffleframework.com/tutorials/truffle-and-metamask'
//     )
//     // Use Mist/MetaMask's provider
//     window.web3 = new Web3(web3.currentProvider)
//   } else {
//     console.warn(
//       'No web3 detected. Falling back to http://127.0.0.1:9545.' +
//       ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
//       ' Consider switching to Metamask for development.' +
//       ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
//     )
//     // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
//     window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
//   }

//   App.start()
// })



let main = new Vue({
  el: '#main',
  data: {
    currentSystem: null,
    mainLoading: false,
    loginStatus: false,

    loginDialogVisible: false,
    isEmployeeLoading: false,
    isEmployerLoading: false,
    currentAccount: undefined,

    accountType: null,
    accountIndex: 0,
    SendCardLabel: "",
    ResumesendLabel: "",
    resumes: [],
    selectResume: {
      resumeId: 0, resumeTitle: "", company: "", resumeContent: ""
    },

    dialogVisible: false,
    employers: [],

    newResume: {
      maintitle: '',
      maincontent: '',
      length: 0,
      to: ''
    },
    NewEmployerIntro: {
      address: '',
      introduce: '',
    },
    sendingResumeDialogVisible: false,


  },
  
  methods: {
    handleMenuSelect: function (key, keyPath) {
      this.currentSystem = key;
      switch(key) {
        case '1-1':
          this.SendCardLabel="SendTo:"
          this.ResumesendLabel="Send To Company: "
          this.loadSendResume();
          break;
        case '1-2':
          this.SendCardLabel="SendFrom:"
          this.ResumesendLabel="Send FromEmp loyer: "
          this.loadSendResume();
          break;
        case '2':
          this.loadEmployer();
          break;
        default:
          this.prepareSetIntro();
          break;
      }
    },
    employeeClick: function() {
      this.isEmployeeLoading = true;

      if (web3.eth.accounts[0] === undefined) {
        this.$message.error("Error: No available account");
        this.isEmployeeLoading = false;
      } else {
        controlBusInstance.getEmployeeIndex(web3.eth.accounts[0])
          .then(result=>{
            this.$message.success("Welcome, employee " + String(web3.eth.accounts[0]));
            this.loginStatus = true;
            this.currentSystem = '0';
            this.isEmployeeLoading = false;
            this.loginDialogVisible = false;
            this.currentAccount = web3.eth.accounts[0];
            this.accountType = 0;
            this.accountIndex = result.toNumber();
          })
          .catch(error=>{
            console.log(error);
            this.$message.info("Creating new account for you...");
            controlBusInstance.createEmployee({from: web3.eth.accounts[0]})
              .then(result=>{
                this.employeeClick();
              })
              .catch(error=>{
                console.log(error);
                this.$message.error("Error: Failed to create new writer account");
                this.isEmployeeLoading = false;
              });
          })
      }
    },
    employerClick: function() {
      this.isEmployerLoading = true;

      if (web3.eth.accounts[0] === undefined) {
        this.$message.error("Error: No available account");
        this.isEmployerLoading = false;
      } else {
        controlBusInstance.getEmployerIndex(web3.eth.accounts[0])
          .then(result=>{
            this.$message.success("Welcome, employer " + String(web3.eth.accounts[0]));
            this.loginStatus = true;
            this.currentSystem = '0';
            this.isEmployerLoading = false;
            this.loginDialogVisible = false;
            this.currentAccount = web3.eth.accounts[0];
            this.accountType = 1;
            this.accountIndex = result.toNumber();
          })
          .catch(error=>{
            console.log(error);
            this.$message.info("Creating new account for you...");
            controlBusInstance.createEmployer({from: web3.eth.accounts[0]})
              .then(result=>{
                this.employerClick();
              })
              .catch(error=>{
                console.log(error);
                this.$message.error("Error: Failed to create new employer account");
                this.isEmployerLoading = false;
              });
          })
      }
    },

    loadSendResume: function() {
      this.mainLoading = true;
      this.resumes.length = 0;
      ((this.accountType === 0) ? controlBusInstance.getEmployeeSendResumeCounter(this.accountIndex) 
        : controlBusInstance.getEmployerGetResumeCounter(this.accountIndex))
        .then(result => {
          let ownedCount = result.toNumber();
          if (ownedCount === 0) {
            this.mainLoading = false;
            return;
          }
          let doneCount = 0;
          for (let i = 0; i < ownedCount; ++i) {
            let personalIndex = Number(i);
            ((this.accountType === 0) ? controlBusInstance.getSendResumeAt(this.accountIndex, personalIndex) 
              : controlBusInstance.getGetResumeAt(this.accountIndex, personalIndex))
            .then(result => {
              let realIndex = result.toNumber(); //change
              if (true) {
                controlBusInstance.getResumeOne(realIndex)
                .then(result => {
                  if(this.accountType === 0){
                    this.resumes.push({
                      resumeId: personalIndex,
                      resumeTitle: result[2],
                      company: String(result[1]),
                      resumeContent: result[3],
                    })
                  }else{
                    this.resumes.push({
                      resumeId: personalIndex,
                      resumeTitle: result[2],
                      company: String(result[0]),
                      resumeContent: result[3],
                    })
                  }
                })
                .catch(error => {
                  this.$message.error("Error: Failed to query resume content");
                  console.log(error);
                })
                .then(() => {
                  if (++doneCount === ownedCount)
                    this.mainLoading = false;
                })
              } else {
                if (++doneCount === ownedCount)
                  this.mainLoading = false;
              }
            })
            .catch(error => {
              this.$message.error("Error: Failed to query resume index");
              console.log(error);
              if (++doneCount === ownedCount)
                  this.mainLoading = false;
            })
          }
        })
        .catch(error => {
          this.$message.error("Error: Failed to query resume count");
          console.log(error);
          this.mainLoading = false;
        })
    },



    viewDetail: function(resumeId) {
      this.dialogVisible = true;
      this.selectResume = this.resumes[resumeId];
      this.selectResumeTitle = this.selectResume.resumeTitle;
    },
    
    sendResumeButtonClick: function(address){
      this.sendingResumeDialogVisible = true;
      this.newResume.to = address;
    },
    sendResumeTo: function() {
      this.$refs['sendResumeForm'].validate((valid) => {
        if (valid) {
          this.$message.info("Sending Resume...");
          controlBusInstance.sendResume(this.newResume.maintitle, this.newResume.maincontent, this.newResume.maincontent.length, this.newResume.to, {
            from: this.currentAccount,
          })
          .then(result => {
            this.$message.success("Your resume has been sent to the company.")
            this.newResume.maintitle = '';
            this.newResume.to = '';
            this.newResume.maincontent = '';
            this.sendingResumeDialogVisible = false;
          })
          .catch(error => {
            this.$message.error("Error: Failed to send resume");
            console.log(error);
          })
          return false;
        } else {
          this.$message.warning("Some mistakes remained in your form.")
          return false;
        }
      });
    },

    loadEmployer: function() {
      this.mainLoading = true;
      this.employers.length = 0;

      controlBusInstance.getEmployerCount()
      .then(result => {
        let employerCount = result.toNumber() + 1;
        if (employerCount === 1) {
          this.mainLoading = false;
          return;
        }
        let doneCount = 1;
        for (let index = 1; index < employerCount; ++index) {
          let employerIndex = Number(index);
          let EMPLOYER = {};
          let isError = false;
          
          controlBusInstance.getEmployerAddress(employerIndex)
          .then(result => {
            EMPLOYER.address = String(result);
            if (EMPLOYER.address !== undefined && EMPLOYER.introduce !== undefined) {
                EMPLOYER.employerId = employerIndex;
                this.employers.push(EMPLOYER);
                if (++doneCount === employerCount)
                  this.mainLoading = false;
            }
          })
          .catch(error => {
            this.$message.error("Error: Failed to query EMPLOYER address");
            console.log(error);
            if (isError === false) {
              isError = true;
              if (++doneCount === employerCount)
                  this.mainLoading = false;
            }
          })

          controlBusInstance.getEmployerIntro(employerIndex)
            .then(result => {
              EMPLOYER.introduce = String(result);
              if (EMPLOYER.address !== undefined && EMPLOYER.introduce !== undefined) {
                  EMPLOYER.employerId = employerIndex;
                  this.employers.push(EMPLOYER);
                  if (++doneCount === employerCount)
                    this.mainLoading = false;
              }
            })
            .catch(error => {
              this.$message.error("Error: Failed to get EMPLOYER introduce");
              console.log(error);
              if (isError === false) {
                isError = true;
                if (++doneCount === employerCount)
                    this.mainLoading = false;
              }
            })
          
        }
      })
      .catch(error => {
        this.$message.error("Error: Failed to query writer count")
        console.log(error);
      })
    },

    setCompanyIntro: function() {
      
      controlBusInstance.setEmployerIntro.sendTransaction(this.NewEmployerIntro.introduce, this.accountIndex, {from: this.currentAccount,gas:5000000})
      .then(result => {
         this.$message.success("Your Company's introduce has been changed! The address of the transaction is: " + result);
         this.NewEmployerIntro.introduce = "";
      })
      .catch(error=>{
        console.log(error);
        this.$message.error("Introduce change failed!");
      })
    },

    prepareSetIntro: function() {
      this.NewEmployerIntro.address = String(this.currentAccount);
    }
    






  },
  
  computed: {
    
  },
  mounted: function() {
    let vueInstance = this;

    if (typeof web3 !== 'undefined') {
      console.warn("Using web3 detected from external source like MetaMask")
      // Use Mist/MetaMask's provider
      window.web3 = new Web3(web3.currentProvider);
    } else {
      console.warn("No web3 detected. Falling back to http://localhost:9545.");
      // fallback - use your fallback strategy
      window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
    }

    window.ControlBus.setProvider(web3.currentProvider);
    window.ControlBus.deployed().then(instance => {window.controlBusInstance = instance});

    // TODO: Check login when clicked
    this.loginDialogVisible = true;

    // setTimeout(function() {
    //   vueInstance.currentSystem = '0';
    //   vueInstance.$message.success("Welcome, Administrator")
    //   vueInstance.loginStatus = true;
    // }, 300);
  },
})

