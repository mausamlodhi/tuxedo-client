interface CustomerManagementEndpoints {
  list: APIEndPointInterface;
  create: APIEndPointInterface;
  details: (id: number) => APIEndPointInterface;
  update: (id: number) => APIEndPointInterface;
  delete: (id: number) => APIEndPointInterface;
}

const CustomerManagement: CustomerManagementEndpoints = {
  list: {
    url: '/customer',
    method: 'GET',
  },
  create: {
    url: '/auth/signup-customer',
    method: 'POST',
  },
  details:(id:number)=> ({
    url: `/customer/${id}`,
    method: 'GET',
  }),
  update:(id:number)=> ({
    url: `/customer/${id}`,
    method: 'PATCH',
  }),
  delete:(id:number)=> ({
    url: `/customer/${id}`,
    method: 'DELETE',
  }),
};

export default CustomerManagement;
