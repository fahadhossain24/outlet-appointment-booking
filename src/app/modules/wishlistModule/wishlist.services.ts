import { IWishlist } from './wishlist.interface';
import Wishlist from './wishlist.model';

// service for create new wishlist
const createWishlist = async (data: Partial<IWishlist>) => {
  return await Wishlist.create(data);
};

// service for get wishlist by userId
const getWishlistByUserId = async(userId: string) => {
    return await Wishlist.findOne({'user.userId': userId}).populate({
      path: "services.serviceId",
    })
}

// service for get wishlist by id
const getWishlistById = async(id: string) => {
    return await Wishlist.findOne({_id: id})
}

// service for delete wishlist by id
const deleteWishlistById = async(id: string) => {
    return await Wishlist.deleteOne({_id: id})
}

export default {
  createWishlist,
  getWishlistByUserId,
  getWishlistById,
  deleteWishlistById
};
