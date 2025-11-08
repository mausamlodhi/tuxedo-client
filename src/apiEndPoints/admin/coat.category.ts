interface CoatCategoryEndpoints {
  list: APIEndPointInterface;
  create: APIEndPointInterface;
  details: (id: number) => APIEndPointInterface;
  update: (id: number) => APIEndPointInterface;
  delete: (id: number) => APIEndPointInterface;
}

const CoatCategory: CoatCategoryEndpoints = {
  list: {
    url: '/coat',
    method: 'GET',
  },
  create: {
    url: '/coat',
    method: 'POST',
  },
  details:(id:number)=> ({
    url: `/coat/${id}`,
    method: 'GET',
  }),
  update:(id:number)=> ({
    url: `/coat/${id}`,
    method: 'PATCH',
  }),
  delete:(id:number)=> ({
    url: `/coat/${id}`,
    method: 'DELETE',
  }),
};

export default CoatCategory;
