interface PocketSquareCategoryEndpoints {
  list: APIEndPointInterface;
  create: APIEndPointInterface;
  details: (id: number) => APIEndPointInterface;
  update: (id: number) => APIEndPointInterface;
  delete: (id: number) => APIEndPointInterface;
}

const PocketSquareCategory: PocketSquareCategoryEndpoints = {
  list: {
    url: '/pocket-square',
    method: 'GET',
  },
  create: {
    url: '/pocket-square',
    method: 'POST',
  },
  details:(id:number)=> ({
    url: `/pocket-square/${id}`,
    method: 'GET',
  }),
  update:(id:number)=> ({
    url: `/pocket-square/${id}`,
    method: 'PATCH',
  }),
  delete:(id:number)=> ({
    url: `/pocket-square/${id}`,
    method: 'DELETE',
  }),
};

export default PocketSquareCategory;
