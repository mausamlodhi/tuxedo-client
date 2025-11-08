interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleteMessage: string;
  confirmMessage: string;
  isLoading?: boolean;
  theme?: boolean | object;
};


interface CollectionInterface {
  id: number;
  categoryId: number;
  colorId: number;
  name: string;
  details: [
    {
      type: string;
      image: string;
    }
  ]

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  colors: {
    id: number;
    name: string;
  };
}

interface ShirtInterface {
  id: number;
  categoryId: number;
  description: string;
  style: string;
  images: string;
  vest: {
    id: number;
    categoryId: number;
    description: string;
    style: string;
  }
  colors: {
    id: number,
    name: string
  }
}

interface SuspendersInterface {
  id: number;
  categoryId: number;
  description: string;
  style: string;
  images: string;
  colors: {
    id: number,
    name: string
  };
  collection_type: {
    id: number;
    categoryId: number;
    colorId: number;
    name: string;
    details: [
      {
        type: string;
        image: string;
      }
    ]
  }
}

interface SocksInterface {
  id: number;
  categoryId: number;
  description: string;
  style: string;
  images: string;
  colors: {
    id: number,
    name: string
  };
  collection_type: {
    id: number;
    categoryId: number;
    colorId: number;
    name: string;
    details: [
      {
        type: string;
        image: string;
      }
    ]
  }
}

interface PantInterface {
  id: number;
  categoryId: number;
  colorId: number;
  description: string;
  style: string;
  image: string;
  slim_fit: boolean;
  ultra_slim_fit: boolean;
}

interface CoatInterface {
  id: number;
  categoryId: number;
  colorId: number;
  description: string;
  style: string;
  image: string;
  slim_fit: boolean;
  ultra_slim_fit: boolean;
}

interface VestInterface {
  id: number;
  categoryId: number;
  style: string;
  description: string;
  bow_tie: string;
  neck_tie: string;
  images: string;
  colors: {
    id: number,
    name: string
  };
}

interface TieInterface {
  id: number;
  categoryId: number;
  style: string;
  description: string;
  matching_pocket_square: string;
  images: string;
  colors: {
    id: number;
    name: string;
  };
}

interface PocketSquareInterface {
  id: number;
  description: string;
  style: string;
  image: string;
}

interface ShoesInterface {
  id: number;
  categoryId: number;
  description: string;
  style: string;
  images: string;
  colors: {
    id: number;
    name: string;
  };
}

interface ColorInterface {
  id: number;
  name: string;
}

interface JewelInterface {
  id: number;
  buy_price: string;
  rental_price: string;
  categoryId: number;
  description: string;
  style: string;
  image: string;
}

interface InventoryInterface {
  id: number;
  name: string;
  createdAt: string;
  deletedAt: string | null;
  updatedAt: string;
  referenceImages: string[];
}