interface ColorEndpoints {
  list: APIEndPointInterface;
}

const Color: ColorEndpoints = {
  list: {
    url: '/colors',
    method: 'GET',
  },
};

export default Color;
