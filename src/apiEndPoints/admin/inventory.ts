interface InventoryEndpoints {
  list: APIEndPointInterface;
}

const Inventory: InventoryEndpoints = {
  list: {
    url: '/inventory-categ',
    method: 'GET',
  },
};

export default Inventory;
