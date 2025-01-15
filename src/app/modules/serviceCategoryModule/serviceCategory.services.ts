import { IServiceCategory } from "./serviceCategory.interface";
import ServiceCategory from "./serviceCategory.model";

// service for create new service category
const createServiceCategory = async(data: Partial<IServiceCategory>) => {
    return await ServiceCategory.create(data);
}

// service for get all service category
const getAllServiceCategory = async() => {
    return await ServiceCategory.find();
}

// service for get specific service category
const getSpecificServiceCategory = async(id: string) => {
    return await ServiceCategory.find({_id: id});
}

export default {
    createServiceCategory,
    getAllServiceCategory,
    getSpecificServiceCategory
}