import { Captian } from "../models/captian.model.js";
import { ApiError } from "../utils/ApiError.js";

const createCaptian  = async ({
    firstname, lastname, email, password, color, plate, capacity, vehicleType
}) => {
    if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new ApiError(401, 'All fields are required');
    }
    const captain = Captian.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        }
    })

    return captain;
}

export default createCaptian