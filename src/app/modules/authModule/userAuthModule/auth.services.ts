import Outlet from "../../outletModule/outlet.model";
import User from "../../userModule/user.model";

// service for get user by email
const getUserByEmail = async(email: string) => {
    return await User.findOne({email});
}

const getOutletByEmail = async(email: string) => {
    return await Outlet.findOne({email})
}

export default {
    getUserByEmail,
    getOutletByEmail
}
