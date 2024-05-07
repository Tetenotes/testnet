document.addEventListener('DOMContentLoaded', async () => {
    let provider; 
    let contract; 

    // Contract address and ABI
    const CONTRACT_ADDRESS = "0x23936500673fd669e1f0b09ed6648b2f4425af05";
    const CONTRACT_ABI = [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_title",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                }
            ],
            "name": "listItem",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "buyItem",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "sellItem",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    // Connect to MetaMask wallet
    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.listAccounts();
                const address = accounts[0];
                document.getElementById('walletStatus').innerText = `Wallet Status: Connected (${address})`;
                contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider.getSigner());
            } catch (error) {
                console.error('Failed to connect to wallet:', error);
            }
        } else {
            console.error('MetaMask is not installed');
        }
    }

 
    document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
    document.getElementById('listItemForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newItem = {
            title: formData.get('title'),
            description: formData.get('description'),
            price: formData.get('price')
        };
        try {
            await contract.listItem(newItem.title, newItem.description, ethers.utils.parseEther(newItem.price.toString()));
            console.log('Item listed successfully:', newItem);
            fetchAndRenderItems(); // Refresh items list
        } catch (error) {
            console.error('Error listing item:', error);
        }
    });

    // fetch and render items
    async function fetchAndRenderItems() {
        try {
            const response = await fetch('/products');
            const items = await response.json();
            renderItems(items);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }

    // render items
    function renderItems(items) {
        const itemsList = document.getElementById('itemsList');
        itemsList.innerHTML = '';
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'product';
            itemElement.innerHTML = `
                <p>Title: ${item.title}</p>
                <p>Description: ${item.description}</p>
                <p>Price: ${item.price} ETH</p>
                <button onclick="buyItem('${item.title}', ${item.price})">Buy</button>
                <button onclick="sellItem('${item.title}', ${item.price})">Sell</button>
            `;
            itemsList.appendChild(itemElement);
        });
    }

    // handle buying an item
    async function buyItem(itemName, price) {
        try {
            const transaction = await contract.buyItem(itemName, { value: ethers.utils.parseEther(price.toString()) });
            await transaction.wait();
            console.log('Item purchased successfully:', itemName);
            fetchAndRenderItems(); // Refresh items list after transaction
        } catch (error) {
            console.error('Error buying item:', error);
        }
    }

    // handle selling an item
    async function sellItem(itemName, price) {
        try {
            const transaction = await contract.sellItem(itemName, ethers.utils.parseEther(price.toString()));
            await transaction.wait();
            console.log('Item sold successfully:', itemName);
            fetchAndRenderItems(); // Refresh items list after transaction
        } catch (error) {
            console.error('Error selling item:', error);
        }
    }

    // Fetch and render items when the page loads
    fetchAndRenderItems();
});
