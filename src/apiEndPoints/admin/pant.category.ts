interface PantCategoryEndpoints {
  list: APIEndPointInterface;
  create: APIEndPointInterface;
  details: (id: number) => APIEndPointInterface;
  update: (id: number) => APIEndPointInterface;
  delete: (id: number) => APIEndPointInterface;
}

const PantCategory: PantCategoryEndpoints = {
  list: {
    url: '/pant',
    method: 'GET',
  },
  create: {
    url: '/pant',
    method: 'POST',
  },
  details:(id:number)=> ({
    url: `/pant/${id}`,
    method: 'GET',
  }),
  update:(id:number)=> ({
    url: `/pant/${id}`,
    method: 'PATCH',
  }),
  delete:(id:number)=> ({
    url: `/pant/${id}`,
    method: 'DELETE',
  }),
};

export default PantCategory;
