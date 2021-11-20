const main = async () => {
  const helloContractFactory = await hre.ethers.getContractFactory('WorldGreet');
  const helloContract = await helloContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.05'),
  });
  await helloContract.deployed();
  console.log('Contract deployed to:', helloContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(helloContract.address);
  console.log('Contract balance:', hre.ethers.utils.formatEther(contractBalance));

  let helloTxn = await helloContract.sayHello('Konichiwa!');
  await helloTxn.wait(); 

  contractBalance = await hre.ethers.provider.getBalance(helloContract.address);
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allHellos = await helloContract.getAllHellos();
  console.log(allHellos);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
