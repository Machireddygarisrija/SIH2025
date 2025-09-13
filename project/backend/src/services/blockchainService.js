const Web3 = require('web3');

class BlockchainService {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.isInitialized = false;
    
    // Mock contract ABI for internship allocations
    this.contractABI = [
      {
        "inputs": [
          {"name": "applicantId", "type": "string"},
          {"name": "opportunityId", "type": "string"},
          {"name": "matchScore", "type": "uint256"},
          {"name": "timestamp", "type": "uint256"}
        ],
        "name": "recordAllocation",
        "outputs": [],
        "type": "function"
      },
      {
        "inputs": [{"name": "allocationId", "type": "string"}],
        "name": "getAllocation",
        "outputs": [
          {"name": "applicantId", "type": "string"},
          {"name": "opportunityId", "type": "string"},
          {"name": "matchScore", "type": "uint256"},
          {"name": "timestamp", "type": "uint256"},
          {"name": "verified", "type": "bool"}
        ],
        "type": "function"
      }
    ];
  }

  async initialize() {
    try {
      // In production, connect to actual Ethereum network
      // For demo, we'll use a mock setup
      console.log('🔗 Initializing blockchain service...');
      
      if (process.env.ETHEREUM_RPC_URL) {
        this.web3 = new Web3(process.env.ETHEREUM_RPC_URL);
        
        if (process.env.CONTRACT_ADDRESS) {
          this.contract = new this.web3.eth.Contract(
            this.contractABI,
            process.env.CONTRACT_ADDRESS
          );
        }
      } else {
        // Mock blockchain for development
        this.web3 = { mock: true };
        this.contract = { mock: true };
      }
      
      this.isInitialized = true;
      console.log('✅ Blockchain service initialized');
    } catch (error) {
      console.error('❌ Blockchain initialization failed:', error);
      // Continue with mock service
      this.web3 = { mock: true };
      this.contract = { mock: true };
      this.isInitialized = true;
    }
  }

  async recordAllocation(allocationData) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const { applicantId, opportunityId, matchScore, timestamp } = allocationData;
      
      if (this.contract.mock) {
        // Mock blockchain transaction
        const txHash = this.generateMockTxHash();
        const blockNumber = Math.floor(Math.random() * 1000000) + 15000000;
        
        console.log(`📝 Mock blockchain record: ${txHash}`);
        
        return {
          transactionHash: txHash,
          blockNumber,
          gasUsed: Math.floor(Math.random() * 50000) + 21000,
          status: 'success',
          timestamp: new Date(),
          explorerUrl: `https://etherscan.io/tx/${txHash}`
        };
      }

      // Real blockchain transaction
      const accounts = await this.web3.eth.getAccounts();
      const fromAccount = accounts[0] || process.env.ETHEREUM_ACCOUNT;

      const tx = await this.contract.methods.recordAllocation(
        applicantId,
        opportunityId,
        matchScore,
        timestamp
      ).send({
        from: fromAccount,
        gas: 100000
      });

      return {
        transactionHash: tx.transactionHash,
        blockNumber: tx.blockNumber,
        gasUsed: tx.gasUsed,
        status: tx.status ? 'success' : 'failed',
        timestamp: new Date(),
        explorerUrl: `https://etherscan.io/tx/${tx.transactionHash}`
      };

    } catch (error) {
      console.error('Blockchain recording failed:', error);
      throw new Error('Failed to record allocation on blockchain');
    }
  }

  async getAllocation(allocationId) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      if (this.contract.mock) {
        // Mock allocation data
        return {
          applicantId: allocationId.split('-')[0],
          opportunityId: allocationId.split('-')[1],
          matchScore: Math.floor(Math.random() * 40) + 60,
          timestamp: Date.now() - Math.floor(Math.random() * 86400000),
          verified: true,
          transactionHash: this.generateMockTxHash(),
          blockNumber: Math.floor(Math.random() * 1000000) + 15000000
        };
      }

      const result = await this.contract.methods.getAllocation(allocationId).call();
      return {
        applicantId: result.applicantId,
        opportunityId: result.opportunityId,
        matchScore: parseInt(result.matchScore),
        timestamp: parseInt(result.timestamp),
        verified: result.verified
      };

    } catch (error) {
      console.error('Failed to retrieve allocation from blockchain:', error);
      return null;
    }
  }

  async verifyAllocation(allocationId, expectedData) {
    const blockchainData = await this.getAllocation(allocationId);
    
    if (!blockchainData) {
      return { verified: false, reason: 'Allocation not found on blockchain' };
    }

    // Verify data integrity
    const isValid = (
      blockchainData.applicantId === expectedData.applicantId &&
      blockchainData.opportunityId === expectedData.opportunityId &&
      Math.abs(blockchainData.matchScore - expectedData.matchScore) <= 1
    );

    return {
      verified: isValid,
      blockchainData,
      reason: isValid ? 'Allocation verified successfully' : 'Data mismatch detected'
    };
  }

  async getTransactionHistory(address) {
    if (this.web3.mock) {
      // Mock transaction history
      return Array.from({ length: 10 }, (_, i) => ({
        hash: this.generateMockTxHash(),
        blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
        timestamp: Date.now() - (i * 86400000),
        type: 'allocation',
        status: 'success',
        gasUsed: Math.floor(Math.random() * 50000) + 21000
      }));
    }

    try {
      // Get recent transactions for the address
      const latestBlock = await this.web3.eth.getBlockNumber();
      const transactions = [];

      for (let i = 0; i < 10; i++) {
        const block = await this.web3.eth.getBlock(latestBlock - i, true);
        if (block && block.transactions) {
          const relevantTxs = block.transactions.filter(tx => 
            tx.to === process.env.CONTRACT_ADDRESS
          );
          transactions.push(...relevantTxs);
        }
      }

      return transactions.map(tx => ({
        hash: tx.hash,
        blockNumber: tx.blockNumber,
        timestamp: block.timestamp * 1000,
        type: 'allocation',
        status: 'success',
        gasUsed: tx.gas
      }));

    } catch (error) {
      console.error('Failed to get transaction history:', error);
      return [];
    }
  }

  generateMockTxHash() {
    return '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  async generateComplianceReport() {
    const report = {
      timestamp: new Date(),
      totalAllocations: 0,
      verifiedAllocations: 0,
      blockchainIntegrity: 'healthy',
      recentTransactions: [],
      diversityCompliance: {}
    };

    try {
      // Get recent transaction history
      report.recentTransactions = await this.getTransactionHistory();
      report.totalAllocations = report.recentTransactions.length;
      report.verifiedAllocations = report.recentTransactions.filter(tx => tx.status === 'success').length;

      // Mock diversity compliance data
      report.diversityCompliance = {
        sc: { allocated: 45, target: 50, compliance: 90 },
        st: { allocated: 22, target: 25, compliance: 88 },
        obc: { allocated: 78, target: 80, compliance: 97.5 },
        pwd: { allocated: 12, target: 15, compliance: 80 },
        women: { allocated: 95, target: 100, compliance: 95 },
        rural: { allocated: 105, target: 100, compliance: 105 }
      };

    } catch (error) {
      console.error('Failed to generate compliance report:', error);
      report.blockchainIntegrity = 'error';
    }

    return report;
  }
}

const blockchainService = new BlockchainService();

module.exports = { blockchainService };