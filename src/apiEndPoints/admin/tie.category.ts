interface TieCategoryEndpoints {
  list: APIEndPointInterface;
  create: APIEndPointInterface;
  details: (id: number) => APIEndPointInterface;
  update: (id: number) => APIEndPointInterface;
  delete: (id: number) => APIEndPointInterface;
}

const TieCategory: TieCategoryEndpoints = {
  list: {
    url: '/tie',
    method: 'GET',
  },
  create: {
    url: '/tie',
    method: 'POST',
  },
  details:(id:number)=> ({
    url: `/tie/${id}`,
    method: 'GET',
  }),
  update:(id:number)=> ({
    url: `/tie/${id}`,
    method: 'PATCH',
  }),
  delete:(id:number)=> ({
    url: `/tie/${id}`,
    method: 'DELETE',
  }),
};

export default TieCategory;
