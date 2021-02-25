import {Request, Response} from 'express';
import { getCustomRepository, getRepository} from "typeorm"
import { UsersRepository } from '../repositories/UsersRepository';

class UserController {
    async create(request: Request, response: Response) {
        const {name, email} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);

        // SELECT * FROM USER WHERE EMAIL = "EMAIL" == findOne
        const userAlreadyExists = await usersRepository.findOne({
            email
        })

        if(userAlreadyExists) {
            return response.status(400).json({
                error: "User already exists"
            })
        }

        const user = usersRepository.create({
            name,
            email
        })

        await usersRepository.save(user); 

        return response.json(user);
    }
}

export { UserController }