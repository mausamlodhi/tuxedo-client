interface CollectionEndPoints {
  list: APIEndPointInterface;
  create: APIEndPointInterface;
  details: (id: number) => APIEndPointInterface;
  update: (id: number) => APIEndPointInterface;
  delete: (id: number) => APIEndPointInterface;
}

const Collections: CollectionEndPoints = {
  list: {
    url: '/collection',
    method: 'GET',
  },
  create: {
    url: '/collection',
    method: 'POST',
  },
  details:(id:number)=> ({
    url: `/collection/${id}`,
    method: 'GET',
  }),
  update:(id:number)=> ({
    url: `/collection/${id}`,
    method: 'PATCH',
  }),
  delete:(id:number)=> ({
    url: `/collection/${id}`,
    method: 'DELETE',
  }),
};

export default Collections;
