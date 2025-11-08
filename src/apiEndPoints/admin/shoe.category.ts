interface ShoeCategoryEndpoints {
  list: APIEndPointInterface;
  create: APIEndPointInterface;
  details: (id: number) => APIEndPointInterface;
  update: (id: number) => APIEndPointInterface;
  delete: (id: number) => APIEndPointInterface;
}

const ShoeCategory: ShoeCategoryEndpoints = {
  list: {
    url: '/shoe',
    method: 'GET',
  },
  create: {
    url: '/shoe',
    method: 'POST',
  },
  details:(id:number)=> ({
    url: `/shoe/${id}`,
    method: 'GET',
  }),
  update:(id:number)=> ({
    url: `/shoe/${id}`,
    method: 'PATCH',
  }),
  delete:(id:number)=> ({
    url: `/shoe/${id}`,
    method: 'DELETE',
  }),
};

export default ShoeCategory;
