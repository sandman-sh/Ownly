import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Starting deployment of OwnlyPassport to Monad Testnet...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "MON");

  const OwnlyPassportFactory = await ethers.getContractFactory("OwnlyPassport");
  const passportContract = await OwnlyPassportFactory.deploy();

  await passportContract.waitForDeployment();

  const contractAddress = await passportContract.getAddress();
  console.log("----------------------------------------------------");
  console.log("OwnlyPassport deployed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Monad Testnet Explorer: https://testnet.monadscan.com/address/" + contractAddress);
  console.log("----------------------------------------------------");

  // Read Artifact ABI
  const artifactPath = path.join(__dirname, "../artifacts/contracts/OwnlyPassport.sol/OwnlyPassport.json");
  let abi: any[] = [];
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    abi = artifact.abi;
  }

  // Export contract info to web app
  const webConfigDir = path.join(__dirname, "../../web/src/config");
  if (!fs.existsSync(webConfigDir)) {
    fs.mkdirSync(webConfigDir, { recursive: true });
  }

  const contractConfigContent = `// Auto-generated deployment file for Monad Testnet
export const OWNLY_PASSPORT_ADDRESS = "${contractAddress}" as const;
export const MONAD_TESTNET_CHAIN_ID = 10143 as const;
export const MONAD_TESTNET_RPC = "https://testnet-rpc.monad.xyz" as const;
export const MONAD_TESTNET_EXPLORER = "https://testnet.monadscan.com" as const;

export const OWNLY_PASSPORT_ABI = ${JSON.stringify(abi, null, 2)} as const;
`;

  fs.writeFileSync(path.join(webConfigDir, "contract.ts"), contractConfigContent);
  console.log("Exported contract address & ABI to web/src/config/contract.ts");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
