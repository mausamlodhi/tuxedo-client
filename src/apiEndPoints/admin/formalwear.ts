interface FormalwearEndpoints {
  list: APIEndPointInterface;
  create: APIEndPointInterface;
  details: (id: number) => APIEndPointInterface;
  update: (id: number) => APIEndPointInterface;
  delete: (id: number) => APIEndPointInterface;
}

const Formalwear: FormalwearEndpoints = {
  list: {
    url: '/formal-wear',
    method: 'GET',
  },
  create: {
    url: '/formal-wear',
    method: 'POST',
  },
  details:(id:number)=> ({
    url: `/formal-wear/${id}`,
    method: 'GET',
  }),
  update:(id:number)=> ({
    url: `/formal-wear/${id}`,
    method: 'PATCH',
  }),
  delete:(id:number)=> ({
    url: `/formal-wear/${id}`,
    method: 'DELETE',
  }),
};

export default Formalwear;
