interface ShirtCategoryEndpoints {
  list: APIEndPointInterface;
  create: APIEndPointInterface;
  details: (id: number) => APIEndPointInterface;
  update: (id: number) => APIEndPointInterface;
  delete: (id: number) => APIEndPointInterface;
}

const ShirtCategory: ShirtCategoryEndpoints = {
  list: {
    url: '/shirt',
    method: 'GET',
  },
  create: {
    url: '/shirt',
    method: 'POST',
  },
  details:(id:number)=> ({
    url: `/shirt/${id}`,
    method: 'GET',
  }),
  update:(id:number)=> ({
    url: `/shirt/${id}`,
    method: 'PATCH',
  }),
  delete:(id:number)=> ({
    url: `/shirt/${id}`,
    method: 'DELETE',
  }),
};

export default ShirtCategory;
