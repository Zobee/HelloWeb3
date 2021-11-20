const main = async () => {
  const helloContractFactory = await hre.ethers.getContractFactory('WorldGreet');
  const helloContract = await helloContractFactory.deploy();
  await helloContract.deployed();
  console.log('Contract deployed to:', helloContract.address);

  let numGreetings;
  numGreetings = await helloContract.getTotalHellos();
  console.log(numGreetings.toNumber());

  let helloTxn = await helloContract.sayHello('A message!');
  await helloTxn.wait(); 

  const [_, randomAddress] = await hre.ethers.getSigners();
  helloTxn = await helloContract.connect(randomAddress).sayHello('Another message!');
  await helloTxn.wait();

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
