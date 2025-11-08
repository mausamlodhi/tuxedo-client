import { label } from "framer-motion/m";

export const tieTypes = [
  { value: "neck_tie", label: "Neck Tie" },
  { value: "bow_tie", label: "Bow Tie" },
];

export const pantTypes = [
  { value: "slim_fit", label: "Slim Fit" },
  { value: "ultra_slim_fit", label: "Ultra Slim Fit" },
];

// Location data
export const locations = [
  {
    id: "winston-salem",
    name: "Winston-Salem—Hanes Mall",
    address: "VIP Formal Wear 3320 Silas Creek Pkwy",
    city: "Winston-Salem",
    state: "NC",
    zip: "27103",
    description:
      "Looking for a Winston-Salem tuxedo specialist? You've come to the right place. Located in Hanes Mall, VIP Formal Wear carries a wide selection of tuxedo designers so you can choose the perfect look for your next event.",
    location: "Hanes Mall\nLower Level Next to Belk",
    hours: {
      weekdays: "Monday through Saturday: 11am-8pm",
      sunday: "Sunday: 12pm-6pm",
    },
    phone: "336-760-2205",
    coordinates: { lat: 35.77909, lng: -78.62989 },
  },
  {
    id: "raleigh",
    name: "Raleigh—Crabtree Valley Mall",
    address: "  VIP Formal Wear 4325 Glenwood Ave Suite 1042",
    city: "Raleigh",
    state: "NC",
    zip: "27612",
    description:
      "VIP Formal Wear is Crabtree Valley Mall’s tuxedo specialist. We’re your one-stop shop for all your North Raleigh formal wear needs. Our skilled tuxedo specialists will help you prepare for your next formal event down to the last detail. ",
    location: "Crabtree Valley Mall\nLower Level across from Panera Bread",
    hours: {
      weekdays: "Monday through Saturday: 11am-8pm",
      sunday: "Sunday: 12pm-7pm",
    },
    phone: "919-787-6011",
    coordinates: { lat: 35.88972, lng: -78.656561 },
  },
  {
    id: "garner-area",
    name: "Garner Area—South Wilmington St.",
    address: "VIP Formal Wear 3801 S South Wilmington Street",
    city: "Garner",
    state: "NC",
    zip: "27603",
    description:
      "Visit our Garner Area location for premium formal wear rentals and sales. Our experienced staff will help you find the perfect tuxedo for weddings, proms, and special events.",
    location: "SouthPark Mall\nIntersection of 70E & 401S",
    hours: {
      weekdays: "Monday through Friday: 10am-9pm",
      saturday: "10am-3pm",
      sunday: "sunday closed",
    },
    phone: "704-552-7848",
    coordinates: { lat: 35.1582, lng: -80.8414 },
  },
  {
    id: "greensboro",
    name: "Greensboro—Four Seasons Town Centre",
    address: "VIP Formal Wear 103 Four Seasons Town Centre",
    city: "Greensboro",
    state: "NC",
    zip: "27407",
    description:
      "VIP Formal Wear is Greensboro’s tuxedo specialist. We’re your one-stop shop for all your North Raleigh formal wear needs.O ur skilled tuxedo specialists will help you prepare for your next formal event down to the last detail.",
    location: "Four Seasons Town Centre\nLevel 1 Near JCPenney",
    hours: {
      weekdays: "Monday through Saturday: 11am-8pm",
      sunday: "Sunday: 12pm-7pm",
    },
    phone: "336-323-1695",
    coordinates: { lat: 36.11924, lng: -79.82839 },
  },
];

export const COAT = "Coat";
export const PANT = "Pant";
export const SHIRT = "Shirt";
export const VEST = "Vest";
export const POCKET_SQUARE = "Pocket Square";
export const TIE = "Tie";
export const JEWEL = "Studs & Cufflinks";
export const SHOE = "Shoe";
export const SUSPENDERS = "Suspenders";
export const SOCKS = "Socks";
export const FORMALWEAR="formalwear"

export const occasions = ["Single", "Wedding", "Quinceañeras", "Other"];

export const occasionRoles: Record<string, string[]> = {
  Single: ["Black Tie Event", "Prom", "Graduation"],
  Wedding: [
    "Groom",
    "Ring Bearer",
    "Best Man",
    "Father of the Bride",
    "Father of the Groom",
    "Groomsman",
    "Usher",
  ],
  Quinceañeras: ["Padre de la Quinceañera", "Chambelán"],
};

export const rentalProcess = [
  {
    step: "01",
    title: "Enter event details",
    desc: "Provide the necessary information about your upcoming event. This ensures the right availability for your outfits.",
  },
  {
    step: "02",
    title: "Add outfits & members",
    desc: "Select the desired outfits and add event participants who will need rentals. Ensure everyone is accounted for to streamline fittings and coordination.",
  },
  {
    step: "03",
    title: "Send invite",
    desc: "Invite your group members so they can submit their measurements and preferences. Everyone receives a simple prompt to complete their details online.",
  },
  {
    step: "04",
    title: "Checkout",
    desc: "Review your selections and complete a fast, hassle-free checkout to confirm your rental booking.",
  },
  {
    step: "05",
    title: "Schedule an Appointment at the store",
    desc: "Book a visit to your selected location to try on outfits, confirm the fit, and finalize any last details before your big event.",
  },
];
  export const tier=[
    {value :1, label:"tier 1"},
    {value :2, label:"tier 2"},
    {value :3, label:"tier 3"},
     ]    