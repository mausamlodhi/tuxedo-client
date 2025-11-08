interface EventDetailsEndpoints {
  create: APIEndPointInterface;
  getEventById: APIEndPointInterface;
  getOutfits: APIEndPointInterface;
  getEvents: APIEndPointInterface;
  saveMeasurement: APIEndPointInterface;
}

const EventDetails: EventDetailsEndpoints = {
  create: {
    url: "/eventDetails",
    method: "POST",
  },

  getEventById: {
    url: "/eventDetails/:id",
    method: "GET",
  },

  getOutfits : {
    url:'/outfit',
    method:'GET',
  },
  getEvents : {
    url : '/eventDetails',
    method:'GET'
  },
  saveMeasurement : {
    url:'/measurement',
    method:'POST'
  }

};

export default EventDetails;
