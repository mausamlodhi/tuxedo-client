interface JewelryCategoryEndpoints {
  list: APIEndPointInterface;
  create: APIEndPointInterface;
  details: (id: number) => APIEndPointInterface;
  update: (id: number) => APIEndPointInterface;
  delete: (id: number) => APIEndPointInterface;
}

const StudsCufflinksCategory: JewelryCategoryEndpoints = {
  list: {
    url: "/jewelry",
    method: "GET",
  },
  create: {
    url: "/jewelry",
    method: "POST",
  },
  details: (id: number) => ({
    url: `/jewelry/${id}`,
    method: "GET",
  }),
  update: (id: number) => ({
    url: `/jewelry/${id}`,
    method: "PATCH",
  }),
  delete: (id: number) => ({
    url: `/jewelry/${id}`,
    method: "DELETE",
  }),
};

export default StudsCufflinksCategory;
