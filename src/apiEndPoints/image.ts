interface ImageEndpoints {
  list: APIEndPointInterface;
  add: APIEndPointInterface;
}

const Image: ImageEndpoints = {
  list: {
    url: '/images',
    method: 'GET',
  },
  add:{
    url: '/images',
    method: 'POST',
  }
};

export default Image;
