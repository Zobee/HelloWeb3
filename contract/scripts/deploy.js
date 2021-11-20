const main = async () => {
  const helloContractFactory = await hre.ethers.getContractFactory('WorldGreet');
  const helloContract = await helloContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.001'),
  });

  await helloContract.deployed();

  console.log('Contract address: ', helloContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();