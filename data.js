// Sample data. All businesses are made up – replace with your own.
// Positions are approximate spots inside the PUP Sta. Mesa campus.
// Fine-tune them: right-click the exact spot in Google Maps and click the numbers to copy lat/lng.
//
// open/close: 24-hour clock (e.g. 17 = 5:00 PM). If close < open, it closes after midnight.

const STALLS = [
  {
    id: 1,
    name: "Aling Nena's Isawan",
    category: "Street food",
    emoji: "🍢",
    color: "#F2C230",
    area: "Near the main gate",
    lat: 14.5984,
    lng: 121.0105,
    open: 10,
    close: 20,
    rating: 4.7,
    deliveryFee: 15,
    eta: "5–10 min",
    menu: [
      { name: "Isaw (5 sticks)", price: 45, desc: "Grilled chicken intestine, vinegar dip" },
      { name: "Betamax (5 sticks)", price: 40, desc: "Grilled blood cubes" },
      { name: "Kwek-kwek (6 pcs)", price: 50, desc: "Battered quail eggs, sweet sauce" },
      { name: "Fishball cup", price: 25, desc: "With sweet, spicy and vinegar sauces" }
    ]
  },
  {
    id: 2,
    name: "Iskolar Silogan",
    category: "Rice meals",
    emoji: "🍳",
    color: "#6B3FA0",
    area: "Campus canteen area",
    lat: 14.5972,
    lng: 121.0118,
    open: 6,
    close: 18,
    rating: 4.5,
    deliveryFee: 15,
    eta: "5–15 min",
    menu: [
      { name: "Tapsilog", price: 85, desc: "Beef tapa, garlic rice, fried egg" },
      { name: "Longsilog", price: 65, desc: "Longganisa, garlic rice, fried egg" },
      { name: "Tocilog", price: 65, desc: "Sweet cured pork, garlic rice, fried egg" },
      { name: "Iced tea (glass)", price: 20, desc: "House blend" }
    ]
  },
  {
    id: 3,
    name: "Maroon Milk Tea Co.",
    category: "Drinks",
    emoji: "🧋",
    color: "#3E8E6B",
    area: "Beside the oval",
    lat: 14.5990,
    lng: 121.0120,
    open: 9,
    close: 19,
    rating: 4.6,
    deliveryFee: 15,
    eta: "5–10 min",
    menu: [
      { name: "Classic milk tea (L)", price: 75, desc: "Black tea, pearls, 50% sugar" },
      { name: "Wintermelon (L)", price: 80, desc: "Cream cheese foam optional" },
      { name: "Matcha latte (L)", price: 95, desc: "Uji-style matcha, fresh milk" },
      { name: "Add pearls", price: 10, desc: "Extra tapioca" }
    ]
  },
  {
    id: 4,
    name: "Lugaw ni Mang Berto",
    category: "Rice meals",
    emoji: "🥣",
    color: "#D1495B",
    area: "Near the side gate",
    lat: 14.5968,
    lng: 121.0106,
    open: 7,
    close: 17,
    rating: 4.4,
    deliveryFee: 15,
    eta: "5–15 min",
    menu: [
      { name: "Goto (regular)", price: 50, desc: "Beef tripe rice porridge, toasted garlic" },
      { name: "Lugaw with egg", price: 35, desc: "Plain porridge, boiled egg" },
      { name: "Tokwa't baboy", price: 60, desc: "Fried tofu and pork in soy-vinegar" }
    ]
  },
  {
    id: 5,
    name: "Turon Cart ni Ate Joy",
    category: "Dessert",
    emoji: "🍌",
    color: "#E07A1F",
    area: "Walkway near the library",
    lat: 14.5979,
    lng: 121.0128,
    open: 13,
    close: 19,
    rating: 4.8,
    deliveryFee: 10,
    eta: "5–10 min",
    menu: [
      { name: "Turon (3 pcs)", price: 35, desc: "Saba banana and langka in caramelized wrapper" },
      { name: "Banana cue (3 sticks)", price: 30, desc: "Deep-fried, brown sugar glaze" },
      { name: "Maruya (4 pcs)", price: 30, desc: "Banana fritters with sugar" }
    ]
  },
  {
    id: 6,
    name: "Inihaw Corner",
    category: "Grill",
    emoji: "🍗",
    color: "#B5451B",
    area: "Behind the gym",
    lat: 14.5993,
    lng: 121.0108,
    open: 11,
    close: 20,
    rating: 4.6,
    deliveryFee: 20,
    eta: "10–15 min",
    menu: [
      { name: "Chicken inasal (1 pc)", price: 110, desc: "Marinated grilled chicken, rice, atsara" },
      { name: "Liempo (200 g)", price: 140, desc: "Grilled pork belly, soy-calamansi dip" },
      { name: "Grilled bangus", price: 150, desc: "Stuffed milkfish, tomato-onion topping" },
      { name: "Extra rice", price: 15, desc: "" }
    ]
  }
];
