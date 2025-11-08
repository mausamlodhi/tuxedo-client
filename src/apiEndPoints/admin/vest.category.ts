interface VestCategoryEndpoints {
  list: APIEndPointInterface;
  create: APIEndPointInterface;
  details: (id: number) => APIEndPointInterface;
  update: (id: number) => APIEndPointInterface;
  delete: (id: number) => APIEndPointInterface;
}

const VestCategory: VestCategoryEndpoints = {
  list: {
    url: '/vest',
    method: 'GET',
  },
  create: {
    url: '/vest',
    method: 'POST',
  },
  details:(id:number)=> ({
    url: `/vest/${id}`,
    method: 'GET',
  }),
  update:(id:number)=> ({
    url: `/vest/${id}`,
    method: 'PATCH',
  }),
  delete:(id:number)=> ({
    url: `/vest/${id}`,
    method: 'DELETE',
  }),
};

export default VestCategory;
