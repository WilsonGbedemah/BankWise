'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-09-18T17:01:17.194Z',
    '2020-09-21T23:36:17.929Z',
    '2020-09-23T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Displaying the movements of the account ie the deposits and withdrawals.

function formatMovementdate(date, locale){
  
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1)/(1000*60*60*24));

    const daysPassed = calcDaysPassed((new Date(), date));
    if( daysPassed===0)return `Today`;
    if(daysPassed ===1) return `Yesterday`;
    if(daysPassed <=7) return `${daysPassed} days ago`;
    else{
    //   const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth()+1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
    }

};

// Usable Internationalizationof currency function which takes any locale and currency
function formatCur(value, locale, currency){
   return new Intl.NumberFormat(locale,{
    style:'currency',
    currency:currency,
  }).format(value)
};


function displayMovements(acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
 
    const date = new Date(acc.movementsDate[i]);
    const displayDate = formatMovementdate(date, acc.locale)
    
    const formattedMov = formatCur(mov,acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html)
  })
}



//Displaying Total Balance of each account
function calcDisplayBalance(acc) {
  const balance = acc.movements.reduce((acc, mov) =>
    acc + mov, 0);
  acc.balance = balance;
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
}

//Displaying all the transaction summary.
function calcDisplaySummary(acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency); 

  const outgoings = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(outgoings), acc.locale, acc.currency);

  const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate) / 100).filter(int => int >= 1).reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};


//creating username of each account using the forEach for the side effect and the map to create a new string in the accounts object.
function createUsernames(accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(function (name) {
      return name[0];
    }).join('');
  });
};
createUsernames(accounts);

//Creating function to updateUI
function updateUI(acc) {
  //Display movements
  displayMovements(acc);

  //Display balance
  calcDisplayBalance(acc);

  //Display Summary
  calcDisplaySummary(acc);
}
function startLogOutTimer(){
  function tick(){
    const min =String(Math.trunc(time /60)).padStart(2,0);
    const sec = String(time % 60).padStart(2,0);

  //In each call, print the remaining time to UI
  labelTimer.textContent = `${min}:${sec}`;

  

  //When 0 seconds, stop timer and logout user
  if(time === 0){
    clearInterval(timer);
    labelWelcome.textContent = `Log in to get started`, 
    containerApp.style.opacity = 0;
  }
  // decrease 1s
  time--;
}
  //set time to 5 minute

  let time = 300;
  //call timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}
///////////////////////////////////////////////////////////
//Event handlers
let currentAccount, timer;


//Loging In new user
btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting.
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  if (currentAccount ?.pin === +(inputLoginPin.value)) {
    //Display UI and welcome message.
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //Create current date and time
    const now = new Date();
      const options= {
      hour: 'numeric',
      minute: 'numeric',
      day:'numeric',
      month:'numeric',
      year:'numeric',
      // weekday:'long'
    };
      // const locale = navigator.language;
      labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth()+1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0)
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    //Updae UI
    updateUI(currentAccount);


    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

  } else {
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Error, Wrong credentials,  Please try again.`
  }

})


// Tranfering Money to a different account

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';
  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc.username !== currentAccount.username) {

    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add tranfer date
    currentAccount.movementsDate.push(new Date().toISOString());
    receiverAcc.movementsDate.push(new Date().toISOString());

    //Update UI after transfer of funds
    updateUI(currentAccount);

  } else {
    labelTransfer.textContent = `Transfer invalid, Try again`;

    setTimeout(() =>
      labelTransfer.textContent = `Transfer Money`, 5000);
  }

  //Reset Timer
  clearInterval(timer);
  timer = startLogOutTimer();

});


// Requesting for a loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value)
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function() {
      
      // Add movement
    currentAccount.movements.push(amount);

    //Add loan date
    currentAccount.movementsDate.push(new Date().toISOString());

    //updateUI
    updateUI(currentAccount);
  },2500);

  } else if (currentAccount.movements.some(mov => mov < amount * 0.1)) {
    labelLoan.textContent = `Loan amount exceeded, Please try again`;

    setTimeout(() =>
      labelLoan.textContent = `Request Loan`, 5000);

  }
  inputLoanAmount.value = '';

  //Reset Timer
  clearInterval(timer);
  timer = startLogOutTimer();
})


// Closing Account 
btnClose.addEventListener('click', function (e) {
  e.preventDefault();


  if (inputCloseUsername.value === currentAccount.username && +inputClosePin.value === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    //Delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;

  } else if (+inputClosePin !== currentAccount.pin) {
    labelClose.textContent = `Wrong Pin, try again`;
    setTimeout(() =>
      labelClose.textContent = `Close Account`, 5000);

  }
  inputCloseUsername.value = inputClosePin.value = '';
});


// Sorting Movements
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted
});

