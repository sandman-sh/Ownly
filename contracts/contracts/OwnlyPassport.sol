// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title OwnlyPassport
 * @notice Decentralized Digital Product Passport smart contract deployed on Monad Testnet.
 * @dev Stores product warranties, invoices, ownership history, service records, and SHA-256 integrity hashes on-chain.
 */
contract OwnlyPassport {
    struct AddProductInput {
        string name;
        string brand;
        string category;
        uint256 purchaseDate;
        uint256 warrantyExpiry;
        string storeName;
        string serialNumber;
        string purchasePrice;
        string notes;
        string ipfsInvoiceCid;
        string ipfsImageCid;
        string ipfsWarrantyCid;
        bytes32 fileHash;
    }

    struct ServiceRecord {
        uint256 id;
        uint256 productId;
        uint256 date;
        string serviceCenter;
        string description;
        string ipfsReceiptCid;
        bytes32 receiptHash;
        uint256 timestamp;
    }

    struct OwnershipHistoryItem {
        address fromOwner;
        address toOwner;
        uint256 timestamp;
    }

    struct Product {
        uint256 id;
        address owner;
        string name;
        string brand;
        string category;
        uint256 purchaseDate;
        uint256 warrantyExpiry;
        string storeName;
        string serialNumber;
        string purchasePrice;
        string notes;
        string ipfsInvoiceCid;
        string ipfsImageCid;
        string ipfsWarrantyCid;
        bytes32 fileHash; // SHA-256 hash of invoice/warranty document for integrity verification
        uint256 createdAt;
        bool isDeleted;
    }

    uint256 private _productCounter;
    uint256 private _serviceCounter;

    // productId => Product
    mapping(uint256 => Product) private _products;

    // user address => array of productIds
    mapping(address => uint256[]) private _userProducts;

    // productId => array of ServiceRecord
    mapping(uint256 => ServiceRecord[]) private _productServices;

    // productId => array of OwnershipHistoryItem
    mapping(uint256 => OwnershipHistoryItem[]) private _productOwnershipHistory;

    // Events
    event ProductAdded(
        uint256 indexed productId,
        address indexed owner,
        string name,
        string brand,
        uint256 warrantyExpiry,
        bytes32 fileHash
    );

    event ProductUpdated(
        uint256 indexed productId,
        address indexed owner,
        string name,
        uint256 warrantyExpiry,
        string notes
    );

    event OwnershipTransferred(
        uint256 indexed productId,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 timestamp
    );

    event ServiceAdded(
        uint256 indexed serviceId,
        uint256 indexed productId,
        string serviceCenter,
        uint256 date,
        bytes32 receiptHash
    );

    event ProductDeleted(
        uint256 indexed productId,
        address indexed owner,
        uint256 timestamp
    );

    modifier onlyProductOwner(uint256 productId) {
        require(_products[productId].id != 0, "Ownly: Product does not exist");
        require(!_products[productId].isDeleted, "Ownly: Product has been deleted");
        require(_products[productId].owner == msg.sender, "Ownly: Not the product owner");
        _;
    }

    /**
     * @notice Registers a new Digital Product Passport on-chain.
     */
    function addProduct(AddProductInput calldata input) external returns (uint256) {
        require(bytes(input.name).length > 0, "Ownly: Name cannot be empty");
        require(bytes(input.brand).length > 0, "Ownly: Brand cannot be empty");
        require(input.warrantyExpiry >= input.purchaseDate, "Ownly: Invalid warranty expiry date");

        _productCounter++;
        uint256 newId = _productCounter;

        Product storage p = _products[newId];
        p.id = newId;
        p.owner = msg.sender;
        p.name = input.name;
        p.brand = input.brand;
        p.category = input.category;
        p.purchaseDate = input.purchaseDate;
        p.warrantyExpiry = input.warrantyExpiry;
        p.storeName = input.storeName;
        p.serialNumber = input.serialNumber;
        p.purchasePrice = input.purchasePrice;
        p.notes = input.notes;
        p.ipfsInvoiceCid = input.ipfsInvoiceCid;
        p.ipfsImageCid = input.ipfsImageCid;
        p.ipfsWarrantyCid = input.ipfsWarrantyCid;
        p.fileHash = input.fileHash;
        p.createdAt = block.timestamp;
        p.isDeleted = false;

        _userProducts[msg.sender].push(newId);

        // Record initial ownership history
        _productOwnershipHistory[newId].push(
            OwnershipHistoryItem({
                fromOwner: address(0),
                toOwner: msg.sender,
                timestamp: block.timestamp
            })
        );

        emit ProductAdded(newId, msg.sender, input.name, input.brand, input.warrantyExpiry, input.fileHash);

        return newId;
    }

    /**
     * @notice Updates editable product details (e.g. notes or warranty extension).
     */
    function updateProduct(
        uint256 productId,
        string calldata name,
        uint256 warrantyExpiry,
        string calldata notes
    ) external onlyProductOwner(productId) {
        Product storage p = _products[productId];
        p.name = name;
        p.warrantyExpiry = warrantyExpiry;
        p.notes = notes;

        emit ProductUpdated(productId, msg.sender, name, warrantyExpiry, notes);
    }

    /**
     * @notice Transfers product passport ownership to a new wallet address.
     */
    function transferOwnership(uint256 productId, address newOwner)
        external
        onlyProductOwner(productId)
    {
        require(newOwner != address(0), "Ownly: Invalid recipient address");
        require(newOwner != msg.sender, "Ownly: Cannot transfer to self");

        address previousOwner = msg.sender;
        _products[productId].owner = newOwner;

        // Add to new owner's product list
        _userProducts[newOwner].push(productId);

        // Record ownership history
        _productOwnershipHistory[productId].push(
            OwnershipHistoryItem({
                fromOwner: previousOwner,
                toOwner: newOwner,
                timestamp: block.timestamp
            })
        );

        emit OwnershipTransferred(productId, previousOwner, newOwner, block.timestamp);
    }

    /**
     * @notice Records a new service/maintenance event for a product.
     */
    function addServiceRecord(
        uint256 productId,
        uint256 date,
        string calldata serviceCenter,
        string calldata description,
        string calldata ipfsReceiptCid,
        bytes32 receiptHash
    ) external onlyProductOwner(productId) returns (uint256) {
        _serviceCounter++;
        uint256 serviceId = _serviceCounter;

        ServiceRecord memory record = ServiceRecord({
            id: serviceId,
            productId: productId,
            date: date,
            serviceCenter: serviceCenter,
            description: description,
            ipfsReceiptCid: ipfsReceiptCid,
            receiptHash: receiptHash,
            timestamp: block.timestamp
        });

        _productServices[productId].push(record);

        emit ServiceAdded(serviceId, productId, serviceCenter, date, receiptHash);

        return serviceId;
    }

    /**
     * @notice Soft-deletes a product passport.
     */
    function deleteProduct(uint256 productId) external onlyProductOwner(productId) {
        _products[productId].isDeleted = true;
        emit ProductDeleted(productId, msg.sender, block.timestamp);
    }

    /**
     * @notice Returns all active product passports owned by a user address.
     */
    function getUserProducts(address user) external view returns (Product[] memory) {
        uint256[] memory productIds = _userProducts[user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < productIds.length; i++) {
            uint256 pId = productIds[i];
            if (_products[pId].id != 0 && !_products[pId].isDeleted && _products[pId].owner == user) {
                activeCount++;
            }
        }

        Product[] memory result = new Product[](activeCount);
        uint256 idx = 0;
        for (uint256 i = 0; i < productIds.length; i++) {
            uint256 pId = productIds[i];
            if (_products[pId].id != 0 && !_products[pId].isDeleted && _products[pId].owner == user) {
                result[idx] = _products[pId];
                idx++;
            }
        }

        return result;
    }

    /**
     * @notice Returns detailed product information by ID.
     */
    function getProduct(uint256 productId) external view returns (Product memory) {
        require(_products[productId].id != 0, "Ownly: Product does not exist");
        return _products[productId];
    }

    /**
     * @notice Returns all service records for a product.
     */
    function getServiceRecords(uint256 productId) external view returns (ServiceRecord[] memory) {
        return _productServices[productId];
    }

    /**
     * @notice Returns the full ownership history for a product.
     */
    function getOwnershipHistory(uint256 productId) external view returns (OwnershipHistoryItem[] memory) {
        return _productOwnershipHistory[productId];
    }

    /**
     * @notice Returns total number of created product passports.
     */
    function getTotalProducts() external view returns (uint256) {
        return _productCounter;
    }
}
